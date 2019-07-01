const clonedeep = require('lodash.clonedeep');
const has = require('lodash.has');
const fs = require("fs");
const factomproof = require("../util/factom-proof");
const sign = require("../util/sign");

const privateProperties = new WeakMap();

class CoreDataObject {
    constructor(fullSDK){
        privateProperties.set(this, {
            sdk: fullSDK
        });
    }

    /**
     * Returns the object minus its `proof` and `_factomMetadata` properties;
     * the (canonicalized) baseData is the data which is hashed or signed.
     * @return {Object} A new object without the proof or _factomMetadata data included.
    */
    baseData() {
        let clone = clonedeep(this);
        if (has(clone, 'proof')) delete clone.proof;
        if (has(clone, '_factomMetadata')) delete clone['_factomMetadata'];
    
        return clone
    }

    /**
     * Signs an existing object.
     * @param {Object} signerObj The object being signed.
     * @param {string} signerObj.signer The id of the signer/issuer, including a reference to the relevant public key.
     * @param {string} signerObj.signerPrivateKey The private key used to sign the object.
     * @return {Object} A new object with the signature added to its `proof` object/array.
    */
    sign({signer, signerPrivateKey}) {
        try {
            const newProof = sign.signContent(signer, signerPrivateKey, this.baseData(), "ed25519signature2018")
            if(this['proof']){
                if ( Array.isArray(this['proof']) ) {
                    this['proof'].push(newProof);
                } else {
                    this['proof'] = [this['proof'], newProof];
                }
            } else {
                this['proof'] = newProof;
            }
            return this;
        } catch (err) {
            // If anything goes wrong during signing, notify user.
            throw new Error("Error during signing: " + err.message);
        }
    }

    /**
     * Exports an existing object for external storage or consumption.
     * @param {Object} options Exportation options.
     * @param {string} options.type The export type. Currently-supported values: "file" or "json" (json is default)
     * @param {string} options.fileName (required when type="file"): the name of the file which the object will be saved to.
     * @return {string} A string-encoded JSON representation of the object (if type="json").
    */
    export(options) {
        if (has(options, "type") && options.type === "file") {
            if (has(options, "fileName")) {
                try {
                    fs.writeFileSync(options.fileName, JSON.stringify(this, null, 4));
                } catch (err) {
                    throw new Error("Error during attempted file-write:", err);
                }
            } else {
                throw new Error("Cannot export to file without a fileName to save to")
            }
        } else {
            // By default, raw JSON representation is exported
            return JSON.stringify(this, null, 4);
        }
    }

    /**
     * Imports an object from a file or raw JSON data.
     * @param {Object} options Importation options.
     * @param {string} options.type The import type. Currently-supported values: "file" or "json" (json is default)
     * @param {string} options.fileName (required when type="file"): the name of the file which the object will be loaded from.
     * @return {Object} A new object created from the imported data.
    */
    import(options) {
        if (has(options, "type") && options.type === "file" && has(options, "fileName")) {
            const rawData = JSON.parse(fs.readFileSync(options.fileName));
            return this.create(rawData);
        } else {
            // By default, try to cast input object with its create function
            return this.create(options);
        }
    }

    /**
     * Returns a private property from the WeakMap object created upon initialization.
     * Primarily used to access SDK-level data and properties.
     * @param {string} property The property to get (usually 'sdk')
    */
    getPrivateProperty(property) {
        return privateProperties.get(this)[property];
    }

    /**
     * Helper function for single-proof verification.
     * @param {string} signerPublicKey The public key used to check for signature verification.
     * @param {Object} proof The proof object being verified.
     * @return {Object} Validity object: https://project.factom.com/contexts/factom-verify-result-v1
    */
    verifySingleProof(signerPublicKey, proof) {
        if (has(proof, 'type')) {
            if (proof.type === "ed25519signature2018") {
                try {
                    if (sign.validateSignature(proof, signerPublicKey, this.baseData(), "ed25519signature2018")) {
                        return {"valid": true, "type": "ed25519signature2018"};
                    } else {
                        return {"valid": false, "type": "ed25519signature2018"};
                    }
                } catch (err) {
                    // If anything goes wrong during signature validation, signature is considered invalid.
                    return {"valid": false, "type": "ed25519signature2018"};
                }
            } else {
                if (proof.type === "factomProof-v1") {
                    try {
                        return factomproof.verifyFactomProofV1(proof);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        }
    }
}

module.exports = CoreDataObject;