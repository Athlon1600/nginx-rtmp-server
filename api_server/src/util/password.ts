const crypto = require('node:crypto');

// as per - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2
const _HASH_ITERATIONS = 600_000;
const _saltLength = 16;
const _keyLength = 32;
const _digestAlgorithm = 'sha256';

export const passwordHash = (password: string): Promise<Buffer> => {

    const salt = crypto.randomBytes(_saltLength);

    return new Promise((resolve, reject) => {

        // async call would block event loop for too long
        crypto.pbkdf2(password, salt, _HASH_ITERATIONS, _keyLength, _digestAlgorithm, (err: Error, derivedKey: Buffer) => {

            if (err) {
                return reject(err);
            }

            const combined = Buffer.concat([salt, derivedKey]);
            resolve(combined);
        });
    })
}

export const passwordVerify = (userPassword: string, passwordHash: Buffer): Promise<boolean> => {

    const expectedHashSize = (_keyLength + _saltLength);

    if (passwordHash.length !== expectedHashSize) {
        return Promise.resolve(false);
    }

    // first 16 bytes is always salt
    const salt = passwordHash.subarray(0, _saltLength);
    const hash = passwordHash.subarray(_saltLength);

    return new Promise((resolve, reject) => {

        crypto.pbkdf2(userPassword, salt, _HASH_ITERATIONS, _keyLength, _digestAlgorithm, (err: Error, derivedKey: Buffer) => {

            if (err) {
                return reject(err);
            }

            const result = crypto.timingSafeEqual(hash, derivedKey);
            resolve(result);
        });
    });
}