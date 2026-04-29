import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Verton
 *               email:
 *                 type: string
 *                 example: verton@dossieotaku.com
 *               password:
 *                 type: string
 *                 example: senha_super_segura_123
 *     responses:
 *       201:
 *         description: Otaku cadastrado com sucesso!
 *       400:
 *         description: Nome, email e senha são obrigatórios.
 *       409:
 *         description: Este e-mail já está em uso.
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Retorna os dados do perfil do usuário autenticado
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 */

router.get('/profile', authMiddleware, UserController.getProfile);
router.post('/register', UserController.register);

export default router;