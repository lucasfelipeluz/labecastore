const S3Storage = require('./S3Storage')

/*  Método que faz o request da Url da Imagem
    para o S3 */
class GetUrlImages{
  async execute(filename) {
    try {
      const s3 = S3Storage;
      const response = await s3.getUrl(filename);
      return {status: true, data: response.data}
    } catch (error) {
      console.log(error)
      return {status: false, data: []}
    }
  }
}

module.exports = GetUrlImages;