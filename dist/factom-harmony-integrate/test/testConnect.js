"use strict";

const Factom = require('factom-harmony-connect')
const util = require('util')

const factom = new Factom({
    accessToken: {
        appId: 'c4bf0d81',
        appKey: '46e615e9bc4c2024784490373e9c3be8',
    },
    baseUrl: 'https://ephemeral.api.factom.com/v1',
  });

// describe("#get_chain_id", function() {
//     factom.chains.get({
//         chainId: 'dd0cdadcc9a0d39acae889092dd373d9c970b2313f0ff0157275f95bb588bfcb',       
//       })  
//        .then((res) => {
//         console.log(util.inspect(res, false, null, true /* enable colors */))
//        })
//        .catch((err) => {
//         console.log(err);
//        });
//     });

// describe("#create_chain", async function(){
//     const createChainResponse = await factom.chains.create({
//         externalIds: ["NotarySimulation", "CustomerChain", "new1"],
//         content: "This chain represents a notary service's customer in the NotarySimulation, a sample implementation provided as part of the Factom Harmony SDKs. Learn more here: https://docs.harmony.factom.com/docs/sdks-clients",
//         automaticSigning: false      
//       }).then((res) => {
//         console.log(util.inspect(res, false, null, true /* enable colors */))
//        })
//        .catch((err) => {
//         console.log(err);
//        });
//     });





// describe("#generatekeypair", function() {
//     factom.utils.generateKeyPair({})  
//        .then((res) => {
//         console.log(util.inspect(res, false, null, true /* enable colors */))
//        })
//        .catch((err) => {
//         console.log(err);
//        });
//     });



// describe("#create_chain", async function(){
//     const createChainResponse = await factom.chains.create({
//         externalIds: ["NotarySimulation", "CustomerChain", "veena_incorrect_privatekey"],
//         content: "This chain represents a notary service's customer in the NotarySimulation, a sample implementation provided as part of the Factom Harmony SDKs. Learn more here: https://docs.harmony.factom.com/docs/sdks-clients",
//         automaticSigning: true,      
//         signerPrivateKey: 'sec2XoyV98GxgjRGQUoKR3Eea1uQ2VnhjuPejKFZCpnN2BdMdEZDw',
//         signerChainId: '24a99012122a736cf94dabfa4465c5b6ad5abe94b85badafeb5bd72aa3030a3d',
//       }).then((res) => {
//         console.log(util.inspect(res, false, null, true /* enable colors */))
//        })
//        .catch((err) => {
//         console.log(err);
//        });
//     });


// describe("#create_identity_chain", async function(){
//     const new_number = Math.random()
//     const createChainResponse = await factom.identities.create({       
//        names: ["veena",new_number.toString()]
//       }).then((res) => {
//         console.log(util.inspect(res, false, null, true /* enable colors */))
//        })
//        .catch((err) => {
//         console.log(err);
//        });
//     }); 
