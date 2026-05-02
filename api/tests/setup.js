import prisma from '../src/services/prisma.js';

// Este hook roda DEPOIS que todos os testes de todos os arquivos terminarem
export const mochaHooks = {
  async afterAll() {
    console.log('🔌 Desconectando do Neon DB (Global Hook)...');
    await prisma.$disconnect();
  }
};