import prisma from '../services/prisma.js';

class DossierController {
  async create(req, res) {
    try {
      const userId = req.user.id; // O ID seguro que vem do nosso Middleware de Autenticação
      const { animeId, rating, text, hasSpoiler, status } = req.body;


      // Validação de campos obrigatórios do CA
      if (!animeId || rating === undefined || !text || hasSpoiler === undefined) {
        return res.status(400).json({ error: 'Os campos animeId, rating, text e hasSpoiler são obrigatórios.' });
      }

      // Validação da regra de negócio: rating de 1 a 5
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'A nota (rating) deve ser entre 1 e 5.' });
      }

      // O usuário só pode ter um dossiê por anime.
      const existingDossier = await prisma.dossier.findFirst({
        where: { userId, animeId }
      });

      if (existingDossier) {
        return res.status(409).json({ error: 'Você já publicou um dossiê para este anime. Tente atualizá-lo.' });
      }

      const dossier = await prisma.dossier.create({
        data: {
          userId,
          animeId,
          rating,
          text,
          hasSpoiler,
          status
        }
      });

      return res.status(201).json({ message: 'Dossiê publicado com sucesso!', dossier });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao publicar o dossiê.' });
    }
  }

  async listByAnime(req, res) {
    try {
      const { animeId } = req.params;

      const dossiers = await prisma.dossier.findMany({
        where: { animeId: parseInt(animeId) },
        include: {
          user: {
            select: { name: true } // Traz apenas o nome do autor do dossiê (sem expor e-mail ou dados sensíveis)
          }
        },
        orderBy: { createdAt: 'desc' } // Mostra os mais recentes primeiro
      });

      return res.status(200).json(dossiers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao buscar os dossiês.' });
    }
  }
}

export default new DossierController();