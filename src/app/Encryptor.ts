// /* eslint-disable @typescript-eslint/member-ordering */
// /* eslint-disable no-underscore-dangle */
// /* eslint-disable @typescript-eslint/ban-types */
// import * as CryptoJS from 'crypto-js';
// import EncryptorI from './EncryptorI';

// export default class Encryptor implements EncryptorI {
//   private key: string;

//   /**
//    *
//    *
//    *
//    *
//    *
//    *
//    *
//    * Encrypts an object
//    *
//    *
//    *
//    *
//    * @param payload
//    * @returns
//    */
//   encrypt(payload: Object): string {
//     try {
//       //return CryptoJS.AES.encrypt(JSON.stringify(payload), this.key).toString();
//       return CryptoJS.AES.encrypt(payload, this.key).toString();
//     } catch (TypeError) {
//       throw new Error('None or invalid encryption key specified');
//     }
//   }

//   /**
//    *
//    *
//    *
//    *
//    *
//    *
//    *
//    * Decrypts a hash
//    *
//    *
//    *
//    *
//    * @param hash
//    * @returns
//    */
//   decrypt(hash: string): Object {
//     //console.log(CryptoJS.AES.decrypt(hash, this.key).toString(CryptoJS.enc.Utf8));
//     return CryptoJS.AES.decrypt(hash, this.key).toString(CryptoJS.enc.Utf8);
//     // return JSON.parse(
//     //   CryptoJS.AES.decrypt(hash, this.key).toString(CryptoJS.enc.Utf8)
//     // );
//   }

//   setKey(key: string) {
//     this.key = key;
//   }
// }

// export class AESUtil {
//   _ivSize: number;

//   constructor() {
//     this.keySize = 256;
//     this._ivSize = 128;
//     this.iterationCount = 1989;
//   }

//   get keySize() {
//     return this.keySize;
//   }

//   set keySize(value) {
//     this.keySize = value;
//   }

//   get iterationCount() {
//     return this.iterationCount;
//   }

//   set iterationCount(value) {
//     this.iterationCount = value;
//   }

//   generateKey(salt, passPhrase) {
//     return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
//       keySize: this.keySize / 32,
//       iterations: this.iterationCount
//     });
//   }

//   encryptWithIvSalt(salt, iv, passPhrase, plainText) {
//     const key = this.generateKey(salt, passPhrase);
//     const encrypted = CryptoJS.AES.encrypt(plainText, key, {
//       iv: CryptoJS.enc.Hex.parse(iv)
//     });
//     return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
//   }

//   decryptWithIvSalt(salt, iv, passPhrase, cipherText) {
//     const key = this.generateKey(salt, passPhrase);
//     const cipherParams = CryptoJS.lib.CipherParams.create({
//       ciphertext: CryptoJS.enc.Base64.parse(cipherText)
//     });
//     const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
//       iv: CryptoJS.enc.Hex.parse(iv)
//     });
//     return decrypted.toString(CryptoJS.enc.Utf8);
//   }

//   encrypt(passPhrase, plainText) {
//     const iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
//     const salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(CryptoJS.enc.Hex);
//     const ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
//     return salt + iv + ciphertext;
//   }

//   decrypt(passPhrase, cipherText) {
//     const ivLength = this._ivSize / 4;
//     const saltLength = this.keySize / 4;
//     const salt = cipherText.substr(0, saltLength);
//     const iv = cipherText.substr(saltLength, ivLength);
//     const encrypted = cipherText.substring(ivLength + saltLength);
//     return this.decryptWithIvSalt(salt, iv, passPhrase, encrypted);
//   }
// }

// export const aesUtil = new AESUtil();
