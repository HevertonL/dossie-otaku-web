import prisma from '../../src/services/prisma.js';
import bcrypt from 'bcryptjs';

// Helper 1 (Para Testes de Login): Só cria se NÃO existir
export async function ensureUserExists(name, email, password) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`[Helper] Criando usuário base: ${email}`);
    return await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
  }
  
  return existingUser; // Se já existe, só devolve e segue o jogo sem gravar nada
}

// Helper 2 (Para Testes de Cadastro): Garante que NÃO existe
export async function ensureUserDeleted(email) {
  await prisma.user.deleteMany({
    where: { email }
  });
}