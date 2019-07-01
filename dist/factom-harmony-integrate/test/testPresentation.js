"use strict";

const expect = require("chai").expect;
const configure = require("../src/configure");
const IntegrateSDK = require("../index");
const fs = require('fs');
const clonedeep = require('lodash.clonedeep');

const Integrate = new IntegrateSDK(configure);

const credentialObject = {
    id: "http://example.edu/credentials/3732",
    type: ["UniversityDegreeCredential"],
    issuer: "https://example.edu/issuers/14",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
        "id": "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
        "degree": {
            "type": "BachelorDegree",
            "name": "Bachelor of Science in Mechanical Engineering"
        }
    },
    credentialStatus: {
            "id": "https://example.edu/status/24",
            "type": "CredentialStatusList2017"
    }
}

const credentialObject2 = {
    id: "http://example.edu/credentials/3733",
    type: ["MastersDegreeCredential"],
    issuer: "https://example.edu/issuers/14",
    issuanceDate: "2010-01-10T19:11:03Z",
    credentialSubject: {
        "id": "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
        "degree": {
            "type": "MastersDegree"
        }
    },
    credentialStatus: {
            "id": "https://example.edu/status/28",
            "type": "CredentialStatusList2017"
    }
}

const signObject = {
    signer: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
    signerPrivateKey: "idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6"
}

const signVerify = {
    signerPublicKey: "idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR",
}

let signedCredential = Integrate.credential.create(credentialObject).sign(signObject);
let unsignedCredential = Integrate.credential.create(credentialObject);
let unsignedCredential2 = Integrate.credential.create(credentialObject2);

describe("#createPresentation", function() {
    it("should construct presentation appropriately from proper credential", function() {
        const presentationObject = {
            id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
            verifiableCredential: signedCredential,
        }

        const presentationObjectExpected = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            id: 'urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5',
            type: ['VerifiablePresentation'],
            verifiableCredential: signedCredential,
        }

        const verifiablePresentation = Integrate.presentation.create(presentationObject);
        expect(verifiablePresentation).to.eql(presentationObjectExpected);
    });

    it("should construct presentation appropriately from raw credential data", function() {
        const presentationObject = {
            id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
            verifiableCredential: credentialObject,
        }

        const presentationObjectExpected = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            id: 'urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5',
            type: ['VerifiablePresentation'],
            verifiableCredential: unsignedCredential,
        }

        const verifiablePresentation = Integrate.presentation.create(presentationObject);
        expect(verifiablePresentation).to.eql(presentationObjectExpected);
    });

    it("should construct presentation appropriately from multiple raw credentials data", function() {
        const presentationObject = {
            id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
            verifiableCredential: [credentialObject, credentialObject2]
        }

        const presentationObjectExpected = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            id: 'urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5',
            type: ['VerifiablePresentation'],
            verifiableCredential: [unsignedCredential, unsignedCredential2]
        }

        const verifiablePresentation = Integrate.presentation.create(presentationObject);
        expect(verifiablePresentation).to.eql(presentationObjectExpected);
    });

    it("should construct presentation appropriately with both proper and raw credentials data", function() {
        const presentationObject = {
            id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
            verifiableCredential: [unsignedCredential, credentialObject2]
        }

        const presentationObjectExpected = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            id: 'urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5',
            type: ['VerifiablePresentation'],
            verifiableCredential: [unsignedCredential, unsignedCredential2]
        }

        const verifiablePresentation = Integrate.presentation.create(presentationObject);
        expect(verifiablePresentation).to.eql(presentationObjectExpected);
    });

    it("should throw an error when no verifiableCredential property is provided", function() {
        const presentationObject = {
            id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5"
        }

        try {
            const verifiablePresentation = Integrate.presentation.create(presentationObject);
        } catch (err) {
            expect(err.message).to.eql('verifiableCredential property is required for presentations');
        }
    });
});

describe("#verifyPresentation", function() {
    let secondSignedCredential;
    let verifiablePresentationWithSingleCredential;
    let verifiablePresentationWithTwoCredentials;

    before(function(done){
        const presentationWithSingleCredential = Integrate.presentation.create({id:"urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5", type: ["CredentialManagerPresentation"], verifiableCredential: signedCredential});
        verifiablePresentationWithSingleCredential = presentationWithSingleCredential.sign(signObject);

        const unsignedSecondCredential = Integrate.credential.create({id: "http://example.edu/credentials/4455",
        type: ["VerifiableCredential", "UniversityDegreeCredential"],
        issuer: "https://example.edu/issuers/14",
        issuanceDate: "2010-03-01T19:11:11Z",
        credentialSubject: {
            "id": "did:factom:ccfeb1f7aaf126f1c276e12ec89",
            "degree": {
            "type": "MastersDegree",
            "name": "Master of Arts in Economics"
            }
        },
        credentialStatus: {
            "id": "https://example.edu/status/24",
            "type": "CredentialStatusList2017"
        }});

        secondSignedCredential = unsignedSecondCredential.sign(signObject);

        const presentationWithTwoCredentials = Integrate.presentation.create({id:"urn:uuid:ff783452-8226-aedc-a978-6eada3903c5", type: ["CredentialManagerPresentation"], verifiableCredential: [signedCredential, secondSignedCredential]});
        verifiablePresentationWithTwoCredentials = presentationWithTwoCredentials.sign(signObject);
        done();
    });


    it("should validate presentation with one credential successfully", function() {
        const verifyPresentationCheck = verifiablePresentationWithSingleCredential.verify(signVerify).verifiablePresentationResult;
        expect(verifyPresentationCheck.proof[0].valid).to.be.true;
    });

    it("should validate presentation with multiple credentials successfully", function() {
        const verifyPluralPresentationCheck = verifiablePresentationWithTwoCredentials.verify(signVerify).verifiablePresentationResult;
        expect(verifyPluralPresentationCheck.valid).to.be.true;
    });

    it("should not validate presentation with bad signature", function() {
        const originalSig = signedCredential.proof.signatureValue;
        const brokenSignature = originalSig.substring(0, 10) + "Cf" + originalSig.substring(12);
        let presentationCopy = clonedeep(verifiablePresentationWithSingleCredential);

        const firstSignatureCheck = presentationCopy.verify(signVerify).verifiablePresentationResult;

        expect(firstSignatureCheck.valid).to.be.true;

        presentationCopy.proof.signatureValue = brokenSignature;

        const badSignatureCheck = presentationCopy.verify(signVerify).verifiablePresentationResult;
        expect(badSignatureCheck.valid).to.be.false;
    });

    it("should check presentation expiration during validation", function() {
        let expiredPresentation = clonedeep(verifiablePresentationWithSingleCredential);
        expiredPresentation.expirationDate = "2018-01-01T19:23:24Z";
        expiredPresentation.sign(signObject);
        const expiredPresentationVerifyResult = expiredPresentation.verify(signVerify);
        expect(expiredPresentationVerifyResult.verifiablePresentationResult.expiration.valid).to.be.false;
        expect(expiredPresentationVerifyResult.verifiablePresentationResult.valid).to.be.false;
    });

    it("should properly use the customValidation method", function() {
        const alwaysFalseFunc = function(obj, key) {
            return false;
        }

        const alwaysTrueFunc = function(obj, key) {
            return true;
        }

        let customPresentationCheck = verifiablePresentationWithSingleCredential.verify({ signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR', customVerificationMethod: alwaysFalseFunc});
        expect(customPresentationCheck.verifiablePresentationResult.custom.valid).to.be.false;

        customPresentationCheck = verifiablePresentationWithSingleCredential.verify({ signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR', customVerificationMethod: alwaysTrueFunc});
        expect(customPresentationCheck.verifiablePresentationResult.custom.valid).to.be.true;

    });
});

describe("#addProofToPresentation", function() {
    it("should throw an error if there is no proof to add", async function() {
        const presentationObject = {
            id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
            verifiableCredential: signedCredential,
        }

        const presentationObjectExpected = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            id: 'urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5',
            type: ['VerifiablePresentation'],
            verifiableCredential: signedCredential,
        }

        const verifiablePresentation = Integrate.presentation.create(presentationObject);

        try {
            await verifiablePresentation.addProof();
        } catch (err) {
            expect(err.message).to.eql("No proof to add");
        }
    });
});

describe("#importExportPresentation", function() {
    const timeNonce = Date.now();
    const fileName = "test/tmp-import-presentation-"+timeNonce+".json";
    let nativePresentation;

    before(function(done){
        nativePresentation = Integrate.presentation.create({id:"did:factom:frontier:ff783452-8226-aedc-a978-6eada3903c5", type: ["CredentialManagerPresentation"], verifiableCredential: {id: "http://example.edu/credentials/4455",
        type: ["VerifiableCredential", "UniversityDegreeCredential"],
        issuer: "https://example.edu/issuers/14",
        issuanceDate: "2010-03-01T19:11:11Z",
        credentialSubject: {
            "id": "did:factom:ccfeb1f7aaf126f1c276e12ec89",
            "degree": {
            "type": "MastersDegree",
            "name": "Master of Arts in Economics"
            }
        },
        credentialStatus: {
            "id": "https://example.edu/status/24",
            "type": "CredentialStatusList2017"
        }}});

        nativePresentation.sign(signObject);
        done();
    });

    after( function() {
        // Delete file once we're done with it; comment/remove if you want to preserve test files.
        fs.unlinkSync(fileName);
    });

    it("should create a new file when exported", function() {
        nativePresentation.export({"type": "file", "fileName": fileName});
        try {
            expect(fs.existsSync(fileName)).to.be.true;
          } catch(err) {
            console.error("Export error:", err)
          }
    });

    it("should match native presentation object after import", function() {
        try {
            expect(fs.existsSync(fileName)).to.be.true;
            const importedPresentation = Integrate.presentation.import({"type": "file", "fileName": fileName});
            expect(importedPresentation).to.eql(nativePresentation);
          } catch(err) {
            console.error("Import error:", err)
          }
    });

});


describe("#registerPresentation", function() {
    it("should not register the presentation when destinationId is invalid or undefined", function() {
        let configureWithoutRegistrationChain = clonedeep(configure);
        delete configureWithoutRegistrationChain.registrationChainId;
        const IntegrateWithoutRegistrationChain = new IntegrateSDK(configureWithoutRegistrationChain);

        let presentationToRegister = IntegrateWithoutRegistrationChain.presentation.create({
            id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
            verifiableCredential: signedCredential,
        });

        presentationToRegister.sign(signObject);
        const registerObjWithEmptyChainId = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            destinationChainId: '',
            hashOnly: true
        };
        presentationToRegister.register(registerObjWithEmptyChainId).then(async (presentationObjectReturned) => {
            const presentationEntryHash = presentationObjectReturned.entry_hash;
        }).catch((error) => {
            expect(error.message).to.equal("Factom destination chainID required");
        });

        const registerObjWithInvalidChainId = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            destinationChainId: '*ia.',
            hashOnly: true
        };
        presentationToRegister.register(registerObjWithInvalidChainId).then(async (presentationObjectReturned) => {
            const presentationEntryHash = presentationObjectReturned.entry_hash;
        }).catch((error) => {
            expect(error.message).to.equal("Factom destination chainID must be a 64-byte hex-string")
        });
    });

    it("should register the presentation with two credentials recursively successfully", function() {
        let presentationToRegister = Integrate.presentation.create({
            id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
            verifiableCredential: [signedCredential, unsignedCredential2]
        });

        presentationToRegister.sign(signObject);
        const registerObj = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            hashOnly: true,
            recursive: true
        };
        presentationToRegister.register(registerObj).then(async (presentationObjectReturned) => {
            const presentationEntryHash = presentationObjectReturned.entry_hash;
        }).catch((error) => {
            expect(error.message).to.equal("Factom destination chainID required");
        });
    });
});
