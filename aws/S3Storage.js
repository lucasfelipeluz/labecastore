require('dotenv').config()
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const aws = require('aws-sdk')

const accessKeyId = process.env.aws_access_key_id
const secreteAccessKey = process.env.aws_secret_access_key
const bucketName = process.env.aws_bucket_name
const region = process.env.aws_region

const uploadConfig = require('../config/upload');

/* Classe responsável por se conectar com AWS S3 */
class S3Storage {
  constructor() {
    this.client = new aws.S3({
      region,
      accessKeyId,
      secreteAccessKey
    });

  }

  /* Salvar Arquivo no Bucket */
  async saveFile(filename) {
    const originalPath = path.resolve(uploadConfig.directory, filename);

    const ContentyType = mime.getType(originalPath);

    if (!ContentyType) {
      throw new Error('file not found')
    }

    const fileContent = await fs.promises.readFile(originalPath)

    try {
      this.client.putObject({
        Bucket: bucketName,
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

  /* Deletar Arquivo no Bucket */
  async deleteFile(filename) {
    const params = {
      Bucket: bucketName,
      Key: filename
    }
  try {
    this.client
      .deleteObject(params, (err) => {
        if (err) throw 'Erro Interno';
      }).promise
    
    return { status: true, data: [] }
  } catch (error) {
    console.log(error)
    return { status: false, data: [] }
  }
  }

  /* Retorna a Url do Arquivo */
  async getUrl(filename) {
  try {
    const data = this.client.getSignedUrl('getObject', {
      Bucket: bucketName,
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