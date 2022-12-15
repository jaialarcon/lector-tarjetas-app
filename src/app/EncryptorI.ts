export default interface EncryptorI{

    /**
     * Encrypts a given payload
     *
     * @param {Object} payload
     * @returns {string}
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    encrypt(payload: Object): string;


    /**
     * Decrypts a hash
     *
     * @param {string} hash
     * @returns {any}
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    decrypt(hash: string): Object;

    /**
     * Sets the encryption key
     *
     * @param {string} key
     */
    setKey(key: string): void;
}
