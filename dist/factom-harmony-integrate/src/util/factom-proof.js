const sha256 = require('js-sha256');
const sha512 = require('js-sha512');
const axios = require('axios');
const has = require('lodash.has');

function hexToByte(str) {
  let a = [];
  for (let i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }
  
  return new Uint8Array(a);
}

const createProof = (receipt, anchor, identity) => {
  let proofObject = {
    "@context": "https://project.factom.com/contexts/factom-proof-v1.jsonld",
    "type": "factomProof-v1",
    "receipt": receipt,
    "anchor": anchor,
    "identity": identity
  };

  if (typeof(receipt) === undefined || receipt.length < 1) delete proofObject.receipt;
  if (typeof(anchor) === undefined || anchor.length < 1) delete proofObject.anchor;
  if (typeof(identity) === undefined || identity.length < 1) delete proofObject.identity;

  return proofObject;
}

const validateReceipt = (receiptData) => {
  if ( !hasAllReceiptFields(receiptData) ) return false;
  
  /* https://github.com/FactomProject/FactomDocs/blob/master/factomDataStructureDetails.md#entry-hash
   * To calculate the Entry Hash, first the Entry is serialized and passed into a SHA512 function. 
   * The 64 bytes output from the SHA512 function is prepended to the serialized Entry. 
   * The Entry+prependage are then fed through a SHA256 function, and the output of that is the Entry Hash.
  */
  let computedEntryHash = sha256(hexToByte(sha512(hexToByte(receiptData.entrySerialized)) + receiptData.entrySerialized));

  // Compare self-computed hash to entryHash in receiptData object.
  if ( computedEntryHash !== receiptData.entryHash ) return false;

  // receiptData.merkleBranch must be an array, and must have at least 2 leaves to be valid
  if ( !(Array.isArray(receiptData.merkleBranch)) || receiptData.merkleBranch.length < 2 ) return false;

  let next_object_must_include;
  let found_eblock_keymr = false;
  // Perform merkle tree calculations and comparisons
  for (merkleIndex in receiptData.merkleBranch) {
    let merkleObject = receiptData.merkleBranch[merkleIndex];
    if ( !hasAllMerkleLeafFields(merkleObject) ) return false;
    // Check that the merkle leaves (left and right) hash together into the intermediate merkle value (top)
    if ( merkleObject.top !== sha256(hexToByte(merkleObject.left + merkleObject.right))) return false;

    if (merkleIndex == 0) {
      // The receipt must have the entryHash in either the 'left' or the 'right' slot in the first merkle entry
      if ( receiptData.entryHash !== merkleObject.left && receiptData.entryHash !== merkleObject.right ) return false;
    } else {
      // Check to see if the 'top' value from the last round is present as a leaf (left/right) value in this round
      if ( next_object_must_include !== merkleObject.left && next_object_must_include !== merkleObject.right ) return false;
      if (merkleIndex == receiptData.merkleBranch.length-1) {
        // The receipt must have the dblock keyMR in the 'top' slot in the last merkle entry
        if ( receiptData.dblock.keymr !== merkleObject.top ) return false;
      }
    }

    // The eblock keymr must be a top node in the merkleBranch object
    if (merkleObject.top === receiptData.eblock.keymr) found_eblock_keymr = true;

    next_object_must_include = merkleObject.top;
  }
  
  return found_eblock_keymr;
}

const hasAllReceiptFields = (receiptData) => {
  // Ensure that dblock exists and has all necessary sub-fields populated
  if (
    !receiptData.dblock || receiptData.dblock === undefined
    || !receiptData.dblock.keymr || receiptData.dblock.keymr === undefined || receiptData.dblock.keymr.length !== 64
    || !receiptData.dblock.height || receiptData.dblock.height === undefined
    || !receiptData.eblock || receiptData.eblock === undefined
    || !receiptData.eblock.keymr || receiptData.eblock.keymr === undefined || receiptData.eblock.keymr.length !== 64
    || !receiptData.createdAt || receiptData.createdAt === undefined
    || !receiptData.chain || receiptData.chain === undefined
    || !receiptData.merkleBranch || receiptData.merkleBranch === undefined
    || !receiptData.entryHash || receiptData.entryHash === undefined || receiptData.entryHash.length !== 64
    || !receiptData.entrySerialized || receiptData.entrySerialized === undefined 
  ) return false;
  return true;
}

const hasAllMerkleLeafFields = (merkleObject) => {
  // Ensure that merkle leaf has all necessary sub-fields populated
  if (
    !merkleObject.top || merkleObject.top === undefined || merkleObject.top.length !== 64
    || !merkleObject.left || merkleObject.left === undefined || merkleObject.left.length !== 64
    || !merkleObject.right || merkleObject.right === undefined || merkleObject.right.length !== 64
  ) return false;
  return true;
}

const validateFactomAnchor = (anchorData) => {
  if ( !hasAllFactomAnchorFields(anchorData) ) return false;
  
  /* https://github.com/FactomProject/FactomDocs/blob/master/factomDataStructureDetails.md#entry-hash
   * To calculate the Entry Hash, first the Entry is serialized and passed into a SHA512 function. 
   * The 64 bytes output from the SHA512 function is prepended to the serialized Entry. 
   * The Entry+prependage are then fed through a SHA256 function, and the output of that is the Entry Hash.
  */
  let computedEntryHash = sha256(hexToByte(sha512(hexToByte(anchorData.entrySerialized)) + anchorData.entrySerialized));

  // Compare self-computed hash to entryHash in anchorData object.
  if ( computedEntryHash !== anchorData.entryHash ) return false;

  // anchorData.merkleBranch must be an array, and must have at least 2 leaves to be valid
  if ( !(Array.isArray(anchorData.merkleBranch)) || anchorData.merkleBranch.length < 2 ) return false;

  let next_object_must_include;
  // Perform merkle tree calculations and comparisons
  for (merkleIndex in anchorData.merkleBranch) {
    let merkleObject = anchorData.merkleBranch[merkleIndex];
    if ( !hasAllMerkleLeafFields(merkleObject) ) return false;
    // Check that the merkle leaves (left and right) hash together into the intermediate merkle value (top)
    if ( merkleObject.top !== sha256(hexToByte(merkleObject.left + merkleObject.right))) return false;

    if (merkleIndex == 0) {
      // The receipt must have the entryHash in either the 'left' or the 'right' slot in the first merkle entry
      if ( anchorData.entryHash !== merkleObject.left && anchorData.entryHash !== merkleObject.right ) return false;
    } else {
      // Check to see if the 'top' value from the last round is present as a leaf (left/right) value in this round
      if ( next_object_must_include !== merkleObject.left && next_object_must_include !== merkleObject.right ) return false;
      if (merkleIndex == anchorData.merkleBranch.length-1) {
        // The receipt must have the dblock keyMR in the 'top' slot in the last merkle entry
        if ( anchorData.dblock.keymr !== merkleObject.top ) return false;
      }
    }

    next_object_must_include = merkleObject.top;
  }

  return true;
}

const validateBitcoinAnchor = (anchorData) => {
  if ( !hasAllBitcoinAnchorFields(anchorData) ) return false;
  
  // TODO: fully validate Bitcoin anchor information and network confirmation status (possibly with a third-party library)
  if ( anchorData.status !== "confirmed" ) return false;

  return true;
}

const validateEthereumAnchor = (dblockData, anchorData) => {
  if ( !hasAllEthereumAnchorFields(anchorData) ) return false;
  if ( !dblockData.keymr || dblockData.keymr === undefined ) return false;

  // anchorData.merkleBranch must be an array, and must have at least 2 leaves to be valid
  if ( !(Array.isArray(anchorData.merkleBranch)) || anchorData.merkleBranch.length < 2 ) return false;

  let next_object_must_include;
  // Perform merkle tree calculations and comparisons
  for (merkleIndex in anchorData.merkleBranch) {
    let merkleObject = anchorData.merkleBranch[merkleIndex];
    if ( !hasAllMerkleLeafFields(merkleObject) ) return false;
    // Check that the merkle leaves (left and right) hash together into the intermediate merkle value (top)
    if ( merkleObject.top !== sha256(hexToByte(merkleObject.left + merkleObject.right))) return false;

    if (merkleIndex == 0) {
      // The anchor must have the entryHash in either the 'left' or the 'right' slot in the first merkle entry
      if ( dblockData.keymr !== merkleObject.left && dblockData.keymr !== merkleObject.right ) return false;
    } else {
      // Check to see if the 'top' value from the last round is present as a leaf (left/right) value in this round
      if ( next_object_must_include !== merkleObject.left && next_object_must_include !== merkleObject.right ) return false;
      if (merkleIndex == anchorData.merkleBranch.length-1) {
        // The anchor must have the windowMr value in the 'top' slot in the last merkle entry
        if ( anchorData.windowMr !== merkleObject.top ) return false;
      }
    }

    next_object_must_include = merkleObject.top;
  }

  // TODO: fully validate Ethereum anchor information is confirmed on network (possibly with a third-party library)
  if ( anchorData.status !== "confirmed" ) return false;
  return true;
}

const hasAllFactomAnchorFields = (anchorData) => {
  // Ensure that dblock exists and has all necessary sub-fields populated
  if (
    !anchorData.dblock || anchorData.dblock === undefined
    || !anchorData.dblock.keymr || anchorData.dblock.keymr === undefined || anchorData.dblock.keymr.length !== 64
    || !anchorData.dblock.height || anchorData.dblock.height === undefined
    || !anchorData.network || anchorData.network === undefined
    || anchorData.network !== "factom"
    || !anchorData.createdAt || anchorData.createdAt === undefined
    || !anchorData.merkleBranch || anchorData.merkleBranch === undefined
    || !anchorData.entryHash || anchorData.entryHash === undefined || anchorData.entryHash.length !== 64
    || !anchorData.entrySerialized || anchorData.entrySerialized === undefined
  ) return false;
  return true;
}

const hasAllBitcoinAnchorFields = (anchorData) => {
  // Ensure that bitcoin anchor data exists
  if (
    !anchorData.network || anchorData.network === undefined
    || anchorData.network !== "bitcoin"
    || !anchorData.status || anchorData.status === undefined
    || !anchorData.txId || anchorData.txId === undefined
    || !anchorData.blockHash || anchorData.blockHash === undefined
    || anchorData.blockHash.length !== 64
  ) return false;
  return true;
}

const hasAllEthereumAnchorFields = (anchorData) => {
  // Ensure that ethereum anchor data exists
  if (
    !anchorData.network || anchorData.network === undefined
    || anchorData.network !== "ethereum"
    || !anchorData.status || anchorData.status === undefined
    || !anchorData.windowEndHeight || anchorData.windowEndHeight === undefined
    || !anchorData.windowStartHeight || anchorData.windowStartHeight === undefined
    || !anchorData.windowMr || anchorData.windowMr === undefined
    || !anchorData.contractAddress || anchorData.contractAddress === undefined
    || !anchorData.txId || anchorData.txId === undefined
    || !anchorData.blockHash || anchorData.blockHash === undefined
    || !anchorData.txIndex || anchorData.txIndex === undefined
    || !anchorData.merkleBranch || anchorData.merkleBranch === undefined
  ) return false;
  return true;
}

const verifyFactomProofV1 = (factomProof) => {
  let factomProofStructure = false;
  let receiptValid = false;
  let anchorsValid = false;
  let hasAnchor = false;
  let hasReceipt = false;

  if ( factomProof.type && factomProof.type !== undefined && factomProof.type === "factomProof-v1") factomProofStructure = true;
  validityObject = {"type": "factomProof-v1", "format": factomProofStructure};

  if ( has(factomProof, "receipt") && factomProof.receipt !== undefined ) {
    hasReceipt = true;
    receiptValid = true;
    if ( Array.isArray(factomProof.receipt) ) {
      for (receiptIndex in factomProof.receipt) {
        // *All* included receipt data must be valid for the ReceiptValid property to be true.
        if ( !validateReceipt(factomProof.receipt[receiptIndex]) ) {
          receiptValid = false;
          break;
        }
      }
    } else {
      receiptValid = validateReceipt(factomProof.receipt);
    }
  }

  if ( has(factomProof, "anchor") && factomProof.anchor !== undefined ) {
    hasAnchor = true;
    anchorsValid = true;
    if ( Array.isArray(factomProof.anchor) ) {
      outerAnchorLoop: 
        for (let anchorResponse of factomProof.anchor) {
          if ( !anchorResponse.dblock || anchorResponse.dblock === undefined || !anchorResponse.anchors || anchorResponse.anchors === undefined ) {
            anchorsValid = false;
            break outerAnchorLoop;
          }

          if ( Array.isArray(anchorResponse.anchors) ) {
            // *All* included anchor data must be valid for the AnchorsValid property to be true.
            for (anchorDataIndex in anchorResponse.anchors) {
              let anchorData = anchorResponse.anchors[anchorDataIndex];
              // The anchor must be either a valid Factom anchor, a valid Bitcoin anchor, or a valid Ethereum anchor
              if ( !validateFactomAnchor(anchorData) && !validateBitcoinAnchor(anchorData) && !validateEthereumAnchor(anchorResponse.dblock, anchorData) ) {
                anchorsValid = false;
                break outerAnchorLoop;
              }
            }
          } else {
            let anchorData = anchorResponse.anchors;
            if ( !validateFactomAnchor(anchorData) && !validateBitcoinAnchor(anchorData) && !validateEthereumAnchor(anchorResponse.dblock, anchorData) ) {
              anchorsValid = false;
              break outerAnchorLoop;
            }
          }
        }
    } else {
      if ( !factomProof.anchor.dblock || factomProof.anchor.dblock === undefined || !factomProof.anchor.anchors || factomProof.anchor.anchors === undefined ) {
        anchorsValid = false;
      }
    }
  }

  let fullyValid = factomProofStructure;
  if(hasReceipt) {
    validityObject["receipt"] = {"valid": receiptValid};
    fullyValid = fullyValid && receiptValid;
  }
  if(hasAnchor) {
    validityObject["anchor"] = {"valid": anchorsValid};
    fullyValid = fullyValid && anchorsValid;
  }
  validityObject["valid"] = fullyValid;
  return validityObject;
}

const getDID = async (didString, csdk) => {
  const headers = {
      'app_id': csdk.options.accessToken.appId,
      'app_key': csdk.options.accessToken.appKey
  }

  let baseUrl = csdk.options.baseUrl;
  const didResponse = await axios({
      method: 'get',
      url: baseUrl+"/dids/"+didString,
      headers: headers
    });

  return didResponse.data;
}

module.exports = {createProof, validateReceipt, validateFactomAnchor, validateBitcoinAnchor, validateEthereumAnchor, getDID, verifyFactomProofV1};