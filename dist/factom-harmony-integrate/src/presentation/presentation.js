const canonicalize = require("canonical-json");
const sha256 = require('js-sha256');
const Credential = require("../credential/credential");
const factomproof = require("../util/factom-proof");
const common = require('../util/common');
const has = require('lodash.has');
const CoreDataObject = require("../core/coreDataObject");

class Presentation extends CoreDataObject {
    /**
     * Creates and returns a presentation object.
     * @param {Object} presentationObj The presentation object
     * @param {string=} presentationObj.id The presentation id: https://w3c.github.io/vc-data-model/#identifiers
     * @param {[Object]=} presentationObj.verifiableCredential The credential(s) included in the presentation:  https://w3c.github.io/vc-data-model/#presentations-0
     * @param {Object} presentationObj Optional additional key/value pairs in the presentation object.
     * @return {Object} The presentation object: https://w3c.github.io/vc-data-model/#presentations-0
     * https://w3c.github.io/vc-data-model/#presentations
     * https://w3c.github.io/vc-data-model/#contexts
    */
    create(presentationObj) {
        if ( !presentationObj.verifiableCredential || presentationObj.verifiableCredential === undefined ) throw new Error('verifiableCredential property is required for presentations')

        let newPresentation = new Presentation(this.getPrivateProperty('sdk'));
        newPresentation['@context'] = ['https://www.w3.org/2018/credentials/v1'];
        newPresentation['type'] = ['VerifiablePresentation'];

        if (presentationObj) {
            for (let key in presentationObj) {
                if (has(presentationObj, key)) {
                    newPresentation[key] = presentationObj[key];
                }
            }
        };

        if (Array.isArray(presentationObj.verifiableCredential)){
            newPresentation['verifiableCredential'] = [];
            for (let credentialIndex in presentationObj.verifiableCredential) {
                let rawCredential = presentationObj.verifiableCredential[credentialIndex];
                if ( rawCredential instanceof Credential ) {
                    newPresentation['verifiableCredential'].push(rawCredential);
                } else {
                    let properCredential = new Credential(this.getPrivateProperty('sdk')).create(rawCredential);
                    newPresentation['verifiableCredential'].push(properCredential);
                }
            }
        } else {
            if ( presentationObj.verifiableCredential instanceof Credential ) {
                newPresentation['verifiableCredential'] = presentationObj.verifiableCredential;
            } else {
                let properCredential = new Credential(this.getPrivateProperty('sdk')).create(presentationObj.verifiableCredential);
                newPresentation['verifiableCredential'] = properCredential;
            }
        }

        return newPresentation;
    }

    /**
    * Registers (publishes) a presentation object to a Factom chain through the Connect SDK
    * @param {bool=} registerObj.recursive If true, will register credentials, otherwise will register just the presentation.
    * @param {bool=} registerObj.hashOnly If true, the hash of the presentation will be published to the blockchain rather than a full plaintext representation.
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

        // If destinationChainId is *still* undefined (no valid chainID in credentialSubject), registration cannot proceed
        if (registerObj.destinationChainId === undefined ) {
            throw new Error('Factom destination chainID required')
        }

        // If destinationChainId is not a 64-byte hex-string, registration cannot proceed
        if ( registerObj.destinationChainId.length !== 64 || !( /[0-9A-Fa-f]{64}/g.test(registerObj.destinationChainId)) ) {
            throw new Error('Factom destination chainID must be a 64-byte hex-string')
        }

        let credentialEntryResponses = [];

        if(registerObj.recursive){ // Handle recursive case
          if (has(this, 'verifiableCredential')) {
            if(Array.isArray(this.verifiableCredential)){ // Multiple credentials
                for(let cred of this.verifiableCredential){
                  let credentialEntryResponse = await cred.register(registerObj);
                  let pendingCredentialEntryObject;
                  if (Array.isArray(credentialEntryResponse['_factomMetadata'])) {
                    pendingCredentialEntryObject = credentialEntryResponse['_factomMetadata'].find(function (foundPending) {
                        return ('pendingFactomEntries' in foundPending)
                      });
                  } else {
                      if (has(credentialEntryResponse['_factomMetadata'], 'pendingFactomEntries')) {
                        pendingCredentialEntryObject = credentialEntryResponse['_factomMetadata']['pendingFactomEntries'];
                      }
                  }
                  if (typeof(pendingCredentialEntryObject) !== 'undefined') {
                    if (Array.isArray(pendingCredentialEntryObject)) {
                        for (let pendingEntry of pendingCredentialEntryObject) {
                            credentialEntryResponses.push(pendingEntry);
                        }
                    } else {
                        credentialEntryResponses.push(pendingCredentialEntryObject);
                    }
                  }
                  if (Array.isArray(credentialEntryResponse['_factomMetadata'])) {
                      for (let credIndex in credentialEntryResponse['_factomMetadata']) {
                        if (has(credentialEntryResponse['_factomMetadata'][credIndex], 'pendingFactomEntries')) {
                            credentialEntryResponse['_factomMetadata'].splice(credIndex, 1);
                        }
                      }
                  } else {
                      if (has(credentialEntryResponse['_factomMetadata'], 'pendingFactomEntries')) delete credentialEntryResponse['_factomMetadata'];
                  }
                }
            } else { // Single credential
                let credentialEntryResponse = await this.verifiableCredential.register(registerObj);
                let pendingCredentialEntryObject;
                if (Array.isArray(credentialEntryResponse['_factomMetadata'])) {
                    pendingCredentialEntryObject = credentialEntryResponse['_factomMetadata'].find(function (foundPending) {
                    return ('pendingFactomEntries' in foundPending)
                    });
                } else {
                    if (has(credentialEntryResponse['_factomMetadata'], 'pendingFactomEntries')) {
                        pendingCredentialEntryObject = credentialEntryResponse['_factomMetadata']['pendingFactomEntries'];
                    }
                }

                if (typeof(pendingCredentialEntryObject) !== 'undefined') {
                    if (Array.isArray(pendingCredentialEntryObject)) {
                        for (let pendingEntry of pendingCredentialEntryObject) {
                            credentialEntryResponses.push(pendingEntry);
                        }
                    } else {
                        credentialEntryResponses.push(pendingCredentialEntryObject);
                    }
                }

                if (Array.isArray(credentialEntryResponse['_factomMetadata'])) {
                    for (let credIndex in credentialEntryResponse['_factomMetadata']) {
                    if (has(credentialEntryResponse['_factomMetadata'][credIndex], 'pendingFactomEntries')) {
                        credentialEntryResponse['_factomMetadata'].splice(credIndex, 1);
                    }
                    }
                } else {
                    if (has(credentialEntryResponse['_factomMetadata'], 'pendingFactomEntries')) delete credentialEntryResponse['_factomMetadata'];
                }
            }
          }
        }

        const corePresentation = this.baseData();

        let entryContent;
        if ( registerObj.hashOnly === undefined || registerObj.hashOnly ) {
            // By default, hashOnly is TRUE, so if the property is undefined, consider it true
            entryContent = sha256(canonicalize(corePresentation));
        } else {
            entryContent = canonicalize(corePresentation);
        }

        const entryResponse = await this.getPrivateProperty('sdk').connect.chains.entries.create({
            chainId: registerObj.destinationChainId,
            signerPrivateKey: registerObj.signerPrivateKey,
            signerChainId: registerObj.signerChainId,
            externalIds: ["type:VerifiablePresentation", "version:1"],
            content: entryContent
        });

        let presentationPendingEntry = {
            "entityType": "presentation",
            "entityHash": sha256(canonicalize(corePresentation)),
            "entryHash": entryResponse.entry_hash,
            "href": "/v1/chains/"+registerObj.destinationChainId+"/"+entryResponse.entry_hash,
            "chain": {
                "href": "/v1/chains/"+registerObj.destinationChainId,
                "chain_id": registerObj.destinationChainId
            }
        };
        if (has(this, 'id')) presentationPendingEntry.id = this.id;

        let pendingEntryData;
        if((registerObj.recursive) && credentialEntryResponses.length) {
            pendingEntryData = {"pendingFactomEntries": [presentationPendingEntry, ...credentialEntryResponses]};
        } else {
            pendingEntryData = {"pendingFactomEntries": [presentationPendingEntry]};
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
     * Verifies a signed presentation object is structurally valid and signed properly
     * @param {Object} verifyObj The structure for verify an Presentation.
     * @param {string} verifyObj.signerPublicKey The public key being used to validate signature(s) with.
     * @param {function} verifyObj.customVerificationMethod An optional custom, user-defined validation method.
     * @return {bool} True if the presentation and all of its contained credentials are valid, false otherwise.
    */
    verify({signerPublicKey, customVerificationMethod}) {
        const structureValid = this.presentationStructureValid();
        let expired = false;
        let credentialValidityObjects = [];

        let validityObject = {
            "@context": "https://project.factom.com/contexts/factom-verify-result-v1.jsonld",
            "structure": {"valid": structureValid}
        };

        // Check presentation expiration date (if it is in the past, presentation has expired)
        if (has(this, 'expirationDate')) {
            if (Date.parse(this['expirationDate']) < Date.now()) expired = true;
            validityObject["expiration"] = {"valid": !expired};
        }

        let proofValidities = [];
        if (has(this, 'proof')) {
            if (Array.isArray(this['proof'])){
                for (let currentProof of this['proof']){
                    if (has(currentProof, 'type')) {
                        proofValidities.push(this.verifySingleProof(signerPublicKey, currentProof));
                    }
                }
            } else {
                let currentProof = this['proof'];
                if (has(currentProof, 'type')) {
                    proofValidities.push(this.verifySingleProof(signerPublicKey, currentProof));
                }
            }
        }

        // Next check the signatures on any contained credentials within the presentation
        if (has(this, 'verifiableCredential')) {
            if ( Array.isArray(this.verifiableCredential) ) {
                for (let credential of this.verifiableCredential) {
                    credentialValidityObjects.push(credential.verify({signerPublicKey: signerPublicKey}));
                }
            } else {
                credentialValidityObjects.push(this.verifiableCredential.verify({signerPublicKey: signerPublicKey}));
            }
        }

        if (customVerificationMethod !== undefined) {
            validityObject["custom"] = {"valid": customVerificationMethod(this, signerPublicKey), "type": customVerificationMethod.name};
        }

        if (credentialValidityObjects.length) {
            validityObject["verifiableCredentialResult"] = credentialValidityObjects;
        }

        let allProofsValid = true;
        for (let proofValidity of proofValidities ) {
            if (has(proofValidity, "valid") && !proofValidity.valid) {
                allProofsValid = false;
            }
        }

        if ( proofValidities.length ) {
            validityObject["proof"] = proofValidities;
        }

        let allCredentialsValid = true;
        for (let credentialValidity of credentialValidityObjects ) {
            if (has(credentialValidity, "valid") && !credentialValidity.valid) {
                allCredentialsValid = false;
            }
        }

        validityObject["valid"] = allProofsValid && !expired && allCredentialsValid && structureValid;
        return {"verifiablePresentationResult": validityObject};
    }

    /**
     * Checks basic structural validity of an alleged presentationObject
     * @return {bool} True if the object has the fields (keys) required to be a presentation, false otherwise.
    */
    presentationStructureValid() {
        return 'verifiableCredential' in this;
    }

    /**
     * Adds a proof object to the proof array in an existing presentation object.
     * @param {Object} proof The proof to add to the presentation.
     * @return {Object} A new presentation object with the proof added to it.
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
            if (has(this, 'verifiableCredential')) {
                if ( Array.isArray(this.verifiableCredential) ) {
                    for (let individualCredential of this.verifiableCredential) {
                        if ( has(individualCredential, "proof") && has(individualCredential.proof, "issuer") ) {
                            if (relevantIdentities.indexOf(individualCredential["proof"]["issuer"]) === -1) relevantIdentities.push(individualCredential["proof"]["issuer"]);
                        }
                    }
                } else {
                    if ( has(this.verifiableCredential, "proof") && has(this.verifiableCredential.proof, "issuer") ) {
                        if (relevantIdentities.indexOf(this.verifiableCredential["proof"]["issuer"]) === -1) relevantIdentities.push(this.verifiableCredential["proof"]["issuer"]);
                    }
                }
            }

            let pendingProof;
            if (Array.isArray(this['_factomMetadata'])) {
                pendingProof = this['_factomMetadata'].find(function (foundPending) {
                    return ('pendingFactomEntries' in foundPending)
                });
            } else {
                pendingProof = this['_factomMetadata'];
            }

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
                    // If anything goes wrong, log the error (temporarily disabled)
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
}

module.exports = Presentation;