const elliptic = require('elliptic');
const base58 = require('base-58');
const EdDSA = elliptic.eddsa;
const ec = new EdDSA('ed25519');
const sha256 = require('js-sha256');
const canonicalize = require("canonical-json");
const clonedeep = require('lodash.clonedeep');

/*
 * This is basically just the KeyCommon functionality extracted from the factom-harmony-connect-js-sdk
 * Signature creation/validation utilities
*/

const constants = {
    UTF8_ENCODE: 'utf-8',
    BASE64_ENCODE: 'base64'
};

const toConsumableArray = arr => {
    return (0, Array.from)(arr);
}

const validateCheckSum = signerKey => {
    const signerKeyBytes = base58.decode(signerKey);
    if (signerKeyBytes.length !== 41) {
      return false;
    }

    const prefixBytes = signerKeyBytes.slice(0, 5);
    const keyBytes = signerKeyBytes.slice(5, 37);
    const checkSum = signerKeyBytes.slice(37, 41);

    const tmp = sha256.digest(sha256.digest([].concat(toConsumableArray(prefixBytes), toConsumableArray(keyBytes))));
    const tmpCheckSum = tmp.slice(0, 4);

    if (Buffer.compare(Buffer.from(checkSum), Buffer.from(tmpCheckSum)) !== 0) {
      return false;
    }

    return true;
}

const getKeyBytesFromKey = signerKey => {
    const signerKeyBytes = base58.decode(signerKey);
    return signerKeyBytes.slice(5, 37);
}

const signContent = (creatorId, signerPrivateKey, messageToSign, signingAlgorithm) => {
    if (!signerPrivateKey) {
        throw new Error('signerPrivateKey is required');
    }

    if (signingAlgorithm !== "ed25519signature2018") {
        throw new Error('only ed25519signature2018 signature algorithm is currently supported');
    }

    if (!validateCheckSum( signerPrivateKey )) {
        throw new Error('signerPrivateKey is invalid');
    }

    if (!messageToSign) {
        throw new Error('message is required');
    }

    messageToSign = sha256(canonicalize(messageToSign));

    const privateKeyBytes = getKeyBytesFromKey( signerPrivateKey );
    const secretKey = ec.keyFromSecret(privateKeyBytes);
    const msgBytes = Buffer.from(messageToSign, constants.UTF8_ENCODE);

    const signatureObject = {
      "type": signingAlgorithm,
      "created": new Date(Date.now()).toISOString(),
      "creator": creatorId,
      "signatureValue": Buffer.from(secretKey.sign(msgBytes).toBytes()).toString(constants.BASE64_ENCODE)
    }
    return signatureObject
}

const validateSignature = (signatureObject, signerPublicKey, message) => {
    if (!signatureObject) {
      throw new Error('signature is required.');
    }

    if (!signerPublicKey) {
      throw new Error('signerPublicKey is required.');
    }

    if (!message) {
      throw new Error('message is required.');
    }

    message = sha256(canonicalize(message));

    if ( !('type' in signatureObject) ) return false;
    if ( !('signatureValue' in signatureObject) ) return false;

    if (signatureObject.type !== "ed25519signature2018") {
      throw new Error('only ed25519signature2018 signature algorithm is currently supported');
    }

    if (!validateCheckSum(signerPublicKey)) {
      throw new Error('signerPublicKey is invalid.');
    }

    const signatureBytes = Buffer.from(signatureObject.signatureValue, constants.BASE64_ENCODE);
    const msgBytes = Buffer.from(message, constants.UTF8_ENCODE);
    const keyBytes = getKeyBytesFromKey(signerPublicKey);
    const secretKey = ec.keyFromPublic([].concat(toConsumableArray(keyBytes)));
    return secretKey.verify(msgBytes, [].concat(toConsumableArray(signatureBytes)));
}

module.exports.signContent = signContent;
module.exports.validateSignature = validateSignature;