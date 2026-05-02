import { Router } from 'express';
import AnimeController from '../controllers/AnimeController.js';

const router = Router();

/**
 * @swagger
 * /animes/search:
 *   get:
 *     summary: Busca animes por nome usando a Jikan API
 *     tags:
 *       - Animes
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: "Nome do anime para buscar (ex: naruto)"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de animes encontrada.
 *       400:
 *         description: O termo de busca é obrigatório.
 */

/**
 * @swagger
 * /animes/{id}:
 *   get:
 *     summary: Retorna os detalhes de um anime específico pelo ID
 *     tags:
 *       - Animes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do anime no MyAnimeList
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do anime retornados com sucesso.
 *       404:
 *         description: Anime não encontrado.
 */

router.get('/search', AnimeController.search);
router.get('/top', AnimeController.getTopAnimes);
router.get('/:id', AnimeController.getById);

export default router;