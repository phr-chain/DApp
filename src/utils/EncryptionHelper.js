const CryptoJS = require("crypto-js");
const bs58 = require('bs58');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
// const crypto = require("crypto");
const eccrypto = require("eccrypto");


function convertArrayBuffer2WordArray(arraybuffer) {
    var words = [],
    u8arr = new Uint8Array(arraybuffer),
    len = u8arr.length;
    for (var i = 0; i < len; i++) {
        words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(words, len);
}

function convertWordArrayToUint8Array(wordArray) {
	var len = wordArray.words.length,
		u8_array = new Uint8Array(len << 2),
		offset = 0, word, i;
    
	for (i=0; i<len; i++) {
		word = wordArray.words[i];
		u8_array[offset++] = word >> 24;
		u8_array[offset++] = (word >> 16) & 0xff;
		u8_array[offset++] = (word >> 8) & 0xff;
		u8_array[offset++] = word & 0xff;
	}
	return u8_array;
}

function hexToBase58(stringHex) {
    const bytes = Buffer.from(stringHex, 'hex')
    return bs58.encode(bytes);
}

function base58ToHex(stringBase58) {
    const bytes = bs58.decode(stringBase58)
    return bytes.toString('hex');
}

function ecKeyToBase58KeyPair(keyPair){
    const publicKeyHex = keyPair.getPublic('hex').toString();
    const privateKeyHex = keyPair.getPrivate('hex').toString();
    const publicKeyBase58 = hexToBase58(publicKeyHex);
    const privateKeyBase58 = hexToBase58(privateKeyHex);

    return  {
        publicKey: publicKeyBase58,
        privateKey:privateKeyBase58
    };
}

export function generateSharedKey(){
    //return crypto.randomBytes(32);
    return "todomessage";
}

export function encrypt(arrayBuffer, symmetricKey){
    var wordArray = convertArrayBuffer2WordArray(arrayBuffer);
    var encryptionResult = CryptoJS.AES.encrypt(wordArray, symmetricKey);
    var encryptedText = encryptionResult.toString();
    return encryptedText;
}

export function decryptAsWordArray(encryptedText, symmetricKey){
    var wordArray = CryptoJS.AES.decrypt(encryptedText, symmetricKey);
    return wordArray;
}

export function decryptAsByteArray(encryptedText, symmetricKey){
    var wordArray = decryptAsWordArray(encryptedText, symmetricKey);
    var bytearray = convertWordArrayToUint8Array(wordArray);
    return bytearray;
}

export function decryptAsString(encryptedText, symmetricKey){
    var wordArray = decryptAsWordArray(encryptedText, symmetricKey);
    var str = wordArray.toString();
    return str;
}

function keyBase58ToECKey(publicKeyBase58, privateKeyBase58){
    if (publicKeyBase58){
        const publicKeyHex = base58ToHex(publicKeyBase58);
        return ec.keyFromPublic(publicKeyHex, 'hex');
    } else if (privateKeyBase58) {
        const privateKeyHex = base58ToHex(privateKeyBase58);
        return ec.keyFromPrivate(privateKeyHex);
    }
}

export function extractPubKey(privateKeyBase58){
    const ecKey = keyBase58ToECKey(null, privateKeyBase58);
    return ecKeyToBase58KeyPair(ecKey).publicKey;
}

export function generatePubPrivateKeys(){
    const ecKey = ec.genKeyPair();
    return ecKeyToBase58KeyPair(ecKey);
}

export function encryptByPublicKeyAsync(publicKeyBase58, message){
    return new Promise(function(resolve, reject){
        const publicKeyHex = base58ToHex(publicKeyBase58);
        const publicKeyBuffer = new Buffer(publicKeyHex, 'hex');
        eccrypto.encrypt(publicKeyBuffer, new Buffer(message))
            .then(encrypted=>{
                const json = JSON.stringify([
                    encrypted.ciphertext.toString('hex'),
                    encrypted.ephemPublicKey.toString('hex'),
                    encrypted.iv.toString('hex'),
                    encrypted.mac.toString('hex'),
                ]);
                resolve(json);
            })
            .catch(err=>reject(err));
    });
}

export function encryptMessagesByPublicKeyAsync(publicKeyBase58, messages){
    if (!messages) return Promise.resolve(null);
    var cipherPromises = messages.map(msg=> encryptByPublicKeyAsync(publicKeyBase58, msg));
    return Promise.all(cipherPromises);
}

export function decryptCiphersByPrivateKeyAsync(privateKeyBase58, ciphers){
    if (!ciphers) return Promise.resolve(null);
    var messagePromises = ciphers.map(cipher=> decryptByPrivateKeyAsync(privateKeyBase58, cipher));
    return Promise.all(messagePromises);
}

export function decryptByPrivateKeyAsync(privateKeyBase58, cipher){
    const jsonObj = JSON.parse(cipher);
    const encrypted = {
        ciphertext: new Buffer(jsonObj[0], 'hex'),
        ephemPublicKey: new Buffer(jsonObj[1], 'hex'),
        iv: new Buffer(jsonObj[2], 'hex'),
        mac: new Buffer(jsonObj[3], 'hex'),
    }
    const privateKeyHex = base58ToHex(privateKeyBase58);
    const privateKeyBuffer = new Buffer(privateKeyHex, 'hex');
    return eccrypto.decrypt(privateKeyBuffer, encrypted);
}

export function test() {
    var k1 = generatePubPrivateKeys();
    var data = `PHR-Chain`;
    encryptByPublicKeyAsync(k1.publicKey, data).then(function (cipher) {
        decryptByPrivateKeyAsync(k1.privateKey, cipher).then(function (plaintext) {
            console.log("@@@@@@@@@@@@@ :", plaintext.toString());
        });
    });

    return k1;
}
