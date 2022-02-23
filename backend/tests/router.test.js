const request = require('supertest');
const app = require('../app');

describe('Padrão de resposta de sucesso das rotas', () => {
  describe('Admin', () => {
    test('GET/admin', async () => {
      const res = await request(app)
        .get('/admin');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })
  
    test('POST/admin/login', async () => {
      const res = await request(app)
        .post('/admin/login')
        .send({nickname: "lucas", password: "lucas"})
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })  
  })

  describe('Categorias', () => {
    test('GET/admin/categories', async () => {
      const res = await request(app)
        .get('/admin/categories');
  
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })
  
    test('POST/admin/categories', async () => {
      const res = await request(app)
        .post('/admin/categories')
        .send({id: 4242, name:"Teste Teste Teste"});
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })

    test('PUT/admin/categories/:id', async () => {
      const res = await request(app)
        .put('/admin/categories/4242')
        .send({name: 'Testado Testado Testado'});
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })

    test('DELETE/admin/categories/:id', async () => {
      const res = await request(app)
        .delete('/admin/categories/4242');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })
  })

  describe('Produtos', () => {
    test('GET/admin/products', async () => {
      const res = await request(app)
        .get('/admin/products');
    
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })

    test('POST/admin/products', async () => {
      const res = await request(app)
        .post('/admin/products')
        .send({id: 9999, title: "Teste Produtos", description: "teste", price: 999.91, inventoryPP: 31,
          inventoryP: 21, inventoryM: 21, inventoryG: 432, inventoryGG: 78, inventoryEG: 34,
          inventoryEGG: 312, year: "1999", categoryId: [9999], imageId: [9999]});
    
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })

    test('GET/admin/products/details/:id', async () => {
      const res = await request(app)
        .get('/admin/products/details/9999');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })

    test('DELETE/admin/products/:id', async () => {
      const res = await request(app)
        .delete('/admin/products/9999');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })

  })
})

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })

    test('PUT/admin/categories/:id', async () => {
      const res = await request(app)
        .put('/admin/categories/4242')
        .send({name: 'Testado Testado Testado'});
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })

    test('DELETE/admin/categories/:id', async () => {
      const res = await request(app)
        .delete('/admin/categories/4242');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })
  })

  describe('Produtos', () => {
    test('GET/admin/products', async () => {
      const res = await request(app)
        .get('/admin/products');
    
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })

    test('POST/admin/products', async () => {
      const res = await request(app)
        .post('/admin/products')
        .send({id: 9999, title: "Teste Produtos", description: "teste", price: 999.91, inventoryPP: 31,
          inventoryP: 21, inventoryM: 21, inventoryG: 432, inventoryGG: 78, inventoryEG: 34,
          inventoryEGG: 312, year: "1999", categoryId: [9999], imageId: [9999]});
    
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })

    test('GET/admin/products/details/:id', async () => {
      const res = await request(app)
        .get('/admin/products/details/9999');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })

    test('DELETE/admin/products/:id', async () => {
      const res = await request(app)
        .delete('/admin/products/9999');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })

  }) */
})