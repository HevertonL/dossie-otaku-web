import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { ensureUserDeleted, ensureUserExists} from './helpers/dbHelpers.js';
import { getValidToken } from './helpers/authHelpers.js';

describe('SUÍTE: Gestão de Usuários (Cadastro)', () => {
  
  const validUser = {
    name: 'Novo Otaku',
    email: 'cadastro_teste@dossie.com',
    password: 'senha_forte_123'
  };

  // PREPARAÇÃO: Garante que o terreno está limpo para a regra de negócio funcionar
  before(async () => {
    await ensureUserDeleted(validUser.email);
  });

  // 1º BLOCO: Validações Sintáticas (Payload)
  describe('Validações de Entrada (Campos Obrigatórios e Formatos)', () => {
    
    it('Deve retornar 400 ao tentar cadastrar sem o Nome', async () => {
      const response = await request(app)
        .post('/users/register')
        .send({ 
          email: validUser.email, 
          password: validUser.password 
        });

      expect(response.status).to.equal(400);
    });

    it('Deve retornar 400 ao tentar cadastrar sem o E-mail', async () => {
      const response = await request(app)
        .post('/users/register')
        .send({ 
          name: validUser.name, 
          password: validUser.password 
        });

      expect(response.status).to.equal(400);
    });

    it.skip('Deve retornar 400 ao tentar cadastrar com um E-mail inválido', async () => {
      const response = await request(app)
        .post('/users/register')
        .send({ 
          ...validUser, 
          email: 'email_sem_arroba.com' 
        });

      expect(response.status).to.equal(400);
    });

    it('Deve retornar 400 ao tentar cadastrar sem a Senha', async () => {
      const response = await request(app)
        .post('/users/register')
        .send({ 
          name: validUser.name, 
          email: validUser.email 
        });

      expect(response.status).to.equal(400);
    });
  });

  // 2º BLOCO: Regras de Negócio (Unicidade e Sucesso)
  describe('Regras de Negócio (Criação e Unicidade)', () => {
    
    it('Deve retornar 201 ao cadastrar um novo usuário com todos os dados válidos', async () => {
      const response = await request(app)
        .post('/users/register')
        .send(validUser);

      expect(response.status).to.equal(201);
      expect(response.body.user).to.have.property('email', validUser.email);
      expect(response.body.user).to.not.have.property('password'); 
    });

    it('Deve retornar 409 (Conflict) ao tentar cadastrar um e-mail já existente', async () => {
      // Como o teste anterior (201) criou o usuário, esta requisição idêntica deve falhar.
      const response = await request(app)
        .post('/users/register')
        .send(validUser);

      // Aqui podemos cravar o 409 (em vez de oneOf), assumindo que 
      // a sua API retorna 409 especificamente para conflitos de banco.
      expect(response.status).to.equal(409);
    });
  });

  // ---------------------------------------------------------
  // 3º BLOCO: Rota Protegida de Perfil (GET /users/profile)
  // ---------------------------------------------------------
  describe('Rota Protegida (Perfil do Autenticado)', () => {
    
    let validToken = '';

    before(async () => {
      // 1. Garante que o usuário existe no banco
      validToken = await getValidToken();
    });

    it('Deve retornar 401 (Unauthorized) ao tentar acessar o perfil sem Token', async () => {
      const response = await request(app)
        .get('/users/profile'); // Sem Header de Authorization

      expect(response.status).to.equal(401);
    });

    it('Deve retornar 401 (Unauthorized) ao tentar acessar com um Token inválido', async () => {
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer token_falso_inventado_agora');

      expect(response.status).to.equal(401);
    });

    it('Deve retornar 200 e os dados do usuário ao acessar com Token válido', async () => {
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${validToken}`); // 🔑 Injetando o token real!

      expect(response.status).to.equal(200);
      
      // Validações do JSON de retorno (Ajuste com .user se o seu backend envelopar a resposta)
      expect(response.body).to.have.property('email', 'qa_auth@dossie.com');
      expect(response.body).to.have.property('name', 'QA Autenticado');
      expect(response.body).to.not.have.property('password'); // Segurança
    });
  });

});