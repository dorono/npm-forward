const FactomConnectSDK = require("factom-harmony-connect");

/*
 * In the context of the Integrate SDK, "register" means "publish to Factom"
 * The registerIssuer and registerSubject functions both create new chains.
*/

const registerIssuer = async (connectOptions, identityIdentifyingString, signingKeys) => {
    connectOptions.automaticSigning = false;
    factomConnectSDK = new FactomConnectSDK(connectOptions);
    const issuerChainID = await factomConnectSDK.chains.create({
        externalIds: ["IdentityChain", identityIdentifyingString, "Issuer"],
        content: JSON.stringify({
            keys: signingKeys,
            version: 1
        })
    });

    return issuerChainID;
}

const registerSubject =  async (connectOptions, signerPrivKey, signerChain, extIDs, entryContent) => {
    factomConnectSDK = new FactomConnectSDK(connectOptions);
    const subjectChainID = await factomConnectSDK.chains.create({
        signerPrivateKey: signerPrivKey,
        signerChainId: signerChain,
        externalIds: extIDs,
        content: entryContent
    });

    return subjectChainID;
}

module.exports = {registerIssuer, registerSubject};