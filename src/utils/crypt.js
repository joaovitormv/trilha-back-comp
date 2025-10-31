const crypto = require('crypto');

const alg = 'aes-256-ctr';
const secretKey = process.env.SECRET_CRYPTO; 

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(alg, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text.toString()), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
    };
};

const decrypt = (hash) => {
    if (!hash || !hash.iv || !hash.content) {
        throw new Error("Invalid hash format for decryption.");
    }
    
    const newIvBuffer = Buffer.from(hash.iv, 'hex');
    const encryptedTextBuffer = Buffer.from(hash.content, 'hex');

    const decipher = crypto.createDecipheriv(alg, secretKey, newIvBuffer);
    const decrypted = Buffer.concat([decipher.update(encryptedTextBuffer), decipher.final()]);

    return decrypted.toString();
};

module.exports = { encrypt, decrypt };