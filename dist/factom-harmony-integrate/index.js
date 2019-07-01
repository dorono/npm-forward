const FactomConnectSDK = require("factom-harmony-connect");
const Claim = require('./src/claim/claim');
const Credential = require('./src/credential/credential');
const Presentation = require('./src/presentation/presentation');

class IntegrateSDK {
  /**
   * @constructor
   * @param  {Object} connectOptions - An object containing the access token and the base URL
   * @param  {Object} registrationChain
   * @param  {String} registrationChain.issuerChain
   * @param  {Object} registrationChain.subjectChain
   * @param  {Object} registrationChain.chainId
  */
  constructor(connectOptions) {
    const ConnectSDK = new FactomConnectSDK(connectOptions);
    this.chains = ConnectSDK.chains;
    this.entries = ConnectSDK.entries;
    this.identities = ConnectSDK.identities;
    this.anchors = ConnectSDK.anchors;
    this.receipts = ConnectSDK.receipts;
    this.apiInfo = ConnectSDK.apiInfo;
    let sdkOptions = {connect: ConnectSDK};
    if(connectOptions.registrationChainId !== undefined) {
      sdkOptions.registrationChainId = connectOptions.registrationChainId;
    }
    this.claim = new Claim(sdkOptions);
    this.credential = new Credential(sdkOptions);
    this.presentation = new Presentation(sdkOptions);
  }
}

module.exports = IntegrateSDK;