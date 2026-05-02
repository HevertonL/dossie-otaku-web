import request from 'supertest';
import * as chai from 'chai';
import app from '../src/app.js';
import { ensureDossierDeletedByAnimeId } from './helpers/dbHelpers.js'; 
import { getValidToken } from './helpers/authHelpers.js';
import { dossierListSchema } from './schemas/dossierSchemas.js';

const { expect } = chai;

describe('SUÍTE: Gestão de Dossiês (Reviews)', () => {
  let validToken = '';
  
  // Usamos um ID fixo e centralizado para ter previsibilidade em toda a suíte
  const fixedAnimeId = 20; 

  before(async () => {
    validToken = await getValidToken();
  });

  // ---------------------------------------------------------
  // SEGURANÇA E AUTENTICAÇÃO
  // ---------------------------------------------------------
  describe('POST /dossiers - Segurança', () => {
    it('Deve retornar 401 (Unauthorized) ao tentar criar um dossiê sem Token', async () => {
      const response = await request(app)
        .post('/dossiers')
        .send({ animeId: fixedAnimeId, rating: 5, text: 'Muito bom!', hasSpoiler: false });

      expect(response.status).to.equal(401);
    });
  });

  // ---------------------------------------------------------
  // VALIDAÇÕES DE PAYLOAD (BAD REQUEST)
  // ---------------------------------------------------------
  describe('POST /dossiers - Validações de Entrada', () => {
    it('Deve retornar 400 ao enviar payload sem os campos obrigatórios', async () => {
      const response = await request(app)
        .post('/dossiers')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ rating: 5, text: 'Esqueci o animeId e hasSpoiler' }); 

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'Os campos animeId, rating, text e hasSpoiler são obrigatórios.');
    });

    it('Deve retornar 400 ao enviar uma nota (rating) menor que 1', async () => {
      const response = await request(app)
        .post('/dossiers')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ animeId: fixedAnimeId, rating: 0, text: 'Odiei', hasSpoiler: false });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'A nota (rating) deve ser entre 1 e 5.');
    });

    it('Deve retornar 400 ao enviar uma nota (rating) maior que 5', async () => {
      const response = await request(app)
        .post('/dossiers')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ animeId: fixedAnimeId, rating: 6, text: 'Amei demais!', hasSpoiler: false });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error', 'A nota (rating) deve ser entre 1 e 5.');
    });
  });

  // ---------------------------------------------------------
  // REGRAS DE NEGÓCIO (CRIAR E UNICIDADE)
  // ---------------------------------------------------------
  
  describe('POST /dossiers - Regras de Negócio', () => {
    const validDossier = {
      animeId: fixedAnimeId,
      rating: 5,
      text: 'A evolução dos personagens é incrível!',
      hasSpoiler: false,
      status: 'Concluído'
    };

    // Chamamos a limpeza ANTES dos testes de criação rodarem
    before(async () => {
      await ensureDossierDeletedByAnimeId(fixedAnimeId); 
    });

    it('Deve retornar 201 (Created) ao criar um dossiê com dados válidos', async () => {
      const response = await request(app)
        .post('/dossiers')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validDossier);

      expect(response.status).to.equal(201);
      expect(response.body.dossier).to.have.property('animeId', validDossier.animeId);
      expect(response.body.dossier).to.have.property('rating', validDossier.rating);
    });

    it('Deve retornar 409 (Conflict) ao tentar criar um segundo dossiê para o mesmo anime', async () => {
      // Mandando o exato mesmo payload do teste anterior (que já salvou no banco)
      const response = await request(app)
        .post('/dossiers')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ ...validDossier, text: 'Tentando burlar o sistema!' });

      expect(response.status).to.equal(409);
      expect(response.body).to.have.property('error', 'Você já publicou um dossiê para este anime. Tente atualizá-lo.');
    });
  });

  // ---------------------------------------------------------
  // LEITURA DE DOSSIÊS (GET /dossiers/anime/:animeId)
  // ---------------------------------------------------------
  describe('GET /dossiers/anime/:animeId - Listagem', () => {
    
    it('Deve retornar 200 e uma lista vazia caso o anime não tenha nenhum dossiê publicado', async () => {
      const unusedAnimeId = 888888; // Um ID que sabemos que não tem dossiê
      const response = await request(app).get(`/dossiers/anime/${unusedAnimeId}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').that.is.empty;
    });

    it('Deve retornar 200 e a lista de dossiês formatada de acordo com o Schema', async () => {
      // Como esse teste roda DEPOIS do POST que fizemos ali em cima, 
      // o banco já tem o dossiê do fixedAnimeId (9999) garantido!
      const response = await request(app).get(`/dossiers/anime/${fixedAnimeId}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').that.is.not.empty;
      
      // Valida o contrato e garante que os dados sensíveis do usuário não vazaram
      expect(response.body).to.be.jsonSchema(dossierListSchema);
    });

  });

});