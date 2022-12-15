/* eslint-disable @typescript-eslint/ban-types */
import * as CryptoJS from 'crypto-js';
import EncryptorI from './EncryptorI';

export default class Encryptor implements EncryptorI {
  private key: string;

  /**
   *
   *
   *
   *
   *
   *
   *
   * Encrypts an object
   *
   *
   *
   *
   * @param payload
   * @returns
   */
  encrypt(payload: Object): string {
    try {
      //return CryptoJS.AES.encrypt(JSON.stringify(payload), this.key).toString();
      return CryptoJS.AES.encrypt(payload, this.key).toString();
    } catch (TypeError) {
      throw new Error('None or invalid encryption key specified');
    }
  }

  /**
   *
   *
   *
   *
   *
   *
   *
   * Decrypts a hash
   *
   *
   *
   *
   * @param hash
   * @returns
   */
  decrypt(hash: string): Object {
    //console.log(CryptoJS.AES.decrypt(hash, this.key).toString(CryptoJS.enc.Utf8));
    return CryptoJS.AES.decrypt(hash, this.key).toString(CryptoJS.enc.Utf8);
    // return JSON.parse(
    //   CryptoJS.AES.decrypt(hash, this.key).toString(CryptoJS.enc.Utf8)
    // );
  }

  setKey(key: string) {
    this.key = key;
  }
}
