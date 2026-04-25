import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Configura o adaptador do Postgres com a URL do banco Neon
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Instancia o Prisma utilizando o adaptador exigido pela versão 7
const prisma = new PrismaClient({ adapter });

export default prisma;