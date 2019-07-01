"use strict";

const expect = require("chai").expect;
const register = require("../src/util/register");
const configure = require("../src/configure");
const IntegrateSDK = require("../index");
const clonedeep = require('lodash.clonedeep');
const fs = require('fs');

const Integrate = new IntegrateSDK(configure);

const credentialObject = {
    id: "http://example.edu/credentials/3732",
    type: ["VerifiableCredential", "UniversityDegreeCredential"],
    issuer: "https://example.edu/issuers/14",
    issuanceDate: "2010-01-01T19:23:24Z",
    credentialSubject: {
        id: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
        degree: {
            type: "BachelorDegree",
            name: "Bachelor of Science in Mechanical Engineering"
        }
    },
    credentialStatus: {
        id: "https://example.edu/status/24",
        type: "CredentialStatusList2017"
    },
    "@context": ["https://www.w3.org/2018/credentials/v1"]
};

const signObject = {
    signer: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
    signerPrivateKey: "idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6"
}

const signVerify = {
    signerPublicKey: "idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR",
}

const credentialObjectExpected = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: 'http://example.edu/credentials/3732',
    type: [ 'VerifiableCredential', 'UniversityDegreeCredential' ],
    issuer: 'https://example.edu/issuers/14',
    issuanceDate: '2010-01-01T19:23:24Z',
    credentialSubject:
        { id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
        degree:
        { type: 'BachelorDegree',
            name: 'Bachelor of Science in Mechanical Engineering' } },
    credentialStatus:
        { id: 'https://example.edu/status/24',
        type: 'CredentialStatusList2017' }
}

describe("#createCredential", function() {
    it("should construct unsigned credential appropriately", function() {
        const unsignedCredential = Integrate.credential.create(credentialObject);
        expect(unsignedCredential).to.eql(credentialObjectExpected);
    });

    it("should throw an error when no issuer is defined", function() {
        try {
            Integrate.credential.create({
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                id: 'http://example.edu/credentials/3732',
                type: [ 'VerifiableCredential', 'UniversityDegreeCredential' ],
                issuanceDate: '2010-01-01T19:23:24Z',
                credentialSubject:
                    { id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
                    degree:
                    { type: 'BachelorDegree',
                        name: 'Bachelor of Science in Mechanical Engineering' } },
                credentialStatus:
                    { id: 'https://example.edu/status/24',
                    type: 'CredentialStatusList2017' }
            });
        } catch (err) {
            expect(err.message).to.eql('issuer property is required for credentials');
        }
    });

    it("should throw an error when no issuanceDate is defined", function() {
        try {
            Integrate.credential.create({
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                id: 'http://example.edu/credentials/3732',
                issuer: 'https://example.edu/issuers/14',
                type: [ 'VerifiableCredential', 'UniversityDegreeCredential' ],
                credentialSubject:
                    { id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
                    degree:
                    { type: 'BachelorDegree',
                        name: 'Bachelor of Science in Mechanical Engineering' } },
                credentialStatus:
                    { id: 'https://example.edu/status/24',
                    type: 'CredentialStatusList2017' }
            });
        } catch (err) {
            expect(err.message).to.eql('issuanceDate property is required for credentials');
        }
    });

    it("should throw an error when no credentialSubject is defined", function() {
        try {
            Integrate.credential.create({
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                id: 'http://example.edu/credentials/3732',
                type: [ 'VerifiableCredential', 'UniversityDegreeCredential' ],
                issuer: 'https://example.edu/issuers/14',
                issuanceDate: '2010-01-01T19:23:24Z',
                credentialStatus:
                    { id: 'https://example.edu/status/24',
                    type: 'CredentialStatusList2017' }
            });
        } catch (err) {
            expect(err.message).to.eql('credentialSubject property is required for credentials');
        }
    });

    it("should throw an error when id is not a valid URL", function() {
        try {
            Integrate.credential.create({
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                id: 'xyz',
                type: [ 'VerifiableCredential', 'UniversityDegreeCredential' ],
                issuer: 'https://example.edu/issuers/14',
                issuanceDate: '2010-01-01T19:23:24Z',
                credentialSubject:
                    { id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
                    degree:
                    { type: 'BachelorDegree',
                        name: 'Bachelor of Science in Mechanical Engineering' } },
                credentialStatus:
                    { id: 'https://example.edu/status/24',
                    type: 'CredentialStatusList2017' }
            });
        } catch (err) {
            expect(err.message.substring(0,49)).to.eql('Object does not have a valid credential structure');
        }
    });
});

describe("#signCredential", function() {
    let unsignedCredential;
    let signedCredential;

    before(function(done){
        unsignedCredential = Integrate.credential.create(credentialObject);
        signedCredential = unsignedCredential.sign(signObject);
        done();
    });

    it("should sign and validate credential successfully", function() {
        const credentialSignatureCheck = signedCredential.verify(signVerify);
        expect(credentialSignatureCheck.valid).to.be.true;
        expect(credentialSignatureCheck.proof[0].type).to.eql('ed25519signature2018');
    });

    it("should properly use the customValidation method", function() {
        const alwaysFalseFunc = function(obj, key) {
            return false;
        }

        const alwaysTrueFunc = function(obj, key) {
            return true;
        }

        let customCredentialCheck = signedCredential.verify({ signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR', customVerificationMethod: alwaysFalseFunc});
        expect(customCredentialCheck.custom.valid).to.be.false;

        customCredentialCheck = signedCredential.verify({ signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR', customVerificationMethod: alwaysTrueFunc});
        expect(customCredentialCheck.custom.valid).to.be.true;

    });

    it("should check credential expiration during validation", function() {
        let expiredUnsignedCredential = Object.assign( Object.create( Object.getPrototypeOf(unsignedCredential)), unsignedCredential);
        expiredUnsignedCredential.expirationDate = "2018-01-01T19:23:24Z";

        const expiredSignedCredential = expiredUnsignedCredential.sign(signObject);
        const expiredCredentialSignatureCheck = expiredSignedCredential.verify(signVerify);

        expect(expiredCredentialSignatureCheck.expiration.valid).to.be.false;
    });

    it("should not validate credential with bad signature", function() {
        const sigVal = signedCredential.proof.signatureValue;
        const brokenSignature = sigVal.substring(0, 10) + "Cf" + sigVal.substring(12);
        //let clonedCredential = Object.assign( Object.create( Object.getPrototypeOf(signedCredential)), signedCredential);

        let clonedCredential = clonedeep(signedCredential);
        clonedCredential.proof.signatureValue = brokenSignature;

        const badSignatureCheck = clonedCredential.verify(signVerify);
        expect(badSignatureCheck.proof[0].type).to.eql('ed25519signature2018');
        expect(badSignatureCheck.valid).to.be.false;
    });

    it("should not validate credential with wrong pubkey", function() {
        const wrongKeySignedCredential = unsignedCredential.sign({signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79', signerPrivateKey: 'idsec2YEyrQZaLHJGEivUAzimEp5ZAA8x8V5EMA9yvEEvSagEXpfqzz'});
        // correct pubkey would be idpub2R1X1FjQg7EJXxLyx1T6TjGCPPBjE9i5GvzXWdz4osmcHSxTwt
        const otherSignatureCheck = wrongKeySignedCredential.verify({signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'});

        expect(otherSignatureCheck.valid).to.be.false;
    });

    it("should validate a single signed claim within credential", function() {
        const signedClaim = Integrate.claim.create({
            id: "http://example.gov/credentials/3732",
            type: ["Credential", "ProofOfAgeCredential"],
            "@context": "https://w3id.org/identity/v1",
            "ageOver": 21,
            "issuer": "https://dmv.example.gov",
            "issued": "2010-01-01"
        }).sign(signObject);

        const containingCredential = Integrate.credential.create({
            id: "http://example.edu/credentials/3732",
            type: ["VerifiableCredential", "UniversityDegreeCredential"],
            issuer: "https://example.edu/issuers/14",
            issuanceDate: "2010-01-01T19:23:24Z",
            credentialSubject: signedClaim,
            credentialStatus: {
                id: "https://example.edu/status/24",
                type: "CredentialStatusList2017"
            },
            "@context": ["https://www.w3.org/2018/credentials/v1"]
        }).sign(signObject);

        const fullVerifyResult = containingCredential.verify(signVerify);
        expect(fullVerifyResult.valid).to.eql(true);
    });

    it("should validate multiple signed claims within credential", function() {
        const signedClaim1 = Integrate.claim.create({
            id: "http://example.gov/credentials/3732",
            type: ["Credential", "ProofOfAgeCredential"],
            "@context": "https://w3id.org/identity/v1",
            "ageOver": 21,
            "issuer": "https://dmv.example.gov",
            "issued": "2010-01-01"
        }).sign(signObject);

        const signedClaim2 = Integrate.claim.create({
            id: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
            degree: {
                type: "BachelorDegree",
                name: "Bachelor of Science in Mechanical Engineering"
            }
        }).sign(signObject);

        const containingCredential = Integrate.credential.create({
            id: "http://example.edu/credentials/3732",
            type: ["VerifiableCredential", "UniversityDegreeCredential"],
            issuer: "https://example.edu/issuers/14",
            issuanceDate: "2010-01-01T19:23:24Z",
            credentialSubject: [signedClaim1, signedClaim2],
            credentialStatus: {
                id: "https://example.edu/status/24",
                type: "CredentialStatusList2017"
            },
            "@context": ["https://www.w3.org/2018/credentials/v1"]
        }).sign(signObject);

        const fullVerifyResult = containingCredential.verify(signVerify);
        expect(fullVerifyResult.valid).to.eql(true);
    });

    it("should not validate a badly signed claim within credential", function() {
        let badlySignedClaim = Integrate.claim.create({
            id: "http://example.gov/credentials/3732",
            type: ["Credential", "ProofOfAgeCredential"],
            "@context": "https://w3id.org/identity/v1",
            "ageOver": 21,
            "issuer": "https://dmv.example.gov",
            "issued": "2010-01-01"
        }).sign(signObject);

        badlySignedClaim.proof.signatureValue = "fakeSignature";

        const containingCredential = Integrate.credential.create({
            id: "http://example.edu/credentials/3732",
            type: ["VerifiableCredential", "UniversityDegreeCredential"],
            issuer: "https://example.edu/issuers/14",
            issuanceDate: "2010-01-01T19:23:24Z",
            credentialSubject: badlySignedClaim,
            credentialStatus: {
                id: "https://example.edu/status/24",
                type: "CredentialStatusList2017"
            },
            "@context": ["https://www.w3.org/2018/credentials/v1"]
        }).sign(signObject);

        const fullVerifyResult = containingCredential.verify(signVerify);
        expect(fullVerifyResult.valid).to.eql(false);
    });

    it("should consider credential invalid if even one contained claim has a bad signature", function() {
        const wellSignedClaim = Integrate.claim.create({
            id: "http://example.gov/credentials/3732",
            type: ["Credential", "ProofOfAgeCredential"],
            "@context": "https://w3id.org/identity/v1",
            "ageOver": 21,
            "issuer": "https://dmv.example.gov",
            "issued": "2010-01-01"
        }).sign(signObject);

        const badlySignedClaim = Integrate.claim.create({
            id: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
            degree: {
                type: "BachelorDegree",
                name: "Bachelor of Science in Mechanical Engineering"
            }
        }).sign(signObject);

        badlySignedClaim.proof.signatureValue = "fakeSignature";

        const containingCredential = Integrate.credential.create({
            id: "http://example.edu/credentials/3732",
            type: ["VerifiableCredential", "UniversityDegreeCredential"],
            issuer: "https://example.edu/issuers/14",
            issuanceDate: "2010-01-01T19:23:24Z",
            credentialSubject: [wellSignedClaim, badlySignedClaim],
            credentialStatus: {
                id: "https://example.edu/status/24",
                type: "CredentialStatusList2017"
            },
            "@context": ["https://www.w3.org/2018/credentials/v1"]
        }).sign(signObject);

        const fullVerifyResult = containingCredential.verify(signVerify);
        expect(fullVerifyResult.valid).to.eql(false);
    });
});

describe("#registerCredential", function() {
    let subjectChainID;
    let credentialToRegister;

    before(function(done){
        register.registerIssuer(configure, "LoanOriginator", ["idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR"]).then((registerIssuerResponse) => {
            const issuerChainID = registerIssuerResponse.chain_id;
            const issuerDID = "did:factom:"+issuerChainID;
            register.registerSubject(configure, configure.privateKey, configure.identityChainId, ["type:Mortgage","version:1"], '{"version":1}').then((registerSubjectResponse) => {
                subjectChainID = registerSubjectResponse.chain_id;

                const credentialData = {
                    id: "http://example.edu/credentials/3732",
                    type: ["MortgageRegistry"],
                    issuer: issuerDID,
                    issuanceDate: "2010-01-01T19:23:24Z",
                    credentialSubject: {
                        "id": subjectChainID,
                        "degree": {
                            "type": "LoanOrigination",
                            "name": "345-65445-6782-221"
                        }
                    },
                    credentialStatus: {
                        "id": "https://example.edu/status/24",
                        "type": "CredentialStatusList2017",
                    }
                }

                credentialToRegister = Integrate.credential.create(credentialData);
                credentialToRegister.sign(signObject);
                done();
            }).catch((error) => {
                console.log("ERROR in registerSubject:", error);
            });
        }).catch((error) => {
            console.log("ERROR in registerIssuer:", error);
        });
    });

    it("should be registered successfully to factom", function() {
        const credentialData = {
            id: "http://example.edu/credentials/3732",
            type: ["MortgageRegistry"],
            issuer: "123",
            issuanceDate: "2010-01-01T19:23:24Z",
            credentialSubject: {
                "id": "123",
                "degree": {
                    "type": "LoanOrigination",
                    "name": "345-65445-6782-221"
                }
            },
            credentialStatus: {
                "id": "https://example.edu/status/24",
                "type": "CredentialStatusList2017",
            }
        }

        let credentialToRegister = Integrate.credential.create(credentialData);
        credentialToRegister.sign(signObject);
        const registerObj = {
            signerPrivateKey: "idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6",
            signerChainId: "2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
            destinationChainId: "3333f6e2d125663a5352464630a06b41317af0715e2a5e4daf0086dc72c300f3",
        }
        credentialToRegister.register(registerObj).then(async (credentialObjectReturned) => {
            let fullRegisterCredentialResponse = credentialObjectReturned['_factomMetadata'];
            expect(fullRegisterCredentialResponse).to.have.any.keys('pendingFactomEntries');
            let registerCredentialResponse = fullRegisterCredentialResponse['pendingFactomEntries'][0];
            expect(registerCredentialResponse).to.have.any.keys('entryHash');
            const credentialEntryHash = registerCredentialResponse.entryHash;
            expect(credentialEntryHash).to.not.be.null;
            expect(credentialToRegister.baseData()).to.not.have.keys(['_factomMetadata']);
        }).catch((error) => {
            console.log("ERROR in registerCredential:", error);
        });
    });

    it("should not register the credential when destinationId is invalid or undefined", function() {
        let configureWithoutRegistrationChain = clonedeep(configure);
        delete configureWithoutRegistrationChain.registrationChainId;
        const IntegrateWithoutRegistrationChain = new IntegrateSDK(configureWithoutRegistrationChain);

        let credentialToRegister = IntegrateWithoutRegistrationChain.credential.create({
            id: "http://example.edu/credentials/3732",
            type: ["MortgageRegistry"],
            issuer: "123",
            issuanceDate: "2010-01-01T19:23:24Z",
            credentialSubject: {
                "id": "123",
                "degree": {
                    "type": "LoanOrigination",
                    "name": "345-65445-6782-221"
                }
            },
            credentialStatus: {
                "id": "https://example.edu/status/24",
                "type": "CredentialStatusList2017",
            }
        });
        credentialToRegister.sign(signObject);

        credentialToRegister.sign(signObject);
        const registerObjWithEmptyChainId = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            destinationChainId: '',
            hashOnly: true
        };
        credentialToRegister.register(registerObjWithEmptyChainId).then(async (credObjectReturned) => {
            const credEntryHash = credObjectReturned.entry_hash;
        }).catch((error) => {
            expect(error.message).to.equal("Factom destination chainID required");
        });

        const registerObjWithInvalidChainId = {
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            destinationChainId: '*ia.',
            hashOnly: true
        };
        credentialToRegister.register(registerObjWithInvalidChainId).then(async (credObjectReturned) => {
            const credEntryHash = credObjectReturned.entry_hash;
        }).catch((error) => {
            expect(error.message).to.equal("Factom destination chainID must be a 64-byte hex-string")
        });
    });
});

describe("#addProofToCredential", function() {
    it("should throw an error if there is no proof to add", async function() {
        let createdCredential = Integrate.credential.create({
            id: "http://example.edu/credentials/3732",
            type: ["MortgageRegistry"],
            issuer: "123",
            issuanceDate: "2010-01-01T19:23:24Z",
            credentialSubject: {
                "id": "123",
                "degree": {
                    "type": "LoanOrigination",
                    "name": "345-65445-6782-221"
                }
            },
            credentialStatus: {
                "id": "https://example.edu/status/24",
                "type": "CredentialStatusList2017",
            }
        });

        try {
            await createdCredential.addProof();
        } catch (err) {
            expect(err.message).to.eql("No proof to add");
        }
    });
});

describe("#signVerificationRemoveValues", function() {
    const unsignedCredential = Integrate.credential.create(credentialObject);                
    it("structure is invalid when credential subject is removed", function() {
        const signedCredential = unsignedCredential.sign(signObject);        
        delete signedCredential.credentialSubject           
        const result = signedCredential.verify(signVerify);        
        expect(result.structure.valid).to.be.false;   
        expect(result.valid).to.be.false;        
    });
    
    it("structure is invalid when issuer is removed", function() {
        delete unsignedCredential.issuer
        const result = unsignedCredential.verify(signVerify);        
        expect(result.structure.valid).to.be.false;   
        expect(result.valid).to.be.false;        
    });

    it("structure is invalid when issuanceDate is removed", function() {
        delete unsignedCredential.issuanceDate
        const result = unsignedCredential.verify(signVerify);        
        expect(result.structure.valid).to.be.false;   
        expect(result.valid).to.be.false;        
    });
});

describe("#importExportCredential", function() {
    const timeNonce = Date.now();
    const fileName = "test/tmp-import-cred-"+timeNonce+".json";
    let nativeCredential;

    before(function(done){
        const credentialData = {
            id: "http://example.tld/cred/eeab-45c4-335a-3231",
            type: ["HonorList2019"],
            issuer: "did:factom:Academy-8834ae3c28",
            issuanceDate: "2010-01-01T19:23:24Z",
            credentialSubject: {
                "id": "JG-275431",
                "event": {
                    "type": "Promotion",
                    "v": "u-3999jx-b3"
                }
            },
            credentialStatus: {
                "id": "https://example.tld/status/24",
                "type": "CredentialStatusList2017",
            }
        }

        nativeCredential = Integrate.credential.create(credentialData);
        nativeCredential.sign(signObject);
        done();
    });

    after( function() {
        // Delete file once we're done with it; comment/remove if you want to preserve test files.
        fs.unlinkSync(fileName);
    });

    it("should create a new file when exported", function() {
        nativeCredential.export({"type": "file", "fileName": fileName});
        try {
            expect(fs.existsSync(fileName)).to.be.true;
          } catch(err) {
            console.error("Export error:", err)
          }
    });

    it("should match native credential object after import", function() {
        try {
            expect(fs.existsSync(fileName)).to.be.true;
            const importedCredential = Integrate.credential.import({"type": "file", "fileName": fileName});
            expect(importedCredential).to.eql(nativeCredential);
          } catch(err) {
            console.error("Import error:", err)
          }
    });

});

describe("#fullCredentialFlow", function() {
    it("should register, addProof, and verify successfully", async function() {
        this.timeout(10000);
        const claimObj1 = Integrate.claim.create({
            id: 'did:factom:3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1',
            FullName: 'John Doe',
            DOB: 'Aug 31'
        }).sign(signObject);

        const claimObj2 = Integrate.claim.create({
            id: 'did:factom:3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1',
            Age: 46,
            Status: 'Employed'
        }).sign(signObject);

        const credentialObj = Integrate.credential.create({
            issuer: 'did:factom:3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1',
            issuanceDate: '2000-04-21',
            credentialSubject: [claimObj1, claimObj2]
        }).sign(signObject);

        const registeredCredential = await credentialObj.register({
            signerPrivateKey: configure.privateKey,
            signerChainId: configure.identityChainId,
            recursive: true,
            hashOnly: true
        });

        if (!fs.existsSync('./test/tmp')){
            fs.mkdirSync('./test/tmp');
        }

        registeredCredential.export({"type": "file", "fileName": "./test/tmp/registeredCredential.json"});
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/preRegisteredCredential.json"});

        await importedCredential.addProof();

        const verifyCredentialResult = await importedCredential.verify(signVerify);

        expect(verifyCredentialResult.valid).to.be.true;
    });
});