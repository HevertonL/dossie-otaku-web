import prisma from '../services/prisma.js';
import bcrypt from 'bcryptjs';

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
      }

      // Verifica se o email já existe
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(409).json({ error: 'Este e-mail já está em uso.' });
      }

      // Criptografa a senha (salting de 10 rounds)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário no banco
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Retorna sucesso (removendo a senha do retorno por segurança)
      user.password = undefined;
      return res.status(201).json({ message: 'Otaku cadastrado com sucesso!', user });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  }

  async getProfile(req, res) {
    try {
      // O ID vem diretamente do token decodificado pelo middleware
      const userId = req.user.id;

      // Busca o usuário, mas exclui a senha do retorno por segurança
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  }
}

export default new UserController();