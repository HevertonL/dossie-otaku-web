import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

 /**
  * @swagger
  * /auth/login:
  *   post:
  *     summary: Autentica um usuário e retorna o Token JWT
  *     tags:
  *       - Auth
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - email
  *               - password
  *             properties:
  *               email:
  *                 type: string
  *                 example: verton@dossieotaku.com
  *               password:
  *                 type: string
  *                 example: senha_super_segura_123
  *     responses:
  *       200:
  *         description: Acesso liberado! Retorna o token JWT e dados do usuário.
  *       400:
  *         description: E-mail e senha são obrigatórios.
  *       401:
  *         description: Credenciais inválidas.
  *       500:
  *         description: Erro interno no servidor.
  */

router.post('/login', AuthController.login);

export default router;