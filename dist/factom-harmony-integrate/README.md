# INTEGRATE USER SDK

Table of Contents
===============
[INTRODUCTION](#Introduction)
- [About This Document](#about)
- [Harmony Integrate](#integrate)

[GETTING STARTED](#gettingstarted)
 - [System Requirements](#requirements)
 - [Installation](#installation)
 - [Usage](#usage)
 - [License](#license)

[METHODS](#methods)

<br>

<a name="Introduction"></a>INTRODUCTION
============

<a name="about"></a>About This Document
-------------------

This documentation is written for developers with a basic level of coding knowledge and familiarity of the JavaScript programming language.

Readers can find guidelines to quickly get started with building and using the JavaScript SDK for Factom Harmony Integrate.

<a name="integrate"></a>Harmony Integrate
-------------------
Harmony Integrate provides a blockchain-based interface for process mapping, digital identity metasystems, and portable proofs. This is achieved with:
- [Harmony Connect SDK](https://github.com/FactomProject/factom-harmony-integrate-js-sdk) for blockchain-related reads and writes
- Digital Identities - Compliant with [W3C Decentralized Identifiers (DIDs)](https://w3c-ccg.github.io/did-spec/)
- Attestations, Selective Disclosure, and Verification - Structured as [W3C Verifiable Credentials (VCs)](https://w3c.github.io/vc-data-model/)
<br>

<a name="gettingstarted"></a> GETTING STARTED
===============

This section contains a summary of the steps required to get started
with the SDK installation.

<a name="requirements"></a> System Requirements
-------------------

In order to use this JavaScript SDK, you will need the following tools:

-   NodeJS v8 or above: Please find the link
    [here](https://nodejs.org/en/). Current node LTS
    version is 10.15.0.

-   NPM: Node installation will include `Npm`, which is responsible for
    dependencies management. *(The Integrate SDK has not been added to the public NPM repository at this time, but will be shortly, but you'll need NPM to install the dependencies for the SDK itself.)*

<a name="installation"></a> Installation
-------------

**Node.js**

As mentioned in the previous section, in the absence of NPM installation, you can import the SDK into your project as follows:

1) create a directory in your project for this SDK and name it "lib" (or whatever you'd like to name it)
2) Download the files of this repo into your new folder, which you can do directly from github using the "Download ZIP" link as shown here: </br>![installation](documentation/assets/download-screencap.png?raw=true)
3) In the terminal, navigate into the root directory of the SDK files you just downloaded:<br>
`cd lib/factom-harmony-integrate-js-sdk`
4) Install the dependencies by running:<br>`npm install`.
5) Finally, in your project, any file where you'd like to include the SDK, you can import it like this, for example:<br>`const IntegrateSDK = require("./lib/factom-harmony-integrate-js-sdk/index");`

<a name="usage"></a> Usage
-------------

### Configuration

This SDK relies on
[Promises](https://developers.google.com/web/fundamentals/primers/promises)
making it easier to handle the asynchronous requests made to the API.

For more details of a specific module, please refer to the
[**Methods**](#methods) section.

First, you'll need to update the values in `src/configure.js`. The properties specified here will be used to authenticate your requests. These values are specific to your Harmony application which can be created and managed at https://account.factom.com.

```js
const configure = {
    baseUrl: 'YOUR_API_URL',
    accessToken: {
        appId: 'YOUR_APP_ID',
        appKey: 'YOUR_APP_KEY',
    }
};
```

### Instantiation

Before executing any requests, you will need to instantiate an instance of the SDK.

```js
// Import the configuration and the SDK (without NPM, which will be supported shortly):
const IntegrateSDK = require('./your-sdk-index-path');
const configure = require('./your-config-path');

// Instantiate the SDK Class:
const Integrate = new IntegrateSDK(configure);

// Execute an Integrate SDK Method
const result = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Lukas Murray'
});
```

### Testing

Unit tests can be run with the command `npm test`

In order to do so, ensure that you have included the following properties in `src/configure.js`: `identityChainId`, `privateKey`, `publicKey`.

<a name="license"></a> License
-------

Harmony Integrate is closed sourced and available by purchase. [Click here](LICENSE) for license details.

<br>

<a name="methods"></a> METHODS
===============

<a name="claims"></a>[claims](documentation/claims.md)
 - <a name="create"></a>[create](documentation/claims.md#create)
 - <a name="sign"></a>[sign](documentation/claims.md#sign)
 - <a name="register"></a>[register](documentation/claims.md#register)
 - <a name="verify"></a>[verify](documentation/claims.md#verify)
 - <a name="export"></a>[export](documentation/claims.md#export)
 - <a name="import"></a>[import](documentation/claims.md#import)

<a name="credentials"></a>[credentials](documentation/credentials.md)
 - <a name="create"></a>[create](documentation/credentials.md#create)
 - <a name="sign"></a>[sign](documentation/credentials.md#sign)
 - <a name="register"></a>[register](documentation/credentials.md#register)
 - <a name="addProof"></a>[addProof](documentation/credentials.md#addProof)
 - <a name="verify"></a>[verify](documentation/credentials.md#verify)
 - <a name="export"></a>[export](documentation/credentials.md#export)
 - <a name="import"></a>[import](documentation/credentials.md#import)

<a name="presentations"></a>[presentations](documentation/presentations.md)
 - <a name="create"></a>[create](documentation/presentations.md#create)
 - <a name="sign"></a>[sign](documentation/presentations.md#sign)
 - <a name="register"></a>[register](documentation/presentations.md#register)
 - <a name="addProof"></a>[addProof](documentation/presentations.md#addProof)
 - <a name="verify"></a>[verify](documentation/presentations.md#verify)
 - <a name="export"></a>[export](documentation/presentations.md#export)
 - <a name="import"></a>[import](documentation/presentations.md#import)

The documentation for the following methods are available in the Harmony Connect SDK repository.

<a name="identities"></a>[identities](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/identities.md)
  - <a name="identitiesCreate"></a>[create](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/identities.md#identitiesCreate)
  - <a name="identitiesGet"></a>[get](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/identities.md#identitiesGet)
  - <a name="identitiesKeys"></a>[keys](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/identities.md#identitiesKeys)
     - <a name="keysList"></a>[list](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/identities.md#keysList)
     - <a name="keysGet"></a>[get](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/identities.md#keysGet)
     - <a name="keysReplace"></a>[replace](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/identities.md#keysReplace)

<a name="chains"></a>[chains](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md)
  - <a name="chainsGet"></a>[get](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#chainsGet)
  - <a name="chainsCreate"></a>[create](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#chainsCreate)
  - <a name="chainsList"></a>[list](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#chainsList)
  - <a name="chainsSearch"></a>[search](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#chainsSearch)
  - <a name="chainsEntries"></a>[entries](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#chainsEntries)
     - <a name="entriesGet"></a>[get](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#entriesGet)
     - <a name="entriesCreate"></a>[create](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#entriesCreate)
     - <a name="entriesList"></a>[list](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#entriesList)
     - <a name="entriesFirst"></a>[getFirst](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#entriesFirst)
     - <a name="entriesLast"></a>[getLast](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#entriesLast)
     - <a name="entriesSearch"></a>[search](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/chains.md#entriesSearch)

<a name="anchors"></a>[anchors](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/anchors.md)
  - <a name="getAnchors"></a>[get](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/anchors.md#getAnchors)

<a name="receipts"></a>[receipts](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/receipts.md)
  - <a name="getReceipts"></a>[get](https://github.com/FactomProject/factom-harmony-connect-js-sdk/blob/master/documentation/receipts.md#getReceipts)