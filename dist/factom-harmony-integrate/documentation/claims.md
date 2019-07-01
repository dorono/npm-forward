claims <a name="claims"></a>
-------

Associated W3C Verifiable Credential Data Model: [https://w3c.github.io/vc-data-model/#claims](https://w3c.github.io/vc-data-model/#claims)

### Table of Contents
- [create](#create)
- [sign](#sign)
- [register](#register)
- [verify](#verify)
- [export](#export)
- [import](#import)

<br/>

### <a name="create"></a> create

**Sample**

Snippet
```JS
//...
let claimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
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
            <td align="left"><samp>id</samp></td>
            <td>required</td>
            <td>
                Object <br/>
                Unique identifier for the claim
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left">(Set a custom property to add relevant data to the claim.)</td>
            <td>required</td>
            <td>
                string|bool|number|array|object|null <br/>
                Any data you'd like to add (such as, in the example above, a <samp>FullName</samp> property set to "Bob Smith").
            </td>
            <td><em>Pending</em></td>
        </tr>
        <tr>
            <td align="left">(Additional custom property)</td>
            <td>optional</td>
            <td>
                string|bool|number|array|object|null <br/>
                Same as the required custom property listed here in the row above this one. <em>You may add as many of these as you need to in order to populate your claim with the necessary information.</em>
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="sign"></a> sign
Signs an existing claim object using the ed25519 signature algorithm.

**Sample**

Snippet
```JS
//...
claimObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
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
})

claimObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

// Chainable method

let signedClaimObj = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
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
            <td>required</td>
            <td>
                String <br/>
                The private key used to sign the claim.
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="register"></a> register
Registers (publishes) a claim object to a Factom chain through the Connect SDK. Please note that we are using a Promise pattern in the examples below, as registering a claim is an asyncronous operation.

**Sample**

Snippet
```JS
//...
let registeredClaimObj = signedClaimObj.register({
    destinationChainId: '534d1e38c3c855e8a068119a154773ece5b8d5af2f02a0052f354e64e9528631',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
})
.then(response => console.log(response));
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
})

claimObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

claimObj.register({
    destinationChainId: '3edbad62f9c1f3673a89dfea73af3e7ef710f02e69c2f21e860be05c9279fbb6',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
})
.then(response => console.log(response));

// Chainable method
let registeredClaimObject = Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).register({
    destinationChainId: '3edbad62f9c1f3673a89dfea73af3e7ef710f02e69c2f21e860be05c9279fbb6',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6',
    signerChainId: '2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79'
})
.then(registeredClaim => console.log(registeredClaim));
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
            <td align="left"><samp>hashOnly</samp></td>
            <td>optional</td>
            <td>
                Boolean <br/>
                Default value is <samp>true</samp><br/>
                If true, the hash of the claim will be published to the blockchain rather than a full plaintext representation.
            </td>
            <td><em>Pending</em></td>
        </tr>
    </tbody>
</table>

<br/>
<br/>

### <a name="verify"></a> verify
Verifies a signed claim object is structurally valid and signed properly

**Sample**

Snippet
```JS
//...
let claimVerifyObj = registeredClaimObj.verify({
    signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
})
.then(response => console.log(response));
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
})

claimObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

claimObj.verify({
    signerPublicKey:  'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
});

// Chainable method

let presentationVerifyObj = Integrate.presentation.create({
    verifiableCredential: credentialObj,
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).verify({
    signerPublicKey:  'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
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
Exports a claim object as raw JSON representation or directly to local filesystem.

**Sample**

Snippet
```JS
//...
const jsonClaimData = signedClaimObj.export();
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
})

const signedClaimObj = claimObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

const jsonClaimData = signedClaimObj.export({"type": "json"});

// Chainable method

Integrate.claim.create({
    id: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79',
    FullName: 'Bob Smith'
}).sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
}).export({
    type: "file",
    fileName: "myClaimData.json"
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
Imports a claim object from raw JSON representation or local filesystem.

**Sample**

Snippet
```JS
//...
const importedClaimObj = Integrate.claim.import({"type": "file", "fileName": fileName});
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
})

const signedClaimObj = claimObj.sign({
    signer: 'did:factom:2a779d41a2bb745b3050bd4d7f63ec2be050941dace52cad19036d9684afee79#key-1',
    signerPrivateKey: 'idsec32vrpyBYP12MpVtrhyEgX5dqZLD4hKhorHJjs2T9qY9vWntmB6'
});

signedClaimObj.export({
    type: "file",
    fileName: "myClaimData.json"
});

const importedClaimObj = Integrate.claim.import({
    "type": "file",
    "fileName": "myClaimData.json"
});

const verificationResult = importedClaimObj.verify({
    signerPublicKey: 'idpub2nJz8MYB2gSWUCpSH6rJdnMoJxUsWd8q8hMrhLQztJvGFjoyTR'
});

// Chainable method

const signedImportedClaim = Integrate.claim.import({
    type: "file",
    fileName: "myClaimData.json"
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