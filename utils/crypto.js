// utils/crypto.js
const CryptoJS = require('crypto-js');

// Your secret encryption key - store this in environment variables (.env)
// NEVER hardcode this in production!
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-secure-encryption-key-change-this';

// Encrypt data
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

// Decrypt data
const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };