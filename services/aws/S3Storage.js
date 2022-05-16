require('dotenv').config()
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const aws = require('aws-sdk')

const accessKeyId = process.env.aws_access_key_id
const secretAccessKey = process.env.aws_secret_access_key
const bucketName = process.env.aws_bucket_name
const region = process.env.aws_region

const uploadConfig = require('../../config/upload')

class S3Storage {
  constructor(){
    this.client = new aws.S3({
      region,
      accessKeyId,
      secretAccessKey
    })
  }

  // Enviando
  async saveFile(filename) {
    try {
      const originalPath = path.resolve(uploadConfig.directory, filename);

      const contentyType = mime.getType(originalPath);

      if (!contentyType) {
        throw new Error('Erro em lidar com os arquivos')
      }

      const fileContent = await fs.promises.readFile(originalPath);

      await this.client.putObject({
        Bucket: bucketName,
        Key: filename,
        Body: fileContent
      }).promise()

      await fs.promises.unlink(originalPath)
        .catch(() => {throw new Error('Erro em lidar com os arquivos')});

      return {status: true}
      
    } catch (error) {
      console.warn(error)
      return { status: false }
    }
  }

  // Apagando
  async deleteFile(filename) {
    try {
      
      await this.client.deleteObject({
        Bucket: bucketName,
        Key: filename,
      }).promise()

      return { status: true }

    } catch (error) {
      console.warn(error)
      return { status: false }
    }
  }

  // Pegando a url
  async GetUrl(filename) {
    try {
      const url = this.client.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: filename
      })

      return { status: true, data: url}

    } catch (error) {
      console.warn(error)
      return { status: false }
    }
  }

}

module.exports = new S3Storage();