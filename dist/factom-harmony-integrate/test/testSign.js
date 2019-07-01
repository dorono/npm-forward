const expect = require("chai").expect;
const clonedeep = require('lodash.clonedeep')

// Import the configuration and the SDK:
const configure = require('../src/configure');
const sign = require('../src/util/sign');
// const IntegrateSDK = require('factom-harmony-integrate');
const IntegrateSDK = require("../index");

// Instantiate the SDK Class:
const Integrate = new IntegrateSDK(configure);

const claimObject = {
    id: "http://example.gov/credentials/3732",
    type: ["Credential", "ProofOfAgeCredential"],
    "@context": "https://w3id.org/identity/v1",
    "ageOver": 21,
    "issuer": "https://dmv.example.gov",
    "issued": "2010-01-01"
};

const signObject = {
    signer: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
    signerPrivateKey: "idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6"
}

let badSignObject = {
    signer: "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79",
    signerPrivateKey: "idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmBa"
}

const signVerify = {
    signerPublicKey: "idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR",
}

const signedClaim = Integrate.claim.create(claimObject).sign(signObject);
const goodSignatureObject = sign.signContent(creatorId="did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79", signerPrivateKey="idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6", message="test", signingAlgorithm="ed25519signature2018");
let signatureObjectClone = clonedeep(goodSignatureObject);
signatureObjectClone.type = "notEd25519";

describe("#signatureTests", function() {
    it("should throw error when signerPrivateKey is invalid", function() {
        try {
            const failedSignClaim = Integrate.claim.create(claimObject).sign(badSignObject);
        } catch (err) {
            expect(err.message).to.eql("Error during signing: signerPrivateKey is invalid");
        }
    });

    it("should throw error when signerPrivateKey is missing", function() {
        delete badSignObject.signerPrivateKey;
        try {
            const failedSignClaim = Integrate.claim.create(claimObject).sign(badSignObject);
        } catch (err) {
            expect(err.message).to.eql("Error during signing: signerPrivateKey is required");
        }
    });

    it("should throw error when message is missing", function() {
        try {
            sign.signContent(creatorId="did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79", signerPrivateKey="idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6", message="", signingAlgorithm="ed25519signature2018");
        } catch (err) {
            expect(err.message).to.eql("message is required");
        }
    });

    it("should throw signing error on unsupported signature types", function() {
        try {
            sign.signContent(creatorId="did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79", signerPrivateKey="idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6", message="test", signingAlgorithm="ed25519signature2015");
        } catch (err) {
            expect(err.message).to.eql("only ed25519signature2018 signature algorithm is currently supported");
        }
    });

    it("should validate good signatures without issue", function() {
        const sigVerifyResult = sign.validateSignature(goodSignatureObject, signVerify.signerPublicKey, "test");
        expect(sigVerifyResult).to.eql(true);
    });

    it("should throw error when signature object is missing/null", function() {
        try {
            sign.validateSignature(null, signVerify.signerPublicKey, "test");
        } catch (err) {
            expect(err.message).to.eql("signature is required.");
        }
    });

    it("should throw error when signerPublicKey is missing", function() {
        try {
            sign.validateSignature(goodSignatureObject, null, "test");
        } catch (err) {
            expect(err.message).to.eql("signerPublicKey is required.");
        }
    });

    it("should throw error when message is missing", function() {
        try {
            sign.validateSignature(goodSignatureObject, signVerify.signerPublicKey);
        } catch (err) {
            expect(err.message).to.eql("message is required.");
        }
    });

    it("should throw validating error on unsupported signature types", function() {
        try {
            sign.validateSignature(signatureObjectClone, signVerify.signerPublicKey, "test");
        } catch (err) {
            expect(err.message).to.eql("only ed25519signature2018 signature algorithm is currently supported");
        }
    });

    it("should throw validating error when required fields are missing", function() {
        delete signatureObjectClone.type;

        const noTypeResult = sign.validateSignature(signatureObjectClone, signVerify.signerPublicKey, "test");
        expect(noTypeResult).to.eql(false);

        signatureObjectClone.type = goodSignatureObject.type;
        delete signatureObjectClone.signatureValue;

        const noSignatureValue = sign.validateSignature(signatureObjectClone, signVerify.signerPublicKey, "test");
        expect(noSignatureValue).to.eql(false);

        try {
            sign.validateSignature(goodSignatureObject, "idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTRaaaaaaaaaaaa", "test");
        } catch (err) {
            expect(err.message).to.eql("signerPublicKey is invalid.");
        }
    });
});