presentations <a name="presentations"></a>
-------

Associated W3C Verifiable Credential Data Model: [https://w3c.github.io/vc-data-model/#presentations](https://w3c.github.io/vc-data-model/#presentations)

### Table of Contents
- [create](#create)
- [sign](#sign)
- [register](#register)
- [addProof](#addProof)
- [verify](#verify)
- [export](#export)
- [import](#import)

<br/>

### <a name="create"></a> create

Creates and returns a presentation object.

**Sample**

Snippet
```JS
//...
let presentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
});
```

<details><summary>Complete Sample (click here)</summary>
<p>

```JS
const IntegrateSDK = require('./your-sdk-index-path');
const configure = require('./your-config-path');

const Integrate = new IntegrateSDK(configure);

let claimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
});

let credentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
});

let presentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
});
```

</p>
</details>

**Properties**

<table width="100%">
    <thead>
        <tr>
            <th width="15%">Name</th>
            <th width="15%">Type</th>
            <th width="40%">Description</th>
            <th width="30%">SDK Error Message & Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="left"><samp>verifiableCredential</samp></td>
            <td>required</td>
            <td>
                Array of objects <br/>
                An array (or single object) representing the credentials included within the presentation
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>id</samp></td>
            <td>optional</td>
            <td>
                String <br/>
                Unique identifier for the presentation
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>@context</samp></td>
            <td>optional</td>
            <td>
                String or Array of Strings <br/>
                An array representing the credential's context(s)
                The default value is: 'https://www.w3.org/2018/credentials/v1'
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>type</samp></td>
            <td>optional</td>
            <td>
                String or Array of Strings <br/>
                An array representing the credential's type(s)
                The default value is: 'VerifiablePresentation'
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="sign"></a> sign
Signs an existing presentation object using the ed25519 signature algorithm.

**Sample**

Snippet
```JS
//...
let signedPresentationObj = presentationObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsecexampleprivatekey'
});
```

<details><summary>Complete Sample (click here)</summary>
<p>

```JS
const IntegrateSDK = require('./your-sdk-index-path');
const configure = require('./your-config-path');

const Integrate = new IntegrateSDK(configure);

let claimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
});

let credentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
});

let presentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
});

presentationObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

// Chainable method

let signedPresentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});
```

</p>
</details>

**Properties**

<table width="100%">
    <thead>
        <tr>
            <th width="15%">Name</th>
            <th width="15%">Type</th>
            <th width="40%">Description</th>
            <th width="30%">SDK Error Message & Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="left"><samp>signer</samp></td>
            <td>required</td>
            <td>
                String <br/>
                The id of the signer/issuer, including a reference to the relevant public key.
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>signerPrivateKey</samp></td>
            <td>optional</td>
            <td>
                String <br/>
                The private key used to sign the presentation.
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="register"></a> register
Registers (publishes) a presentation object to a Factom chain through the Connect SDK. Please note that we are using a Promise pattern in the examples below, as registering a claim is an asyncronous operation.

**Sample**

Snippet
```JS
//...
let registeredPresentationObj = signedPresentationObj.register({
    destinationChainId: '534d1e38c3c855e8a068119a154773ece5b8d5af2f02a0052f354e64e9528631',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
}).then(response => console.log(response));
```

<details><summary>Complete Sample (click here)</summary>
<p>

```JS
const IntegrateSDK = require('./your-sdk-index-path');
const configure = require('./your-config-path');

const Integrate = new IntegrateSDK(configure);

let claimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
});

let credentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
});

let presentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
});

presentationObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

presentationObj.register({
    destinationChainId: '534d1e38c3c855e8a068119a154773ece5b8d5af2f02a0052f354e64e9528631',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
}).then(registeredPresentation => console.log(registeredPresentation));

// Chainable method

let registeredPresentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).register({
    destinationChainId: '3edbad62f9c1f3673a89dfea73af3e7ef710f02e69c2f21e860be05c9279fbb6',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
}).then(registeredPresentation => console.log(registeredPresentation));
```

</p>
</details>

**Properties**

<table width="100%">
    <thead>
        <tr>
            <th width="15%">Name</th>
            <th width="15%">Type</th>
            <th width="40%">Description</th>
            <th width="30%">SDK Error Message & Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="left"><samp>hashOnly</samp></td>
            <td>required</td>
            <td>
                Boolean <br/>
                Default value is <samp>true</samp> <br/>
                If true, the hash of the credential will be published to the blockchain rather than a full plaintext representation.
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>destinationChainId</samp></td>
            <td>required</td>
            <td>
                String <br/>
                The Factom chain to make the entry into.
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>signerPrivateKey</samp></td>
            <td>required</td>
            <td>
                String <br/>
                The private key to sign the Factom entry with.
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>signerChainId</samp></td>
            <td>required</td>
            <td>
                String <br/>
                The Factom identity chain ID which is the signatory of the entry.
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>recursive</samp></td>
            <td>optional</td>
            <td>
                Boolean <br/>
                Default value is <samp>false</samp> <br/>
                If true, will register credentials, otherwise will register just the presentation.
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="addProof"></a> addProof
Adds a proof object to the proof array in an existing presentation object.

If no proof object is provided but the presentation has been registered, a [FactomProof](https://project.factom.com/contexts/factom-proof-v1#) will be constructed and added by default.

**Sample**

Snippet
```JS
//...
// To automatically generate and add a Factom proof from a registered presentation:
registeredPresentationObj.addProof();

// To add an existing proof object to a presentation:
let presentationWithRSAProof = registeredPresentationObj.addProof({
    "type": "RsaSignature2018",
    "created": "2018-06-18T21:19:10Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "https://example.com/jdoe/keys/1",
    "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19
      ZhDJBMvvFAIC00nSGB6Tn0XKbbF9XrsaJZREWvR2aONYTQQxnyXirtXnlewJMB
      Bn2h9hfcGZrvnC1b6PgWmukzFJ1IiH1dWgnDIS81BH-IxXnPkbuYDeySorc4
      QU9MJxdVkY5EL4HYbcIfwKj6X4LBQ2_ZHZIu1jdqLcRZqHcsDF5KKylKc1TH
      n5VRWy5WhYg_gBnyWny8E6Qkrze53MR7OuAmmNJ1m1nN8SxDrG6a08L78J0-
      Fbas5OjAQz3c17GY8mVuDPOBIOVjMEghBlgl3nOi1ysxbRGhHLEK4s0KKbeR
      ogZdgt1DkQxDFxxn41QWDw_mmMCjs9qxg0zcZzqEJw"
  });
```

<details><summary>Complete Sample (click here)</summary>
<p>

```JS
const IntegrateSDK = require('./your-sdk-index-path');
const configure = require('./your-config-path');

const Integrate = new IntegrateSDK(configure);

let claimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
});

let credentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
});

let presentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
});

presentationObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsecexampleprivatekey'
});

presentationObj.register({
    destinationChainId: '3edbad62f9c1f3673a89dfea73af3e7ef710f02e69c2f21e860be05c9279fbb6',
    signerPrivateKey: 'idsecexampleprivatekey',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
});

// After the registration transaction(s) have confirmed:

registeredPresentationObj.addProof();

// Chainable method

let presentationWithProofObj = Integrate.presentation.create({
    verifiableCredential: credentialObj
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).addProof({
    "type": "RsaSignature2018",
    "created": "2017-06-18T21:19:10Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "https://example.edu/issuers/keys/1",
    "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCYt5X
      sITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUc
      X16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtj
      PAYuNzVBAh4vGHSrQyHUdBBPM"
});
```

</p>
</details>

**Properties**

<table width="100%">
    <thead>
        <tr>
            <th width="15%">Name</th>
            <th width="15%">Type</th>
            <th width="40%">Description</th>
            <th width="30%">SDK Error Message & Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="left"><samp>proof</samp></td>
            <td>optional</td>
            <td>
                Object <br/>
                The proof object to add to the presentation. <br/>
                (if no proof object is provided but the presentation was previously registered, a factomProof-v1 proof will be generated from any confirmed entries and automatically appended)
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="verify"></a> verify
Verifies a signed presentation object is structurally valid and signed properly

**Sample**

Snippet
```JS
//...

let presentationVerifyObj = registeredPresentationObj.verify({
    signerPublicKey: 'idpubexamplekey'
});
```

<details><summary>Complete Sample (click here)</summary>
<p>

```JS
const IntegrateSDK = require('./your-sdk-index-path');
const configure = require('./your-config-path');

const Integrate = new IntegrateSDK(configure);

let claimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
});

let credentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
    expirationDate: '2021-04-09'
});

let presentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
});

presentationObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

presentationObj.verify({
    signerPublicKey:  'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
});

// Chainable method

let presentationVerifyObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).verify({
    signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
});
```

</p>
</details>

**Properties**

<table width="100%">
    <thead>
        <tr>
            <th width="15%">Name</th>
            <th width="15%">Type</th>
            <th width="40%">Description</th>
            <th width="30%">SDK Error Message & Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="left"><samp>signerPublicKey</samp></td>
            <td>required</td>
            <td>
                String <br/>
                The public key being used to validate signature(s) with.
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>customVerificationMethod</samp></td>
            <td>optional</td>
            <td>
                Function <br/>
                An optional custom, user-defined verification method.
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="export"></a> export
Exports a presentation object as raw JSON representation or directly to local filesystem.

**Sample**

Snippet
```JS
//...
const jsonPresentationData = signedPresentationObj.export();
```

<details><summary>Complete Sample (click here)</summary>
<p>

```JS
const IntegrateSDK = require('./your-sdk-index-path');
const configure = require('./your-config-path');

const Integrate = new IntegrateSDK(configure);

const claimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
});

const credentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
    expirationDate: '2021-04-09'
});

const presentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
});

const signedPresentationObj = presentationObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

const jsonPresentationData = signedPresentationObj.export({"type": "json"});

// Chainable method

Integrate.presentation.create({
    verifiableCredential: credentialObj,
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).export({
    type: "file",
    fileName: "myPresentationData.json"
});
```

</p>
</details>

**Properties**

<table width="100%">
    <thead>
        <tr>
            <th width="15%">Name</th>
            <th width="15%">Type</th>
            <th width="40%">Description</th>
            <th width="30%">SDK Error Message & Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="left"><samp>type</samp></td>
            <td>optional</td>
            <td>
                String <br/>
                The export type. Valid values: "file", "json"
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>fileName</samp></td>
            <td>optional</td>
            <td>
                String <br/>
                The path/name of the local file being exported to.
                Required if type is "file".
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="import"></a> import
Imports a presentation object from raw JSON representation or local filesystem.

**Sample**

Snippet
```JS
//...
const importedPresentationObject = Integrate.presentation.import({"type": "file", "fileName": fileName});
```

<details><summary>Complete Sample (click here)</summary>
<p>

```JS
const IntegrateSDK = require('./your-sdk-index-path');
const configure = require('./your-config-path');

const Integrate = new IntegrateSDK(configure);

const claimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
});

const credentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
    expirationDate: '2021-04-09'
});

const presentationObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
});

const signedPresentationObj = presentationObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

signedPresentationObj.export({
    type: "file",
    fileName: "myPresentationData.json"
});

const importedPresentationObj = Integrate.credential.import({
    "type": "file",
    "fileName": "myPresentationData.json"
});

const verificationResult = importedPresentationObj.verify({
    signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
});

// Chainable method

const signedImportedPresentation = Integrate.presentation.import({
    type: "file",
    fileName: "myPresentationData.json"
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});
```

</p>
</details>

**Properties**

<table width="100%">
    <thead>
        <tr>
            <th width="15%">Name</th>
            <th width="15%">Type</th>
            <th width="40%">Description</th>
            <th width="30%">SDK Error Message & Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="left"><samp>type</samp></td>
            <td>optional</td>
            <td>
                String <br/>
                The import type. Valid values: "file", "json"
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>fileName</samp></td>
            <td>optional</td>
            <td>
                String <br/>
                The path/name of the local file being imported from.
                Required if type is "file".
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>