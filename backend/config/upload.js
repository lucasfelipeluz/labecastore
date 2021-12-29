const multer = require('multer')
const path = require('path')
const slugify = require('slugify')

/* Declarando pasta para arquivos temporários */
const tmpFolder = path.resolve(__dirname, '..', 'tmp');


/* Exportando configurações de Upload */
module.exports = {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const imageCode = Date.now().toString();
      const filename = `${imageCode}-${slugify(file.originalname).toLowerCase()}`

      return callback(null, filename)
    }
  })
}