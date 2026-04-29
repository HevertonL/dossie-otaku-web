class AnimeController {
  async search(req, res) {
    try {
      const { q } = req.query; // Pega o que o usuário digitou na busca (ex: ?q=naruto)

      if (!q) {
        return res.status(400).json({ error: 'O termo de busca (q) é obrigatório.' });
      }

      // Faz a requisição para a Jikan API (limitando a 10 resultados para ser rápido)
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${q}&limit=10`);
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Erro ao buscar dados na Jikan API.' });
      }

      // Mapeamos para devolver um array limpo apenas com o que importa para o MVP
      const animes = data.data.map(anime => ({
        id: anime.mal_id,
        title: anime.title,
        synopsis: anime.synopsis,
        episodes: anime.episodes,
        score: anime.score, // Nota global (MyAnimeList)
        imageUrl: anime.images?.jpg?.image_url,
      }));

      return res.status(200).json(animes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor ao buscar animes.' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      const data = await response.json();

      if (response.status === 404) {
        return res.status(404).json({ error: 'Anime não encontrado.' });
      }

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Erro ao buscar detalhes na Jikan API.' });
      }

      const anime = data.data;
      const details = {
        id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english,
        synopsis: anime.synopsis,
        episodes: anime.episodes,
        status: anime.status,
        aired: anime.aired?.string,
        score: anime.score,
        imageUrl: anime.images?.jpg?.large_image_url,
        trailerUrl: anime.trailer?.url,
        genres: anime.genres?.map(g => g.name)
      };

      return res.status(200).json(details);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno no servidor ao buscar detalhes.' });
    }
  }
}

export default new AnimeController();