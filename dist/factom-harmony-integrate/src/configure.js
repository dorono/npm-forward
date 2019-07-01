// TODO: remove default authentication credentials, replace with placeholders
// ( like at https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/sample-app/configure.js )
const configure = {
    baseUrl: 'https://ephemeral.api.factom.com/v1',
    accessToken: {
        appId: '8529b07b',
        appKey: '21dbc9644c6bbe31786e13de28dfa150',
    },
    // automaticSigning: true,
    identityChainId: '3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1',   
    registrationChainId: '3227cb6bf6bc1473f80a01705df7f85c150270642553abf3552c36431eddc8c1', 
    privateKey: 'idsec2DghATH74ZiXmuMYged51kNScjkEDuPcC4XvYuXp9WdS3HJ81B',
    publicKey: 'idpub1pA4uBqxNTf4etoVHLMLFsoHhifEh1bVuua4mmJWtRAsFBgpnq'
};

module.exports = configure;