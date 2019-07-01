const canonicalize = require("canonical-json");
const sha256 = require('js-sha256');
const has = require('lodash.has');
const CoreDataObject = require("../core/coreDataObject");

class Claim extends CoreDataObject {
    /**
     * Creates and returns an unsigned claim object.
     * @param {Object} claimObj The claim structure object.
     * @param {string} claimObj.id The claim id: https://w3c.github.io/vc-data-model/#identifiers
     * @param {string|bool|number|array|Object|null} claimObj + [your custom property name]. You must include one of these properties, but can include as many of these as you need.
     * @return {Object} The claim object: https://w3c.github.io/vc-data-model/#claims
     * https://w3c.github.io/vc-data-model/#contexts
    */
    create (claimObj) {
        let newClaim = new Claim(this.getPrivateProperty('sdk'));
        for (let key in claimObj) {
            if (has(claimObj, key)) {
                newClaim[key] = claimObj[key];
            }
        }
        return newClaim;
    }

    /**
     * Verifies a signed claim object is structurally valid and signed properly
     * @param {Object} verifyObj The structure for verify an Claim.
     * @param {string} verifyObj.signerPublicKey The public key being used to validate signature(s) with.
     * @param {function} verifyObj.customVerificationMethod An optional custom, user-defined validation method.
     * @return {bool} True if the claim is valid, false otherwise.
    */
    verify({ signerPublicKey, customVerificationMethod }) {
        const structureValid = this.claimStructureValid();
        let validityObject = {
            "@context": "https://project.factom.com/contexts/factom-verify-result-v1.jsonld",
            "structure": {"valid": structureValid}
        };
        let proofValidities = [];
        if (has(this, 'proof')) {
            if (Array.isArray(this['proof'])){
                for (let currentProof of this['proof']){
                    proofValidities.push(this.verifySingleProof(signerPublicKey, currentProof));
                }
            } else {
                let currentProof = this['proof'];
                proofValidities.push(this.verifySingleProof(signerPublicKey, currentProof));
            }

            if (customVerificationMethod !== undefined) {
                validityObject["custom"] = {"valid": customVerificationMethod(this, signerPublicKey), "type": customVerificationMethod.name};
            }
        }

        let allProofsValid = true;
        for (let proofValidity of proofValidities ) {
            if (has(proofValidity, "valid") && !proofValidity.valid) {
                allProofsValid = false;
            }
        }

        validityObject.valid = allProofsValid && structureValid;

        if (proofValidities.length) validityObject.proof = proofValidities;

        return validityObject;
    }

 /**
    * Registers (publishes) a presentation object to a Factom chain through the Connect SDK
    * @param {bool=} registerObj.recursive If true, will register claims, otherwise will register just the credential.
    * @param {bool=} registerObj.hashOnly If true, the hash of the credential will be published to the blockchain rather than a full plaintext representation.
    * @param {string} registerObj.destinationChainId The Factom chain to make the entry into.
    * @param {string} registerObj.signerPrivateKey The private key to sign the Factom entry with.
    * @param {string} registerObj.signerChainId The Factom identity chain ID which is the signatory of the entry.
    * @return {Object} The response from the connect SDK entries.create call.
    */
    async register(registerObj) {
        // If no destination chain id was provided use the default chain from the configure file
        if (registerObj.destinationChainId === undefined
          || !registerObj.destinationChainId.length
          || registerObj.destinationChainId === null) {
            registerObj.destinationChainId = this.getPrivateProperty('sdk').registrationChainId;
        }

        // If destinationChain is undefined, registration cannot proceed
        
        if (registerObj.destinationChainId === undefined) {
            throw new Error('Factom destination chainID required')
        }

        // If destinationChainId is not a 64-byte hex-string, registration cannot proceed
        if (registerObj.destinationChainId.length !== 64 || !(/[0-9A-Fa-f]{64}/g.test(registerObj.destinationChainId))) {
            throw new Error('Factom destination chainID must be a 64-byte hex-string')
        }

        const coreClaim = this.baseData();

        let entryContent;
        if (registerObj.hashOnly === undefined || registerObj.hashOnly) {
            // By default, hashOnly is TRUE, so if the property is undefined, consider it true
            entryContent = sha256(canonicalize(coreClaim));
        } else {
            entryContent = canonicalize(coreClaim);
        }

        let claimEntry = await this.getPrivateProperty('sdk').connect.chains.entries.create({
            chainId: registerObj.destinationChainId,
            signerPrivateKey: registerObj.signerPrivateKey,
            signerChainId: registerObj.signerChainId,
            externalIds: ["type:VerifiableClaim", "version:1"],
            content: entryContent
        });

        let claimPendingEntry = {
            "entityType": "claim",
            "entityHash": sha256(canonicalize(coreClaim)),
            "entryHash": claimEntry.entry_hash,
            "href": "/v1/chains/"+registerObj.destinationChainId+"/"+claimEntry.entry_hash,
            "chain": {
                "href": "/v1/chains/"+registerObj.destinationChainId,
                "chain_id": registerObj.destinationChainId
            }
        };
        if (has(this, 'id')) claimPendingEntry.id = this.id;

        this["_factomMetadata"] = {"pendingFactomEntries": claimPendingEntry};
        return this;
    }

    /**
     * Checks basic structural validity of an alleged claim object.
     * @param {Object} claimObject The claim being checked
     * @return {bool} True if the object has the fields (keys) required to be a claim, false otherwise.
    */
    claimStructureValid () {
        for (let key in this) {
            if (key != 'id' && typeof this[key] !== 'undefined') {
                // If at least one non-id key is present, claim is considered structurally valid
                return true;
            }
        }
        return false;
    }
}

module.exports = Claim;