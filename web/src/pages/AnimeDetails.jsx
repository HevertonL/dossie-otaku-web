import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { api } from '../services/api.js';

export default function AnimeDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [anime, setAnime] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nota, setNota] = useState(5);
  const [texto, setTexto] = useState('');
  const [spoiler, setSpoiler] = useState(false);
  const [statusView, setStatusView] = useState('Assistindo');

  const token = localStorage.getItem('token');
  const userLogado = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!token;

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [animeResponse, dossiersResponse] = await Promise.all([
          api.get(`/animes/${id}`),
          api.get(`/dossiers/anime/${id}`)
        ]);

        setAnime(animeResponse.data);
        setDossiers(dossiersResponse.data);
      } catch (error) {
        console.error("Erro ao buscar os detalhes do anime ou dossiês:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [id]);

  const handleSubmitDossier = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        '/dossiers',
        {
          animeId: Number(id),
          rating: Number(nota),
          text: texto,
          hasSpoiler: spoiler,
          status: statusView
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Busca a lista atualizada do banco, já perfeitamente populada
      const dossiersResponse = await api.get(`/dossiers/anime/${id}`);
      setDossiers(dossiersResponse.data);

      setTexto('');
      setNota(5);
      setSpoiler(false);

    } catch (error) {
      console.error("Erro ao enviar dossiê:", error);

      const mensagemDoBackend = error.response?.data?.error
        || error.response?.data?.message
        || "Erro desconhecido ao tentar publicar.";

      alert(`Atenção: ${mensagemDoBackend}`);
    }
  };

  if (loading) {
    return (
      <div data-cy="anime-details-loading" className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p>Abrindo os arquivos...</p>
      </div>
    );
  }

  if (!anime) {
    return <div data-cy="anime-not-found" className="min-h-screen bg-[#0a0a0a] text-white flex justify-center items-center">Anime não encontrado.</div>;
  }

  return (
    <div className="w-full py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* COLUNA ESQUERDA: INFORMAÇÕES DO ANIME */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="w-full aspect-3/4 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 relative">
            <img
              src={anime.imageUrl || anime.images?.jpg?.large_image_url || 'https://via.placeholder.com/400x600?text=Sem+Capa'}
              alt={`Capa de ${anime.title}`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 data-cy="anime-title" className="text-2xl font-bold">{anime.title}</h1>
          <div className="flex flex-wrap gap-2">
            {anime.genres && anime.genres.map(genre => (
              <span key={genre.mal_id || genre.id || genre} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm">
                {genre.name || genre}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-sm">Status: {anime.status || 'Desconhecido'}</p>
          <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4 whitespace-pre-line">
            {anime.synopsis || 'Sinopse não disponível para esta obra.'}
          </p>
        </div>

        {/* COLUNA DIREITA: DOSSIÊS DA COMUNIDADE E FORMULÁRIO */}
        <div className="md:col-span-2 flex flex-col gap-8">

          {/* SEÇÃO DO FORMULÁRIO */}
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-500 pl-3">Publicar Dossiê</h2>

            {isAuthenticated ? (
              <form data-cy="dossier-form" onSubmit={handleSubmitDossier} className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-2">Nota</label>
                    <div className="flex gap-2 items-center h-10.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          data-cy={`star-rating-${star}`} // <-- Mapeamento dinâmico para o Cypress clicar na nota exata
                          onClick={() => setNota(star)}
                          className={`text-3xl transition-colors focus:outline-none drop-shadow-md hover:scale-110 active:scale-95 ${star <= nota ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500/50'
                            }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <select data-cy="dossier-status-select" value={statusView} onChange={e => setStatusView(e.target.value)} className="w-full p-2 rounded bg-black/50 border border-white/20 text-white focus:border-blue-500 outline-none">
                      <option value="Assistindo">Assistindo</option>
                      <option value="Finalizado">Finalizado</option>
                      <option value="Dropado">Dropado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Sua Análise</label>
                  <textarea data-cy="dossier-review-textarea" rows="4" value={texto} onChange={e => setTexto(e.target.value)} className="w-full p-2 rounded bg-black/50 border border-white/20 text-white focus:border-blue-500 outline-none" placeholder="O que você achou desta obra?" required></textarea>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input data-cy="dossier-spoiler-checkbox" type="checkbox" checked={spoiler} onChange={e => setSpoiler(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                    <span className="text-sm text-gray-300">Contém Spoiler</span>
                  </label>
                  <button data-cy="dossier-submit-button" type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-bold transition-colors shadow-lg">
                    Publicar
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 bg-black/30 rounded border border-white/5">
                <p className="text-gray-400 mb-2">Você precisa estar logado para abrir um dossiê.</p>
                <Link
                  to="/login"
                  data-cy="dossier-login-link"
                  state={{ from: location.pathname }}
                  className="text-blue-400 hover:text-blue-300 underline font-semibold"
                >
                  Fazer Login
                </Link>
              </div>
            )}
          </div>

          {/* LISTA DE REVIEWS DA COMUNIDADE */}
          <div>
            <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-500 pl-3">Dossiês da Comunidade</h2>
            <div data-cy="dossier-list" className="flex flex-col gap-4">
              {dossiers.length > 0 ? (
                dossiers.map((dossier) => (
                  <div key={dossier.id || dossier._id} data-cy="dossier-card" className="bg-white/5 p-4 rounded-lg border border-white/10 transition-colors hover:border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-blue-400">{dossier.user?.name || 'Usuário'}</span>
                      <span className="text-yellow-400 font-bold">★ {dossier.rating}</span>
                    </div>

                    {dossier.hasSpoiler && (
                      <div className="mb-2 inline-block bg-red-600/20 border border-red-500/30 text-red-400 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                        Alerta de Spoiler
                      </div>
                    )}

                    <p className="text-gray-300 text-sm whitespace-pre-line">{dossier.text}</p>

                    <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500 flex gap-2">
                      <span>Status: {dossier.status}</span>
                      <span>•</span>
                      <span>{new Date(dossier.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p data-cy="dossier-empty-message" className="text-gray-500 italic">Nenhum dossiê publicado para esta obra ainda. Seja o primeiro!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}