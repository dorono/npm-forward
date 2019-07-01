credentials <a name="credentials"></a>
-------

Associated W3C Verifiable Credential Data Model: [https://w3c.github.io/vc-data-model/#credentials](https://w3c.github.io/vc-data-model/#credentials)

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

Creates and returns an unsigned credential object.

**Sample**

Snippet
```JS
//...
let credentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
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
            <td align="left"><samp>issuer</samp></td>
            <td>required</td>
            <td>
                String<br/>
                The ID of the issuer of the VC
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>issuanceDate</samp></td>
            <td>required</td>
            <td>
                String<br/>
                The date of the credential was issued
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>credentialSubject</samp></td>
            <td>required</td>
            <td>
                Array of objects<br/>
                An array (or single object) representing the claims included within the credential.
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>id</samp></td>
            <td>optional</td>
            <td>
                String <br/>
                Unique identifier for the credential
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>expirationDate</samp></td>
            <td>optional</td>
            <td>
                String value of an [RFC3339] combined date and time string representing the date and time the credential ceases to be valid.<br/>
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
                The default value is: 'VerifiableCredential'
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="sign"></a> sign
Signs an existing credential object using the ed25519 signature algorithm.

**Sample**

Snippet
```JS
//...
let signedCredentialObj = credentialObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
})
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

credentialObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
})

// Chainable method

let signedCredentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
    expirationDate: '2021-04-09'
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
})
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
                The private key used to sign the credential.
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="register"></a> register
Registers (publishes) a credential object to a Factom chain through the Connect SDK. Please note that we are using a Promise pattern in the examples below, as registering a claim is an asyncronous operation.

**Sample**

Snippet
```JS
//...
let registeredCredentialObj = signedCredentialObj.register({
    destinationChainId: '3edbad62f9c1f3673a89dfea73af3e7ef710f02e69c2f21e860be05c9279fbb6',
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

credentialObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
})

credentialObj.register({
    destinationChainId: '3edbad62f9c1f3673a89dfea73af3e7ef710f02e69c2f21e860be05c9279fbb6',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
}).then(registeredCredential => console.log(registeredCredential));

// Chainable method

let registeredCredentialObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
    expirationDate: '2021-04-09'
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).register({
    destinationChainId: '3edbad62f9c1f3673a89dfea73af3e7ef710f02e69c2f21e860be05c9279fbb6',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
}).then(registeredCredential => console.log(registeredCredential));
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
                Default value is <samp>false</samp><br/>
                If true, will register claims, otherwise will register just the credential.
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left"><samp>hashOnly</samp></td>
            <td>optional</td>
            <td>
                Boolean <br/>
                Default value is <samp>true</samp><br/>
                If true, the hash of the credential will be published to the blockchain rather than a full plaintext representation.
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="addProof"></a> addProof
Adds a proof object to the proof array in an existing credential object.

If no proof object is provided but the credential has been registered, a [FactomProof](https://project.factom.com/contexts/factom-proof-v1#) will be constructed and added by default.

**Sample**
```JS
//...
// To automatically generate and add a Factom proof from a registered credential:
registeredCredentialObj.addProof();

// To add an existing proof object to a credential:
let credentialWithProofObj = registeredCredentialObj.addProof({
    "type": "RsaSignature2018",
    "created": "2018-09-14T21:19:10Z",
    "proofPurpose": "authentication",
    "verificationMethod": "did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#keys-1",
    "challenge": "1f44d55f-f161-4938-a659-f8026467f126",
    "domain": "4jt78h47fh47",
    "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..kTCYt5
      XsITJX1CxPCT8yAV-TVIw5WEuts01mq-pQy7UJiN5mgREEMGlv50aqzpqh4Qq_PbChOMqs
      LfRoPsnsgxD-WUcX16dUOqV0G_zS245-kronKb78cPktb3rk-BuQy72IFLN25DYuNzVBAh
      4vGHSrQyHUGlcTwLtjPAnKb78"
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

credentialObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
})

credentialObj.register({
    destinationChainId: '3edbad62f9c1f3673a89dfea73af3e7ef710f02e69c2f21e860be05c9279fbb6',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
});

// After the registration transaction(s) have confirmed:

credentialObj.addProof();

// Chainable method

let credentialWithProofObjAndSigned = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
    expirationDate: '2021-04-09'
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).addProof({
    "type": "CLSignature2019",
    "issuerData": "5NQ4TgzNfSQxoLzf2d5AV3JNiCdMaTgm...BXiX5UggB381QU7ZCgqWivUmy4D",
    "attributes": "pPYmqDvwwWBDPNykXVrBtKdsJDeZUGFA...tTERiLqsZ5oxCoCSodPQaggkDJy",
    "signature": "8eGWSiTiWtEA8WnBwX4T259STpxpRKuk...kpFnikqqSP3GMW7mVxC4chxFhVs",
    "signatureCorrectnessProof": "SNQbW3u1QV5q89qhxA1xyVqFa6jCrKwv...dsRypyuGGK3RhhBUvH1tPEL8orH"
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
                The proof object to add to the credential. <br/>
                (if no proof object is provided but the credential was previously registered, a factomProof-v1 proof will be generated from any confirmed entries and automatically appended)
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="verify"></a> verify
Verifies a signed credential object is structurally valid and signed properly

**Sample**

Snippet
```JS
//...
let credentialVerifyObj = registeredCredentialObj.verify({
    signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
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

credentialObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
})

credentialObj.verify({
    signerPublicKey:  'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
});

// Chainable method

let credentialVerifyObj = Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
    expirationDate: '2021-04-09'
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
Exports a credential object as raw JSON representation or directly to local filesystem.

**Sample**

Snippet
```JS
//...
const jsonCredentialData = signedCredentialObj.export();
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
});

const signedCredentialObj = credentialObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

const jsonCredentialData = signedCredentialObj.export({"type": "json"});

// Chainable method

Integrate.credential.create({
    issuer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    issuanceDate: '2000-04-21',
    credentialSubject: claimObj,
    expirationDate: '2021-04-09'
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).export({
    type: "file",
    fileName: "myCredentialData.json"
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
Imports a credential object from raw JSON representation or local filesystem.

**Sample**

Snippet
```JS
//...
const importedCredentialObj = Integrate.credential.import({"type": "file", "fileName": fileName});
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
});

const signedCredentialObj = credentialObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
})

signedCredentialObj.export({
    type: "file",
    fileName: "myCredentialData.json"
});

const importedCredentialObj = Integrate.credential.import({
    "type": "file",
    "fileName": "myCredentialData.json"
});

const verificationResult = importedCredentialObj.verify({
    signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
});

// Chainable method

const signedImportedCredential = Integrate.credential.import({
    type: "file",
    fileName: "myCredentialData.json"
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