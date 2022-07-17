require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const aws = require("aws-sdk");

const accessKeyId = process.env.aws_access_key_id;
const secretAccessKey = process.env.aws_secret_access_key;
const bucketName = process.env.aws_bucket_name;
const region = process.env.aws_region;

const uploadConfig = require("../../config/upload");

class S3Storage {
  constructor() {
    this.client = new aws.S3({
      region,
      accessKeyId,
      secretAccessKey,
    });
  }

  // Todos Objetos
  async GetAll() {
    try {
      const responseAWS = await this.client
        .listObjects({ Bucket: process.env.aws_bucket_name })
        .promise();

      return responseAWS.Contents;
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  }

  // Retorna o objeto em base64
  async GetObject(filename) {
    try {
      const responseAWS = await this.client
        .getObject({
          Bucket: process.env.aws_bucket_name,
          Key: filename,
        })
        .promise();

      return { status: true, data: responseAWS.Body.toString("base64") };
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  }

  // Enviando
  async saveFile(base64, filename) {
    try {
      const buffer = Buffer.from(base64, "base64");

      fs.writeFileSync(`${uploadConfig.directory}/${filename}`, buffer);
      const originalPath = path.resolve(uploadConfig.directory, filename);
      const contentyType = mime.getType(originalPath);

      if (!contentyType) {
        throw new Error("Erro em lidar com os arquivos");
      }

      const fileContent = await fs.promises.readFile(originalPath);

      await this.client
        .putObject({
          Bucket: process.env.aws_bucket_name,
          Key: filename,
          Body: fileContent,
        })
        .promise();

      await fs.promises.unlink(originalPath);

      return { status: true };
    } catch (error) {
      console.warn(error);
      return { status: false };
    }
  }

  // Apagando
  async deleteFile(filename) {
    try {
      await this.client
        .deleteObject({
          Bucket: process.env.aws_bucket_name,
          Key: filename,
        })
        .promise();

      return { status: true };
    } catch (error) {
      console.warn(error);
      return { status: false };
    }
  }
}

module.exports = new S3Storage();
