const request = require('supertest');
const app = require('../app');

jest.setTimeout(10000)

describe('Padrão de resposta de sucesso das rotas', () => {
  describe('Admin', () => {
    test('Deve retornar o padrão de respostas no GET/admin', async () => {
      const res = await request(app).get('/admin');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })
  
    test('Deve retornar o padrão de respostas no POST/admin/login', async () => {
      const res = await request(app)
        .post('/admin/login')
        .send({nickname: "lucas", password: "lucas"})
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('info');
    })  
  })

  describe('Categorias', () => {
    test('Deve retornar o padrão de respostas no GET/admin/categories', async () => {
      const res = await request(app)
      .get('/admin/categories');
  
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })
  
    test('Deve retornar o padrão de respostas no POST/admin/categories', async () => {
      const res = await request(app)
      .post('/admin/categories')
      .send({id: 4242, name:"Teste Teste Teste"});
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })

    test('Deve retornar o padrão de respostas no PUT/admin/categories/:id', async () => {
      const res = await request(app)
      .put('/admin/categories/4242')
      .send({name: 'Testado Testado Testado'});
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })

    test('Deve retornar o padrão de respostas no DELETE/admin/categories/:id', async () => {
      const res = await request(app)
      .delete('/admin/categories/4242');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('info');
    })
  
  })

})