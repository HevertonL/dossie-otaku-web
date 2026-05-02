import request from 'supertest';
import app from '../../src/app.js'; // Ajuste o caminho pro seu app.js se precisar
import { ensureUserExists } from './dbHelpers.js';

/**
 * Helper para gerar um Token JWT válido rapidamente para os testes.
 * Ele garante que o usuário existe e faz o login por baixo dos panos.
 */
export async function getValidToken() {
  const defaultUser = {
    name: 'QA Autenticado',
    email: 'qa_auth@dossie.com',
    password: 'senha_padrao_123'
  };

  // Garante que o usuário base existe no banco
  await ensureUserExists(defaultUser.name, defaultUser.email, defaultUser.password);

  // Faz o login e captura o token
  const response = await request(app)
    .post('/auth/login')
    .send({ email: defaultUser.email, password: defaultUser.password });

  return response.body.token;
}