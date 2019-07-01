"use strict";

const expect = require("chai").expect;
const configure = require("../src/configure");
const IntegrateSDK = require("../index");
const factomproof = require("../src/util/factom-proof");
const util = require('util');                   // This just allows us to print out full objects (with pretty colors)

const Integrate = new IntegrateSDK(configure);

const signVerify = {
    signerPublicKey: "idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR",
}

describe("#createFactomProof", function() {
    it("should filter empty arrays from proof object", function() {
        const emptyArraysProof = factomproof.createProof([], [], []);
        expect(emptyArraysProof).to.eql({
            "@context": "https://project.factom.com/contexts/factom-proof-v1.jsonld",
            "type": "factomProof-v1"});
    });
});

describe("#validateReceipt", function() {
    it("should consider incomplete receipt data to be invalid", function() {
        const validationResult = factomproof.validateReceipt({"test": "notARealReceipt"});
        expect(validationResult).to.be.false;
    });
});

describe("#validateFactomAnchor", function() {
    it("should consider fake Factom anchor data to be invalid", function() {
        const validationResult = factomproof.validateFactomAnchor({"test": "notARealFactomAnchor"});
        expect(validationResult).to.be.false;
    });
});

describe("#validateBitcoinAnchor", function() {
    it("should consider fake Bitcoin anchor data to be invalid", function() {
        const validationResult = factomproof.validateBitcoinAnchor({"test": "notARealBitcoinAnchor"});
        expect(validationResult).to.be.false;
    });
});

describe("#validateEthereumAnchor", function() {
    it("should consider fake Ethereum anchor data to be invalid", function() {
        const validationResult = factomproof.validateEthereumAnchor({"test": "notRealDBlockData"}, {"test": "notARealEthereumAnchor"});
        expect(validationResult).to.be.false;
    });
});


describe("#brokenReceiptTests", function() {
    it("should detect a mismatches between entryHash and entrySerialized data", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.receipt[0].entryHash = '17f957901f9a050bbc9f050020396cbce718d0cf0a8162324608e2c72784d47b';
        const brokenReceiptVerificationResult = importedCredential.verify(signVerify);
        expect(brokenReceiptVerificationResult.valid).to.be.false;
    });

    it("should detect bad merkleBranch data", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.receipt[0].merkleBranch = '17f957901f9a050bbc9f050020396cbce718d0cf0a8162324608e2c72784d47b';
        const brokenReceiptVerificationResult = importedCredential.verify(signVerify);
        expect(brokenReceiptVerificationResult.valid).to.be.false;
    });

    it("should detect bad merkle triplet object format", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.receipt[0].merkleBranch[0] = '17f957901f9a050bbc9f050020396cbce718d0cf0a8162324608e2c72784d47b';
        const brokenReceiptVerificationResult = importedCredential.verify(signVerify);
        expect(brokenReceiptVerificationResult.valid).to.be.false;
    });

    it("should detect bad merkle triplet hash mismatches", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.receipt[0].merkleBranch[0].top = '17f95e901f9a050bbc9f050020396cbce718d0cf0a8162324608e2c72784d47b';
        const brokenReceiptVerificationResult = importedCredential.verify(signVerify);
        expect(brokenReceiptVerificationResult.valid).to.be.false;
    });

    it("should detect entryHash not being present in first merkle triplet object", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        const merkleBranches = importedCredential.proof.anchor[0].anchors[0].merkleBranch;
        let firstTriplet = merkleBranches[0];
        let secondTriplet = merkleBranches[1];
        merkleBranches[0] = secondTriplet;
        merkleBranches[1] = firstTriplet;
        const brokenReceiptVerificationResult = importedCredential.verify(signVerify);
        expect(brokenReceiptVerificationResult.valid).to.be.false;
    });

    it("should detect bad merkle triplet object ordering", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        let firstTriplet = importedCredential.proof.receipt[0].merkleBranch[1];
        let secondTriplet = importedCredential.proof.receipt[0].merkleBranch[2];
        importedCredential.proof.receipt[0].merkleBranch[1] = secondTriplet;
        importedCredential.proof.receipt[0].merkleBranch[2] = firstTriplet;
        const brokenReceiptVerificationResult = importedCredential.verify(signVerify);
        expect(brokenReceiptVerificationResult.valid).to.be.false;
    });

    it("should detect dblock hash missing from merkleBranch", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.receipt[0].dblock.keymr = '30227be00137e45cde5277b23a0147bc2fcb58056430210f565011094a650769';
        const brokenReceiptVerificationResult = importedCredential.verify(signVerify);
        expect(brokenReceiptVerificationResult.valid).to.be.false;
    });

    it("should detect missing fields", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        delete importedCredential.proof.receipt[0].chain;
        const brokenReceiptVerificationResult = importedCredential.verify(signVerify);
        expect(brokenReceiptVerificationResult.valid).to.be.false;
    });
});


describe("#brokenFactomAnchorTests", function() {
    it("should detect a mismatches between entryHash and entrySerialized data", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.anchor[0].anchors[0].entryHash = '17f957901f9a050bbc9f050020396cbce718d0cf0a8162324608e2c72784d47b';
        const brokenAnchorVerificationResult = importedCredential.verify(signVerify);
        expect(brokenAnchorVerificationResult.valid).to.be.false;
    });

    it("should detect bad merkleBranch data", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.anchor[0].anchors[0].merkleBranch = '17f957901f9a050bbc9f050020396cbce718d0cf0a8162324608e2c72784d47b';
        const brokenAnchorVerificationResult = importedCredential.verify(signVerify);
        expect(brokenAnchorVerificationResult.valid).to.be.false;
    });

    it("should detect bad merkle triplet object format", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.anchor[0].anchors[0].merkleBranch[0] = '17f957901f9a050bbc9f050020396cbce718d0cf0a8162324608e2c72784d47b';
        const brokenAnchorVerificationResult = importedCredential.verify(signVerify);
        expect(brokenAnchorVerificationResult.valid).to.be.false;
    });

    it("should detect bad merkle triplet hash mismatches", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.anchor[0].anchors[0].merkleBranch[0].top = '17f95e901f9a050bbc9f050020396cbce718d0cf0a8162324608e2c72784d47b';
        const brokenAnchorVerificationResult = importedCredential.verify(signVerify);
        expect(brokenAnchorVerificationResult.valid).to.be.false;
    });

    it("should detect entryHash not being present in first merkle triplet object", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        let firstTriplet = importedCredential.proof.anchor[0].anchors[0].merkleBranch[0];
        let secondTriplet = importedCredential.proof.anchor[0].anchors[0].merkleBranch[1];
        importedCredential.proof.anchor[0].anchors[0].merkleBranch[0] = secondTriplet;
        importedCredential.proof.anchor[0].anchors[0].merkleBranch[1] = firstTriplet;
        const brokenAnchorVerificationResult = importedCredential.verify(signVerify);
        expect(brokenAnchorVerificationResult.valid).to.be.false;
    });

    it("should detect bad merkle triplet object ordering", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        let firstTriplet = importedCredential.proof.anchor[0].anchors[0].merkleBranch[1];
        let secondTriplet = importedCredential.proof.anchor[0].anchors[0].merkleBranch[2];
        importedCredential.proof.anchor[0].anchors[0].merkleBranch[1] = secondTriplet;
        importedCredential.proof.anchor[0].anchors[0].merkleBranch[2] = firstTriplet;
        const brokenAnchorVerificationResult = importedCredential.verify(signVerify);
        expect(brokenAnchorVerificationResult.valid).to.be.false;
    });

    it("should detect dblock hash missing from merkleBranch", function() {
        let importedCredential = Integrate.credential.import({"type": "file", "fileName": "./test/tmp/credentialWithFactomProof.json"});
        const initialVerifyCredentialResult = importedCredential.verify(signVerify);
        expect(initialVerifyCredentialResult.valid).to.be.true;
        importedCredential.proof.anchor[0].anchors[0].dblock.keymr = '30227be00137e45cde5277b23a0147bc2fcb58056430210f565011094a650769';
        const brokenAnchorVerificationResult = importedCredential.verify(signVerify);
        expect(brokenAnchorVerificationResult.valid).to.be.false;
    });
});