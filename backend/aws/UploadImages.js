const S3Storage = require('./S3Storage');

class UploadImages{
  async execute(filename) {
    try {
      const s3 = S3Storage;
      await s3.saveFile(filename)
      return {status: true, data: []}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }
}

module.exports = UploadImages;