const multer = require('multer')
const path = require('path')
const slugify = require('slugify')

const tmpFolder = path.resolve(__dirname, '..', 'tmp');

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