const S3Storage = require('./S3Storage')

class DeleteImage{
  async execute(filename) {
    try {
      const s3 = S3Storage;
      const response = await s3.deleteFile(filename);
      return {status: true, data: []}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }
}

module.exports = DeleteImage;
