import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

// Importando a inteligência do nosso Helper!
import { ensureUserExists } from './helpers/dbHelpers.js'; 

describe('SUÍTE: Gestão de Identidade e Autenticação', () => {
  
  // Massa de dados centralizada e isolada para o Login
  const testUser = {
    name: 'QA Independente',
    email: 'qa_independente@dossie.com',
    password: 'senha_segura_123'
  };

  describe('POST /auth/login', () => {

    before(async () => {
      // O Helper faz todo o trabalho sujo: checa se existe, se não, cria e faz o hash!
      await ensureUserExists(testUser.name, testUser.email, testUser.password);
    });

    it('Deve retornar 401 ao tentar logar com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'hacker@dossie.com',
          password: 'senhaincorreta'
        });

      expect(response.status).to.equal(401);
    });

    it('Deve retornar 200 e um token JWT válido ao logar com credenciais corretas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email, 
          password: testUser.password 
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string').and.not.empty;
    });

  });
});