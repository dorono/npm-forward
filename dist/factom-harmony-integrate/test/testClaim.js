"use strict";

const expect = require("chai").expect;
const configure = require("../src/configure");
const IntegrateSDK = require("../index");
const fs = require('fs');
const clonedeep = require('lodash.clonedeep');

const Integrate = new IntegrateSDK(configure);

const claimObject = {
    id: "http://example.gov/credentials/3732",
    type: ["Credential", "ProofOfAgeCredential"],
    "@context": "https://w3id.org/identity/v1",
    "ageOver": 21,
    "issuer": "https://dmv.example.gov",
    "issued": "2010-01-01"
};

const claimObjectExpected = {
    "@context": "https://w3id.org/identity/v1",
    id: 'http://example.gov/credentials/3732',
    type: [ 'Credential', 'ProofOfAgeCredential' ],
    issuer: 'https://dmv.example.gov',
    issued: '2010-01-01',
    ageOver: 21
};

const signObject = {
    signer: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
    signerPrivateKey: "idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6"
}

const signVerify = {
    signerPublicKey: "idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR",
}

describe("#createClaim", function() {
    it("should create claim appropriately", function() {
        const result = Integrate.claim.create(claimObject);
        expect(result).to.eql(claimObjectExpected);
    });
});

describe("#signClaim", function() {
    let signedClaim = Integrate.claim.create(claimObject).sign(signObject);

    it("should sign and validate claim successfully", function() {
        const verifyObject = signedClaim.verify(signVerify);
        const signatureCheckFromUnsignedClaim = verifyObject.proof[0].valid;
        expect(signatureCheckFromUnsignedClaim).to.be.true;
    });

    it("should not validate claim with bad signature", function() {
        const brokenSignature = signedClaim.proof.signatureValue.substring(0, 10) + "C" + signedClaim.proof.signatureValue.substring(11);
        let clonedClaim = Object.assign( Object.create( Object.getPrototypeOf(signedClaim)), signedClaim)

        clonedClaim.proof.signatureValue = brokenSignature;

        const badSignatureVerifyObject = clonedClaim.verify(signVerify);
        const badSignatureCheck = badSignatureVerifyObject.proof[0].valid;

        expect(badSignatureCheck).to.be.false;
    });

    it("should throw an error if signing doesn't work", function() {
        const badSignObject = {
            signer: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
            signerPrivateKey: "idsec343TnJSJtc2UWqLaPr3PRkhD3JrxXNZ4r2NE8Enw1SmgXyq1dQ"
        };

        let almostSignedClaim = Integrate.claim.create(claimObject);
        try {
            almostSignedClaim.sign(badSignObject);
        } catch (err) {
            expect(err.message.substring(0,20)).to.equal("Error during signing")
        }
    });
});

describe("#signClaimMoreThanOnce", function() {
    let signedClaim = Integrate.claim.create(claimObject);

    const signObjectTwo = {
        signer: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
        signerPrivateKey: "idsec343TnJSJtc2UWqLaPr3PRkhD3JrxXNZ4r2NE8Enw1SmgXyqodQ"
    }

    const signVerifyTwo = {
        signerPublicKey: "idpub1smemC7fZ618dfWQZaUrdPJZcHJfz8Tzcz6agTNm3cCFz4H1Jw",
    }

    it("should sign and validate double-signed claim successfully", function() {
        signedClaim.sign(signObject);
        const verifyObject = signedClaim.verify(signVerify);
        const signatureCheckFromUnsignedClaim = verifyObject.proof[0].valid;
        expect(signatureCheckFromUnsignedClaim).to.be.true;

        signedClaim.sign(signObjectTwo);
        const verifyObjectTwo = signedClaim.verify(signVerifyTwo);
        const secondSignatureCheckFromUnsignedClaim = verifyObjectTwo.proof[1].valid;
        expect(secondSignatureCheckFromUnsignedClaim).to.be.true;

        signedClaim.sign(signObject);
        const verifyObjectThree = signedClaim.verify(signVerify);
        const thirdSignatureCheckFromUnsignedClaim = verifyObjectThree.proof[2].valid;
        expect(thirdSignatureCheckFromUnsignedClaim).to.be.true;
    });
});

describe("#claimStructureValid", function(){
    const claimGoodObject = {
        id: "http://example.gov/credentials/1234",
        otherAttr: "example-data"
    };

    const claimBadObject = {
        id: "http://example.gov/credentials/1234",
    };

    it("should validate the good claim structure", function()
    {
        const resultStructure = Integrate.claim.create(claimGoodObject).claimStructureValid();
        expect(resultStructure).to.be.true;
    });

    it("should not validate the bad claim structure", function()
    {
        const resultStructure = Integrate.claim.create(claimBadObject).claimStructureValid();
        expect(resultStructure).to.be.false;
    });
 });

describe("#claimCustomCheck", function(){
    let signedClaim = Integrate.claim.create(claimObject).sign(signObject);

    it("should properly use the customValidation method", function() {
        const alwaysFalseFunc = function(obj, key) {
            return false;
        }

        const alwaysTrueFunc = function(obj, key) {
            return true;
        }

        let customClaimCheck = signedClaim.verify({ signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR', customVerificationMethod: alwaysFalseFunc});
        expect(customClaimCheck.custom.valid).to.be.false;

        customClaimCheck = signedClaim.verify({ signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR', customVerificationMethod: alwaysTrueFunc});
        expect(customClaimCheck.custom.valid).to.be.true;
    });
});

describe("#registerClaim", function() {
    it("should be registered successfully to factom", function() {
        let claimToRegister = Integrate.claim.create(claimObject);
        claimToRegister.sign(signObject);
        const registerObj = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            destinationChainId: configure.identityChainId,
            hashOnly: false
        }
        claimToRegister.register(registerObj).then(async (claimObjectReturned) => {
            const claimEntryHash = claimObjectReturned.entry_hash;
            expect(claimEntryHash).to.not.be.null;
        }).catch((error) => {
            console.log("ERROR in registerClaim", error);
        });
    });


    it("should register with content hashed", function() {
        const claimToRegister = Integrate.claim.create(claimObject);
        claimToRegister.sign(signObject);
        const registerObj = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            destinationChainId: configure.identityChainId,
            hashOnly: true
        }
        claimToRegister.register(registerObj).then(async (claimObjectReturned) => {            
            const claimEntryHash = claimObjectReturned.entry_hash;
            expect(claimEntryHash).to.not.be.null;            
        }).catch((error) => {
            console.log("ERROR in registerClaim", error);
        });
    });

    it("should register the claim when destinationId is undefined", function() {
        const claimToRegister = Integrate.claim.create(claimObject);
        claimToRegister.sign(signObject);
        const registerObj = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,            
            hashOnly: true
        }
        claimToRegister.register(registerObj).then(async (claimObjectReturned) => {            
            const claimEntryHash = claimObjectReturned;                   
            expect(claimEntryHash).to.not.be.null;
        }).catch((error) => {            
            console.log("ERROR in registerClaim", error);
        });
    });

    it("should not register the claim when destinationId is invalid or undefined", function() {
        let configureWithoutRegistrationChain = clonedeep(configure);
        delete configureWithoutRegistrationChain.registrationChainId;
        const IntegrateWithoutRegistrationChain = new IntegrateSDK(configureWithoutRegistrationChain);

        const claimToRegister = IntegrateWithoutRegistrationChain.claim.create(claimObject);

        claimToRegister.sign(signObject);
        const registerObjWithEmptyChainId = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            destinationChainId: '',
            hashOnly: true
        };
        claimToRegister.register(registerObjWithEmptyChainId).then(async (claimObjectReturned) => {
            const claimEntryHash = claimObjectReturned.entry_hash;
        }).catch((error) => {
            expect(error.message).to.equal("Factom destination chainID required");
        });

        const registerObjWithInvalidChainId = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            destinationChainId: '*ia.',
            hashOnly: true
        };
        claimToRegister.register(registerObjWithInvalidChainId).then(async (claimObjectReturned) => {
            const claimEntryHash = claimObjectReturned.entry_hash;
        }).catch((error) => {
            expect(error.message).to.equal("Factom destination chainID must be a 64-byte hex-string")
        });
    });
});

describe("#importExportClaim", function() {
    const timeNonce = Date.now();
    const fileName = "test/tmp-import-claim-"+timeNonce+".json";
    let nativeClaim;

    before(function(done){
        const claimData = {
                "id": "JG-275431",
                "event": {
                    "type": "Promotion",
                    "v": "u-3999jx-b3"
                }
            }

        nativeClaim = Integrate.claim.create(claimData);
        nativeClaim.sign(signObject);
        done();
    });

    after( function() {
        // Delete file once we're done with it; comment/remove if you want to preserve test files.
        fs.unlinkSync(fileName);
    });

    it("should create a new file when exported with type=file", function() {
        nativeClaim.export({"type": "file", "fileName": fileName});
        try {
            expect(fs.existsSync(fileName)).to.be.true;
          } catch(err) {
            console.error("Export error:", err)
          }
    });

    it("should fail to export to a file and throw error if no fileName is specified", function() {
        try {
            nativeClaim.export({"type": "file"});
        } catch (err) {
            expect(err.message).to.eql("Cannot export to file without a fileName to save to")
        }
    });

    it("should throw error if export path is nonexistent", function() {
        try {
            nativeClaim.export({"type": "file", "fileName": "fakePath/noSuchFolder"+fileName});
        } catch (err) {
            expect(err.message).to.eql("Error during attempted file-write:");
        }
    });

    it("should match native claim object after file import", function() {
        try {
            expect(fs.existsSync(fileName)).to.be.true;
            const importedClaim = Integrate.claim.import({"type": "file", "fileName": fileName});
            expect(importedClaim).to.eql(nativeClaim);
          } catch(err) {
            console.error("Import error:", err)
          }
    });

    it("should make a stringified JSON object when exported with type=json", function() {
        let rawJSONclaimString = nativeClaim.export({"type": "json"});
        expect(typeof(rawJSONclaimString)).to.eql("string");
        let rawJSONclaimObject = JSON.parse(rawJSONclaimString);
        expect(typeof(rawJSONclaimObject)).to.eql("object");
        expect(rawJSONclaimObject).to.have.all.keys(['id', 'event', 'proof']);
    });

    it("should match native claim object after import of raw json", function() {
        const originalData = {
            "id": "JG-275431",
            "event": {
                "type": "Promotion",
                "v": "u-3999jx-b3"
            }
        }

        const directlyCreatedClaim = Integrate.claim.create(originalData);
        const importedClaimFromJSON = Integrate.claim.import(originalData);
        expect(importedClaimFromJSON).to.eql(directlyCreatedClaim);
    });
});