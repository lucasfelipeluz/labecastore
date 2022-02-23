const request = require('supertest');
const User = require('../models/admin/Admin');
const Categories = require('../models/admin/Categories');

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
    test('findAll', async () => {
      const responseModelProducts = await Categories.findAll();
      
      expect(responseModelProducts).toHaveProperty('status', true);
      expect(responseModelProducts).toHaveProperty('data');
    })

    test('insertData', async () => {
      const responseModelCategories = await Categories.insertData({id: 10000, name: 'Teste', slug: 'test'});
      
      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })

    test('updateData', async () => {
      const responseModelCategories = await Categories.updateData(10000, {name: 'Testando', slug: 'testando'});
      
      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })

    test('deleteData', async () => {
      const responseModelCategories = await Categories.deleteData(10000);

      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })
  })

  describe('Products', () => {
    test('findAll', async () => {
      const responseModelProducts = await Categories.findAll();
      
      expect(responseModelProducts).toHaveProperty('status', true);
      expect(responseModelProducts).toHaveProperty('data');
    })

    test('insertData', async () => {
      const responseModelCategories = await Categories.insertData({id: 10000, name: 'Teste', slug: 'test'});
      
      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })

    test('updateData', async () => {
      const responseModelCategories = await Categories.updateData(10000, {name: 'Testando', slug: 'testando'});
      
      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })

    test('deleteData', async () => {
      const responseModelCategories = await Categories.deleteData(10000);

      expect(responseModelCategories).toHaveProperty('status', true);
      expect(responseModelCategories).toHaveProperty('data');
    })
  })
})