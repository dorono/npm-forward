const expect = require("chai").expect;

// Import the configuration and the SDK:
const configure = require('../src/configure');
// const IntegrateSDK = require('factom-harmony-integrate');
const IntegrateSDK = require("../index");
const fs = require('fs');

// Instantiate the SDK Class:
const Integrate = new IntegrateSDK(configure);

describe("#saveLoadPresentation", function() {
    it("use_case_1", async function() {
    this.timeout(10000);
    const claimObj1 = Integrate.claim.create({
        id: 'did:factom:3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1',
        FullName: 'John Doe',
        DOB: 'Aug 31'
    })  
    const claimObj2 = Integrate.claim.create({
        id: 'did:factom:3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1',
        Age: 46,
        Status: 'Employed'
    })  

    const credentialObj = Integrate.credential.create({
        issuer: 'did:factom:3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1',
        issuanceDate: '2000-04-21',
        credentialSubject: [claimObj1, claimObj2]
    });

    const presentationObj = Integrate.presentation.create({
        verifiableCredential: credentialObj

        
    });

    const signedPresentationObj = presentationObj.sign({
        recursive: true,
        signer: 'did:factom:3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1#key-1',
        signerPrivateKey: configure.privateKey
    });


    const presentationWithRSAProof = await signedPresentationObj.addProof({
        "type": "RsaSignature2018",
        "created": "2018-06-18T21:19:10Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "https://example.com/jdoe/keys/1",
        "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19ZhDJBMvvFAIC00nSGB6Tn0XKbbF9XrsaJZREWvR2aONYTQQxnyXirtXnlewJMB"
    });

    const registeredPresentationObj = await presentationWithRSAProof.register({
        // destinationChainId: configure.identityChainId,
        signerPrivateKey: configure.privateKey,
        signerChainId: configure.identityChainId,
        recursive: true,
        hashOnly: true
    })

    if (!fs.existsSync('./test/tmp')){
        fs.mkdirSync('./test/tmp');
    }

    signedPresentationObj.export({"type": "file", "fileName": "./test/tmp/registeredPresentation.json"});
    const registeredPresentationObj1 = Integrate.presentation.import({"type": "file", "fileName": "./test/tmp/preRegisteredPresentation.json"});
    const signVerify = {
        signerPublicKey: "idpub1pA4uBqxNTf4etoVHLMLFsoHhifEh1bVuua4mmJWtRAsFBgpnq",
    }
    
    await registeredPresentationObj1.addProof();

    const verifyPresentationObj = await registeredPresentationObj1.verify(signVerify);
    expect(true).to.eql(true);
    });
});