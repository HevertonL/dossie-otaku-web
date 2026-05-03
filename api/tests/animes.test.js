import request from 'supertest';
import * as chai from 'chai';
const { expect } = chai;
import chaiJsonSchema from 'chai-json-schema';
import app from '../src/app.js';
import { animeListSchema, animeDetailsSchema, topAnimeListSchema } from './schemas/animesSchemas.js';


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Ativando o plugin de validação de contratos!
chai.use(chaiJsonSchema);

describe('SUÍTE: Catálogo de Animes', () => {

  // ---------------------------------------------------------
  // TESTES DE ANIMES (GET)
  // ---------------------------------------------------------
  describe('GET /animes/search', () => {
  it('Deve retornar 200 e uma lista de animes formatada', async () => {
    await sleep(1500); // Evita rate limit da Jikan API
    // Vamos buscar por um termo comum, como 'Naruto'
    const response = await request(app)
      .get('/animes/search')
      .query({ q: 'Naruto' }); // Passando o parâmetro de busca

    expect(response.status).to.equal(200);
    
    // Validação do Contrato: Verifica se o seu .map funcionou como esperado
    expect(response.body).to.be.jsonSchema(animeListSchema);
    
    // Validação de Integridade: Se buscamos Naruto, o primeiro item deve conter o título esperado
    if (response.body.length > 0) {
      expect(response.body[0].title.toLowerCase()).to.include('naruto');
    }
  });

  it('Deve retornar uma lista vazia ou 200 ao buscar por um termo inexistente', async () => {
    await sleep(1500);
    const response = await request(app)
      .get('/animes/search')
      .query({ q: 'termo_que_nao_existe_123456' });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array').and.empty;
  });
});

describe('GET /animes/search - Validação de Parâmetros', () => {
    it('Deve retornar 400 ao tentar buscar sem o parâmetro "q"', async () => {
      await sleep(1500);
      const response = await request(app)
        .get('/animes/search'); // Chamada sem .query()

      expect(response.status).to.equal(400);
      
      // Validando a mensagem de erro conforme o seu Swagger
      expect(response.body).to.have.property('error', 'O termo de busca é obrigatório.');
    });

    it('Deve retornar 400 ao enviar o parâmetro "q" vazio', async () => {
      await sleep(1500); // Evita rate limit da Jikan API
      const response = await request(app)
        .get('/animes/search')
        .query({ q: '' });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'O termo de busca é obrigatório.');
    });
  });

  // ---------------------------------------------------------
  // TESTES DE BUSCA POR ID (GET /animes/:id)
  // ---------------------------------------------------------
  describe('GET /animes/:id - Detalhes do Anime', () => {
    
    it('Deve retornar 200 e os detalhes do anime validando o JSON Schema', async () => {
      await sleep(1500);
      // Usando o ID 20 (Naruto) que é garantido de existir na Jikan API
      const validId = 20; 
      
      const response = await request(app).get(`/animes/${validId}`);

      expect(response.status).to.equal(200);
      
      // Valida se o objeto obedece ao contrato mapeado no Controller
      expect(response.body).to.be.jsonSchema(animeDetailsSchema);
      
      // Valida a integridade do dado principal
      expect(response.body).to.have.property('id', validId);
      expect(response.body.title.toLowerCase()).to.include('naruto');
    });

    it('Deve retornar 404 e a mensagem de erro correta ao buscar ID inexistente', async () => {
      await sleep(1500); // Evita rate limit da Jikan API
      const invalidId = 999999999; 
      
      const response = await request(app).get(`/animes/${invalidId}`);

      expect(response.status).to.equal(404);
      
      // Valida exatamente a string definida no seu if (response.status === 404)
      expect(response.body).to.have.property('error', 'Anime não encontrado.');
    });

  });

  // ---------------------------------------------------------
  // TESTES DE DESTAQUES (GET /animes/top)
  // ---------------------------------------------------------
  describe('GET /animes/top - Destaques', () => {
    
    it('Deve retornar 200 e a lista de animes em destaque validando o JSON Schema enxuto', async () => {
      await sleep(1500); // ⏱️ Fôlego sagrado para não tomar 429 da Jikan

      const response = await request(app).get('/animes/top');

      expect(response.status).to.equal(200);
      
      // Valida que retornou um array com itens
      expect(response.body).to.be.an('array').that.is.not.empty;
      
      // Bate o contrato validando que os campos extras não estão vazando e os fallbacks funcionam
      expect(response.body).to.be.jsonSchema(topAnimeListSchema);
    });

  });

});