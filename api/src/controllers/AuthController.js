import prisma from '../services/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Validação básica
      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      }

      // 2. Busca o usuário no banco
      const user = await prisma.user.findUnique({ where: { email } });
      
      // Se o usuário não existir, retornamos 401 Unauthorized (sem dar pistas se o erro é no email ou na senha)
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // 3. Compara a senha enviada com o hash salvo no banco
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      // 4. Gera o Token JWT
      // O primeiro parâmetro é o Payload (dados públicos que vão dentro do token)
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // O token expira em 1 dia
      );

      // 5. Retorna o sucesso ocultando a senha
      return res.status(200).json({
        message: 'Acesso liberado!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  }
}

export default new AuthController();