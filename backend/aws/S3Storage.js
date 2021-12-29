const path = require('path')
const fs = require('fs')
const mime = require('mime')
const aws = require('aws-sdk')

const uploadConfig = require('../config/upload');

class S3Storage {
  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1'
    });

  }

  async saveFile(filename) {
    const originalPath = path.resolve(uploadConfig.directory, filename);

    const ContentyType = mime.getType(originalPath);

    if (!ContentyType) {
      throw new Error('file not found')
    }

    const fileContent = await fs.promises.readFile(originalPath)

    try {
      this.client.putObject({
        Bucket: 'labeca',
        Key: filename,
        Body: fileContent,
      }).promise()

      await fs.promises.unlink(originalPath)

      return { status: true, data: [] }
    } catch (error) {
      console.log(error)
      return { status: false, data: [] }
    }

  }


  async deleteFile(filename) {
  try {
    await this.client
      .deleteObject({
        Bucket: 'labeca',
        Key: filename
      }).promise

    return { status: true, data: [] }
  } catch (error) {
    console.log(error)
    return { status: false, data: [] }
  }
}

  async getUrl(filename) {
  try {
    const data = this.client.getSignedUrl('getObject', {
      Bucket: 'labeca',
      Key: filename
    })

    return { status: true, data, }
  } catch (error) {
    console.log(error)
    return { status: false, data: [] }
  }
}
}

module.exports = new S3Storage();