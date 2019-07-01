"use strict";

const expect = require("chai").expect;
const configure = require("../src/configure");
const IntegrateSDK = require("../index");
const jsonld = require('jsonld');
const Integrate = new IntegrateSDK(configure);

const claimObject = Integrate.claim.create({
    id: "http://example.gov/credentials/3732",
    type: ["Credential", "ProofOfAgeCredential"],
    "@context": "https://w3id.org/identity/v1",
    "ageOver": 21,
    "issuer": "https://dmv.example.gov",
    "issued": "2010-01-01"
    });

const credentialObjectWithSingleContext = {
    id: "http://example.gov/credentials/9227ea1",
    issuer: "did:factom:702f49480aec6780582f26e1c422c657521861ead556ec67805822edfc9480ac",
    credentialSubject: claimObject,
    issuanceDate: "2010-01-02",
    "@context": ["https://project.factom.com/contexts/citizen-v1.jsonld"],
    "FullName": "Devendra Basu",
    "UID": "did:factom:f26e1c422c657521861ced450442d0c664702f49480aec67805822edfcfee758",
    "keyHash": "ade47804aa0127c29e22389574a1e6932534ff9225304d07f95b31c473789756"
};

const credentialObjectWithMultipleContexts = {
    id: "http://example.gov/credentials/9227ea1",
    issuer: "did:factom:ee1fac422c657521861ced450442d0c664702f49480aec67805822edfcfee758",
    credentialSubject: claimObject,
    issuanceDate: "2010-01-02",
    "FullName": "Devendra Basu",
    "UID": "did:factom:f26e1c422c657521861ced454a1e6932534ff9225304d07f95b31c4737897562",
    "keyHash": "ade47804aa0127c29e22389574a1e6932534ff9225304d07f95b31c473789756",
    "issuer": "https://dmv.india.gov",
    "issued": "2010-02-24",
    "@context": ["https://w3id.org/identity/v1", "https://project.factom.com/contexts/citizen-v1.jsonld"]
};

const expectedSingleContextCanonization = '<http://example.gov/credentials/9227ea1> <http://project.factom.com/contexts/citizen#UID> "did:factom:f26e1c422c657521861ced450442d0c664702f49480aec67805822edfcfee758" .\n<http://example.gov/credentials/9227ea1> <http://project.factom.com/contexts/citizen#keyHash> "ade47804aa0127c29e22389574a1e6932534ff9225304d07f95b31c473789756" .\n<http://example.gov/credentials/9227ea1> <http://schema.org/name> "Devendra Basu" .\n';
const expectedMultipleContextCanonization = '<http://example.gov/credentials/9227ea1> <http://project.factom.com/contexts/citizen#UID> "did:factom:f26e1c422c657521861ced454a1e6932534ff9225304d07f95b31c4737897562" .\n<http://example.gov/credentials/9227ea1> <http://project.factom.com/contexts/citizen#keyHash> "ade47804aa0127c29e22389574a1e6932534ff9225304d07f95b31c473789756" .\n<http://example.gov/credentials/9227ea1> <http://schema.org/name> "Devendra Basu" .\n<http://example.gov/credentials/9227ea1> <https://w3id.org/credentials#issued> "2010-02-24"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n<http://example.gov/credentials/9227ea1> <https://w3id.org/credentials#issuer> <https://dmv.india.gov> .\n';


describe("#checkContext", function() {
    it("should canonize credential using single context", function() {
        const firstCredential = Integrate.credential.create(credentialObjectWithSingleContext);
        jsonld.canonize(firstCredential, {
            algorithm: 'URDNA2015',
            format: 'application/n-quads'
        }, (err, canonizedObject) => {
            expect(canonizedObject).to.eql(expectedSingleContextCanonization);
        });
    });

    it("should canonize credential using multiple contexts", function() {
        const secondCredential = Integrate.credential.create(credentialObjectWithMultipleContexts);
        jsonld.canonize(secondCredential, {
            algorithm: 'URDNA2015',
            format: 'application/n-quads'
        }, (err, canonizedObject) => {
            if (err) {
                throw err;
            }
            expect(canonizedObject).to.eql(expectedMultipleContextCanonization);
        });
    });
});