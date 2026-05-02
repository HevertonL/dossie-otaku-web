import axios from 'axios';

// 1. Criamos uma configuração centralizada com o "crachá" para o Cloudflare não bloquear
const jikanConfig = {
  headers: {
    'User-Agent': 'DossierOtakuWeb/1.0 (teste_automacao@dossie.com)' 
  }
};

class AnimeController {
  async search(req, res) {
    try {
      const { q } = req.query; 

      if (!q) {
        return res.status(400).json({ error: 'O termo de busca é obrigatório.' });
      }

      // 2. Usando axios com a nossa configuração de headers
      const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${q}&limit=10`, jikanConfig);
      
      // O Axios já entrega o JSON pronto dentro de response.data
      const data = response.data; 

      const animes = data.data.map(anime => ({
        id: anime.mal_id,
        title: anime.title,
        synopsis: anime.synopsis,
        episodes: anime.episodes,
        score: anime.score, 
        imageUrl: anime.images?.jpg?.image_url,
      }));

      return res.status(200).json(animes);
    } catch (error) {
      console.error("Erro no search:", error.message);
      
      // Se a Jikan retornar erro, o Axios captura aqui em error.response
      const statusCode = error.response ? error.response.status : 500;
      return res.status(statusCode).json({ error: 'Erro ao buscar dados na Jikan API.' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`, jikanConfig);
      const data = response.data;

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
      console.error("Erro no getById:", error.message);
      
      // O Axios joga direto pro catch quando a Jikan não encontra o anime (404)
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'Anime não encontrado.' });
      }
      
      return res.status(500).json({ error: 'Erro interno no servidor ao buscar detalhes.' });
    }
  }

  async getTopAnimes(req, res) {
    try {
      console.log("📡 Buscando destaques na Jikan...");
      // Adicionamos a configuração aqui também para prevenir bloqueios futuros
      const response = await axios.get('https://api.jikan.moe/v4/top/anime', jikanConfig);
      
      if (!response.data || !response.data.data) {
        throw new Error("Formato de resposta inválido da Jikan");
      }

      const animes = response.data.data.map(anime => ({
        id: anime.mal_id,
        title: anime.title,
        imageUrl: anime.images?.jpg?.large_image_url || 'https://via.placeholder.com/300x400',
        score: anime.score || 0
      }));

      console.log("✅ Destaques mapeados com sucesso!");
      return res.json(animes);

    } catch (error) {
      console.error("❌ Erro no Controller getTopAnimes:", error.message);
      
      return res.status(500).json({ 
        error: "Erro interno ao buscar destaques",
        details: error.message 
      });
    }
  }
}

export default new AnimeController();