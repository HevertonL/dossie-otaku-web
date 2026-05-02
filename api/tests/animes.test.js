import request from 'supertest';
import * as chai from 'chai';
const { expect } = chai;
import chaiJsonSchema from 'chai-json-schema';
import app from '../src/app.js';

// Ativando o plugin de validação de contratos!
chai.use(chaiJsonSchema);

describe('SUÍTE: Catálogo de Animes', () => {

  // ---------------------------------------------------------
  // SCHEMAS (O Molde do Contrato JSON que a API deve seguir)
  // ---------------------------------------------------------
  const animeSchema = {
  title: 'Anime Schema MVP',
  type: 'object',
  required: ['id', 'title', 'synopsis', 'episodes', 'score', 'imageUrl'],
  properties: {
    id: { type: 'integer' }, // Vem do anime.mal_id
    title: { type: 'string' },
    synopsis: { type: ['string', 'null'] }, // Synopsis pode vir nula às vezes
    episodes: { type: ['integer', 'null'] },
    score: { type: ['number', 'null'] },
    imageUrl: { type: ['string', 'null'] }
  }
};

const animeListSchema = {
  type: 'array',
  items: animeSchema
};
  // ---------------------------------------------------------
  // TESTES DE ANIMES (GET)
  // ---------------------------------------------------------
  describe('GET /animes/search', () => {
  it('Deve retornar 200 e uma lista de animes formatada', async () => {
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
    const response = await request(app)
      .get('/animes/search')
      .query({ q: 'termo_que_nao_existe_123456' });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array').and.empty;
  });
});

describe('GET /animes/search - Validação de Parâmetros', () => {
    it('Deve retornar 400 ao tentar buscar sem o parâmetro "q"', async () => {
      const response = await request(app)
        .get('/animes/search'); // Chamada sem .query()

      expect(response.status).to.equal(400);
      
      // Validando a mensagem de erro conforme o seu Swagger
      expect(response.body).to.have.property('error', 'O termo de busca é obrigatório.');
    });

    it('Deve retornar 400 ao enviar o parâmetro "q" vazio', async () => {
      const response = await request(app)
        .get('/animes/search')
        .query({ q: '' });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'O termo de busca é obrigatório.');
    });
  });

});