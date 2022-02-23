const request = require('supertest');
const database = require('../databases/connection');
const User = require('../models/admin/Admin');
const Categories = require('../models/admin/Categories');
const Products = require('../models/admin/Products');

const padraoDeRetornoSuccess = ['status','data']

describe('Padrão de resposta de sucesso dos Models', () => {
  describe('Admin', () => {
    test('findByNickname', async () => {
      const responseModelAdmin = await User.findByNickname('lucas');
      
      expect(responseModelAdmin).toHaveProperty('status', true);
      expect(responseModelAdmin).toHaveProperty('data');
    })
  })

  describe('Categories', () => {
    const codTesteBancoDeDados = 828282;
    test('findAll', async () => {
      const responseModelProducts = await Categories.findAll();
      
      expect(responseModelProducts).toHaveProperty('status', true);
      expect(responseModelProducts).toHaveProperty('data');
    })

    test('insertData', async () => {
      const responseModelCategories = await Categories.insertData({id: codTesteBancoDeDados, name: 'Teste', slug: 'test'});
      
      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })

    test('updateData', async () => {
      const responseModelCategories = await Categories.updateData(codTesteBancoDeDados, {name: 'Testando', slug: 'testando'});
      
      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })

    test('deleteData', async () => {
      const responseModelCategories = await Categories.deleteData(codTesteBancoDeDados);

      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })
  })

  describe('Products', () => {
    const codTesteBancoDeDados = 919191;
    test('findAll', async () => {
      await database.insert({id: codTesteBancoDeDados, name: 'testing', slug: 'testing'})
        .table('categories');
      await database.insert({id: codTesteBancoDeDados, filename: 'teste', url: 'url'})
        .table('images');

      const responseModelProducts = await Products.findAll();
      
      expect(responseModelProducts).toHaveProperty('status', true);
      expect(responseModelProducts).toHaveProperty('data');
    })

    test('insertData', async () => {
      const responseModelProducts = await Products.insertData({id: codTesteBancoDeDados, title: "Timão I", 
        description: "passira", price: 299.31, inventoryPP: 0, inventoryP: 0, inventoryM: 0, 
        inventoryG: 0, inventoryGG: 0, inventoryEG: 0, inventoryEGG: 0, year: "2019", 
        categoryId: [codTesteBancoDeDados], imageId: [codTesteBancoDeDados]});
      
      expect(responseModelProducts).toHaveProperty('status', true);
      expect(responseModelProducts).toHaveProperty('data');
    })

    test('updateData', async () => {
      const responseModelProducts = await Products.updateData(
        codTesteBancoDeDados, 
        { title: "Timão III", description: "ola", price: 99.31, inventoryPP: 0, inventoryP: 0,
        inventoryM: 0, inventoryG: 0, inventoryGG: 0, inventoryEG: 0, inventoryEGG: 0, year: "2019" },
        { categoryId: [codTesteBancoDeDados], imageId: [codTesteBancoDeDados] }
      )
        
      expect(responseModelProducts).toHaveProperty('status', true);
      expect(responseModelProducts).toHaveProperty('data');
    })

    test('deleteData', async () => {
      await database.delete().where({id: codTesteBancoDeDados}).table('categories');
      await database.delete().where({id: codTesteBancoDeDados}).table('images');

      const responseModelProducts = await Products.deleteData(codTesteBancoDeDados);

      expect(responseModelProducts).toHaveProperty('status', true);
      expect(responseModelProducts).toHaveProperty('data');
    })
  })
})
