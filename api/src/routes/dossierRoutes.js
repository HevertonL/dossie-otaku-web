import { Router } from 'express';
import DossierController from '../controllers/DossierController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /dossiers:
 *   post:
 *     summary: Publica um novo dossiê (review) para um anime
 *     tags: [Dossiês]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animeId
 *               - rating
 *               - text
 *               - hasSpoiler
 *             properties:
 *               animeId:
 *                 type: integer
 *                 example: 20
 *               rating:
 *                 type: integer
 *                 description: Nota do anime de 1 a 5
 *                 example: 5
 *               text:
 *                 type: string
 *                 example: "A evolução dos personagens é incrível!"
 *               hasSpoiler:
 *                 type: boolean
 *                 example: false
 *               status:
 *                 type: string
 *                 description: Status opcional do usuário com a obra
 *                 example: "Concluído"
 *     responses:
 *       201:
 *         description: Dossiê publicado com sucesso.
 *       400:
 *         description: Campos obrigatórios ausentes ou nota fora do padrão (1 a 5).
 *       401:
 *         description: Token não fornecido ou inválido.
 *       409:
 *         description: Dossiê já existente para este anime.
 */
router.post('/', authMiddleware, DossierController.create);

/**
 * @swagger
 * /dossiers/anime/{animeId}:
 *   get:
 *     summary: Lista todos os dossiês publicados para um anime específico
 *     tags: [Dossiês]
 *     parameters:
 *       - in: path
 *         name: animeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do anime na Jikan API
 *     responses:
 *       200:
 *         description: Lista de dossiês retornada com sucesso.
 *       401:
 *         description: Token não fornecido ou inválido.
 */
router.get('/anime/:animeId', DossierController.listByAnime);

export default router;