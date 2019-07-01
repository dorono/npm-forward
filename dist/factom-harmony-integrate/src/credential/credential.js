const canonicalize = require("canonical-json");
const sha256 = require('js-sha256');
const Claim = require("../claim/claim");
const factomproof = require("../util/factom-proof");
const common = require('../util/common');
const has = require('lodash.has');
const CoreDataObject = require("../core/coreDataObject");

class Credential extends CoreDataObject {
    /**
     * Creates and returns an unsigned credential object.
     * @param {string} credentialObj.id The credential id: https://w3c.github.io/vc-data-model/#identifiers
     * @param {string} credentialObj.issuer The ID of the issuer of the VC: https://w3c.github.io/vc-data-model/#issuer
     * @param {string} credentialObj.issuanceDate The date the credential was issued: https://w3c.github.io/vc-data-model/#issuance-date
     * @param {[Object]} credentialObj.credentialSubject An array (or singular object) representing the claim(s) in the credential
     * @param {[Object]} credentialObj.expirationDate Optional date on which the credential expires
     * @param {Object=} credentialObj Optional additional key/value pairs in the credential object.
     * @return {Object} The credential object: https://w3c.github.io/vc-data-model/#credentials
     * https://w3c.github.io/vc-data-model/#contexts
    */
    create(credentialObj) {
        if ( !credentialObj.issuer || credentialObj.issuer === undefined ) throw new Error('issuer property is required for credentials')
        if ( !credentialObj.issuanceDate || credentialObj.issuanceDate === undefined ) throw new Error('issuanceDate property is required for credentials')
        if ( !credentialObj.credentialSubject || credentialObj.credentialSubject === undefined ) throw new Error('credentialSubject property is required for credentials')

        let newCredential = new Credential(this.getPrivateProperty('sdk'));

        newCredential['@context'] = ['https://www.w3.org/2018/credentials/v1'];
        if (credentialObj) {
            for (let key in credentialObj) {
                if (has(credentialObj, key)) {
                    newCredential[key] = credentialObj[key];
                }
            }
        };

        if (Array.isArray(credentialObj.credentialSubject)){
            newCredential['credentialSubject'] = [];
            for (let claimIndex in credentialObj.credentialSubject) {
                let rawClaim = credentialObj.credentialSubject[claimIndex];
                if ( rawClaim instanceof Claim ) {
                    newCredential['credentialSubject'].push(rawClaim);
                } else {
                    let properClaim = new Claim(this.getPrivateProperty('sdk')).create(rawClaim);
                    newCredential['credentialSubject'].push(properClaim);
                }
            }
        } else {
            if ( credentialObj.credentialSubject instanceof Claim ) {
                newCredential['credentialSubject'] = credentialObj.credentialSubject;
            } else {
                let properClaim = new Claim(this.getPrivateProperty('sdk')).create(credentialObj.credentialSubject);
                newCredential['credentialSubject'] = properClaim;
            }
        }

        if (!newCredential.credentialStructureValid()) {
            throw new Error('Object does not have a valid credential structure:', newCredential);
        }

        return newCredential;
    }

    /**
     * Verifies a signed credential object is structurally valid and signed properly
     * @param {Object} verifyObj The structure for verify an Claim.
     * @param {string} verifyObj.signerPublicKey The public key being used to validate signature(s) with.
     * @param {function=} verifyObj.customVerificationMethod An optional custom, user-defined validation method.
     * @return {Object} Credential validity object.
    */
    verify({signerPublicKey, customVerificationMethod}) {
        const structureValid = this.credentialStructureValid();
        let expired = false;

        let validityObject = {
            "@context": "https://project.factom.com/contexts/factom-verify-result-v1.jsonld",
            "structure": {"valid": structureValid}
        };

        // Check credential expiration date (if it is in the past, credential has expired)
        if (('expirationDate') in this) {
            if (Date.parse(this['expirationDate']) < Date.now()) expired = true;
            validityObject["expiration"] = {"valid": !expired};
        }

        let proofValidities = [];
        if (has(this, 'proof')) {
            if (Array.isArray(this['proof'])){
                for (let currentProof of this['proof']){
                    if ( typeof(currentProof) !== 'undefined' && has(currentProof, 'type')) {
                        proofValidities.push(this.verifySingleProof(signerPublicKey, currentProof));
                    }
                }
            } else {
                let currentProof = this['proof'];
                if ( typeof(currentProof) !== 'undefined' && has(currentProof, 'type')) {
                    proofValidities.push(this.verifySingleProof(signerPublicKey, currentProof));
                }
            }
        }

        let claimValidityObjects = [];
        let allClaimsAreValid = true;
        // Next check the signatures on any contained claims within the credential

        if (has(this, 'credentialSubject')) {
            if ( Array.isArray(this.credentialSubject) ) {
                for (let claim of this.credentialSubject) {
                    if ( claim.proof ) {
                        let proofValidity = claim.verify({signerPublicKey: signerPublicKey, customVerificationMethod: customVerificationMethod});
                        if (has(proofValidity, 'valid') && !proofValidity.valid) allClaimsAreValid = false;
                        claimValidityObjects.push(proofValidity);
                    }
                }
            } else {
                if ( this.credentialSubject.proof ) {
                    let proofValidity = this.credentialSubject.verify({signerPublicKey: signerPublicKey, customVerificationMethod: customVerificationMethod});
                    if (has(proofValidity, 'valid') && !proofValidity.valid) allClaimsAreValid = false;
                    claimValidityObjects.push(proofValidity);
                }
            }
        }

        if (customVerificationMethod !== undefined) {
            validityObject["custom"] = {"valid": customVerificationMethod(this, signerPublicKey), "type": customVerificationMethod.name};
        }

        let allProofsValid = true;
        for (let proofValidity of proofValidities ) {
            if (has(proofValidity, "valid") && !proofValidity.valid) {
                allProofsValid = false;
            }
        }

        if ( claimValidityObjects.length ) {
            validityObject["credentialSubjectResult"] = claimValidityObjects;
        }

        if ( proofValidities.length ) {
            validityObject["proof"] = proofValidities;
        }

        validityObject.valid = allProofsValid && !expired && allClaimsAreValid && structureValid;

        return validityObject;
    }

    /**
     * Registers (publishes) a credential object to a Factom chain through the Connect SDK
     * @param {bool=} registerObj.recursive If true, will register claims, otherwise will register just the credential.
     * @param {bool=} registerObj.hashOnly If true, the hash of the credential will be published to the blockchain rather than a full plaintext representation.
     * @param {string} registerObj.destinationChainId The Factom chain to make the entry into.
     * @param {string} registerObj.signerPrivateKey The private key to sign the Factom entry with.
     * @param {string} registerObj.signerChainId The Factom identity chain ID which is the signatory of the entry.
     * @param {Object=} registerObj.clientOverrides Overrides client instance.
     * @return {Object} The response from the connect SDK entries.create call.
    */
    async register(registerObj) {
        // If no destination chain id was provided use the default chain from the configure file
        if (registerObj.destinationChainId === undefined
          || !registerObj.destinationChainId.length
          || registerObj.destinationChainId === null) {
            registerObj.destinationChainId = this.getPrivateProperty('sdk').registrationChainId;
        }

        // If destinationChainId is *still* undefined (no valid chainID in credentialSubject), registration cannot proceed
        if (registerObj.destinationChainId === undefined ) {
            throw new Error('Factom destination chainID required')
        }
        // If destinationChainId is not a 64-byte hex-string, registration cannot proceed
        if ( registerObj.destinationChainId.length !== 64 || !( /[0-9A-Fa-f]{64}/g.test(registerObj.destinationChainId)) ) {
            throw new Error('Factom destination chainID must be a 64-byte hex-string')
        }

        let claimEntryResponses = [];

        if(registerObj.recursive){ // Handle recursive case, fill claimEntryResponses array
          if (has(this, 'credentialSubject')) {
            if (Array.isArray(this['credentialSubject'])){ // Multiple claims
                for (let key in this['credentialSubject']){
                    // Register the individual claim
                    let claimEntryResponse = await this['credentialSubject'][key].register(registerObj);
                    let pendingClaimEntryObject = claimEntryResponse["_factomMetadata"]["pendingFactomEntries"];
                    claimEntryResponses.push(pendingClaimEntryObject);
                    delete claimEntryResponse["_factomMetadata"];
                }
            } else { // support cases where credentialSubject is non-Array
                let claimEntryResponse = await this['credentialSubject'].register(registerObj);
                let pendingClaimEntryObject = claimEntryResponse["_factomMetadata"]["pendingFactomEntries"];
                claimEntryResponses.push(pendingClaimEntryObject);
                delete claimEntryResponse["_factomMetadata"];
            }
          }
        }

        const coreCredential = this.baseData();

        let entryContent;
        if ( registerObj.hashOnly === undefined || registerObj.hashOnly ) {
            // By default, hashOnly is TRUE, so if the property is undefined, consider it true
            entryContent = sha256(canonicalize(coreCredential));
        } else {
            entryContent = canonicalize(coreCredential);
        }

        const entryResponse = await this.getPrivateProperty('sdk').connect.chains.entries.create({
            chainId: registerObj.destinationChainId,
            signerPrivateKey: registerObj.signerPrivateKey,
            signerChainId: registerObj.signerChainId,
            externalIds: ["type:VerifiableCredential", "version:1"],
            content: entryContent
        });

        let credentialPendingEntry = {
            "entityType": "credential",
            "entityHash": sha256(canonicalize(coreCredential)),
            "entryHash": entryResponse.entry_hash,
            "href": "/v1/chains/"+registerObj.destinationChainId+"/"+entryResponse.entry_hash,
            "chain": {
                "href": "/v1/chains/"+registerObj.destinationChainId,
                "chain_id": registerObj.destinationChainId
            }
        };
        if (has(this, 'id')) credentialPendingEntry.id = this.id;

        let pendingEntryData;
        if((registerObj.recursive) && claimEntryResponses.length) {
            pendingEntryData = {"pendingFactomEntries": [credentialPendingEntry, ...claimEntryResponses]};
        } else {
            pendingEntryData = {"pendingFactomEntries": [credentialPendingEntry]};
        }

        if (this["_factomMetadata"] !== undefined) {
            if (Array.isArray(this["_factomMetadata"])) {
                this["_factomMetadata"].push(pendingEntryData)
            } else {
                this["_factomMetadata"] = [this["_factomMetadata"], pendingEntryData]
            }
        } else {
            this["_factomMetadata"] = pendingEntryData;
        }

        return this;
    }

    /**
     * Adds a proof object to the proof array in an existing credential object.
     * @param {Object} proof The proof to add to the credential.
     * @return {Object} A new credential object with the proof added to it.
    */
    async addProof(proof) {
        // If the proof object is missing or empty, by default a factom proof is added, sourced from the entries tagged
        // by the pendingFactomEntries key
        if ( !(proof) || typeof(proof) === 'undefined' || ( Object.entries(proof).length === 0 && proof.constructor === Object ) ) {
            let relevantIdentities = [];
            // Build a list of all relevant signing identities (DIDs)
            for (let proofIndex in this.proof) {
                if ( this.proof[proofIndex]["creator"] ) {
                    if (relevantIdentities.indexOf(this.proof[proofIndex]["creator"]) === -1) relevantIdentities.push(this.proof[proofIndex]["creator"]);
                }
            }
            if ( Array.isArray(this.credentialSubject) ) {
                for (let claim of this.credentialSubject) {
                    if (has(claim, "proof")) {
                        if ( claim["proof"]["creator"] ) {
                            if (relevantIdentities.indexOf(claim["proof"]["creator"]) === -1) relevantIdentities.push(claim["proof"]["creator"]);
                        }
                    }
                }
            } else {
                if ( has(this.credentialSubject, "proof") && this.credentialSubject["proof"]["creator"] ) {
                    if (relevantIdentities.indexOf(this.credentialSubject["proof"]["creator"]) === -1) relevantIdentities.push(this.credentialSubject["proof"]["creator"]);
                }
            }

            let pendingProof = this['_factomMetadata'];

            if (typeof(pendingProof) !== 'undefined' && has(pendingProof, 'pendingFactomEntries')) {
                pendingProof = pendingProof.pendingFactomEntries;
            } else {
                throw new Error("No proof to add");
            }

            let receipts = [];
            let anchors = [];
            let identities = [];
            let dblockKeyMR;

            for (let pendingEntry of pendingProof) {
                let entryHash = pendingEntry.entryHash;

                try {
                    let receiptData = await this.getPrivateProperty('sdk').connect.receipts.get({
                        entryHash: entryHash
                    });
                    if (has(pendingEntry, "entityType")) receiptData.data["entityType"] = pendingEntry.entityType;
                    if (has(pendingEntry, "entityHash")) receiptData.data["entityHash"] = pendingEntry.entityHash;
                    if (has(pendingEntry, "id")) receiptData.data["id"] = pendingEntry.id;
                    receipts.push(common.keysToCamel(receiptData.data));
                    dblockKeyMR = receiptData.data.dblock.keymr;
                } catch (err) {
                    // If anything goes wrong, log the error
                    // console.log(err);
                }

                try {
                    let anchorData = await this.getPrivateProperty('sdk').connect.anchors.get({
                        entryHash: dblockKeyMR
                    });
                    if (has(pendingEntry, "entityType")) anchorData.data["entityType"] = pendingEntry.entityType;
                    if (has(pendingEntry, "entityHash")) anchorData.data["entityHash"] = pendingEntry.entityHash;
                    if (has(pendingEntry, "id")) anchorData.data["id"] = pendingEntry.id;
                    anchors.push(common.keysToCamel(anchorData.data));
                } catch (err) {
                    // If anything goes wrong, log the error
                    // console.log(err);
                }
            }

            // Compile together all identity information for our relevant identities
            for (let identityIndex in relevantIdentities) {
                let didString = relevantIdentities[identityIndex];
                try {
                    let didData = await factomproof.getDID(didString, this.getPrivateProperty('sdk').connect);
                    identities.push({didDocument: didData.didDocument, didHistory: didData.methodMetadata});
                } catch (err) {
                    // If anything goes wrong, log the error
                    // console.log(err);
                }
            }

            if (Array.isArray(this['_factomMetadata'])) {
                this['_factomMetadata'] = this['_factomMetadata'].filter(function( obj ) {
                    return !('pendingFactomEntries' in obj)
                });
                if (this['_factomMetadata'].length === 0) delete this['_factomMetadata'];
            } else {
                if (typeof(this['_factomMetadata']) !== 'undefined' && has(this['_factomMetadata'], 'pendingFactomEntries')) {
                    delete this['_factomMetadata'];
                }
            }

            // construct an object matching the http://project.factom.com/contexts/factom-proof-v1.jsonld context with these responses
            proof = factomproof.createProof(receipts, anchors, identities);
        }

        if(this['proof']){
            if ( Array.isArray(this['proof']) ) {
                this['proof'].push(proof);
            } else {
                this['proof'] = [this['proof'], proof];
            }
        } else {
            this['proof'] = proof;
        }

        return this;
    }

    /**
     * Checks basic structural validity of an alleged credentialObject
     * @param {Object} credentialObject The credential object being checked.
     * @return {bool} True if the object has the fields (keys) required to be a VC, false otherwise.
     */
    credentialStructureValid() {
        if (
            !(
                ('credentialSubject' in this)
                && ('issuer' in this)
                && ('issuanceDate' in this)
            )
        ) {
            return false;
        } else {
            if ('id' in this) {
                return common.validURL(this.id);
            } else {
                return true;
            }
        }
    }
}

module.exports = Credential;