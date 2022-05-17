require('dotenv').config();
const bcrypt = require('bcrypt');

class Encrypting {
  constructor() {
    this.keySecret = process.env.code_hash
    this.salt = parseInt(process.env.salt_hash)
  }

  async textToHash(texto) {
    return await bcrypt.hash(texto, this.salt);
  }

  async comparing(hash, text) {
    return await bcrypt.compare(text, hash)
  }
}

module.exports = new Encrypting();