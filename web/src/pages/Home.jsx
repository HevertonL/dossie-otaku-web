import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerImg from '../assets/banner-home.png';
import { api } from '../services/api.js';

export default function Home() {
  const [busca, setBusca] = useState('');
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true); // Começa como true para o carregamento inicial
  const [buscaAtiva, setBuscaAtiva] = useState('');

  // Efeito para carregar os animes em destaque (Top Animes) ao iniciar
  useEffect(() => {
    const fetchDestaques = async () => {
      try {
        setLoading(true);
        // Batendo na sua rota de destaques do backend
        const response = await api.get('/animes/top'); 
        setAnimes(response.data.slice(0, 10)); // Exibimos os 10 primeiros
      } catch (error) {
        console.error("Erro ao carregar destaques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestaques();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!busca.trim()) return;

    try {
      setLoading(true);
      setBuscaAtiva(busca);
      const response = await api.get(`/animes/search?q=${busca}`);
      setAnimes(response.data); 
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Falha ao buscar os arquivos do Dossiê.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      
      {/* SEÇÃO HERO / BANNER DE TOPO */}
      <div 
        className="relative w-full h-[45vh] min-h-75 bg-cover bg-center bg-no-repeat flex items-center justify-center bg-gray-900"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        {/* Overlay escuro para destacar o texto sobre o banner */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-3xl px-4 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center drop-shadow-2xl">
            Qual dossiê você quer abrir hoje?
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-8 text-center">
            Pesquise por animes, análises e descubra novos universos.
          </p>

          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              data-testid="search-input"
              placeholder="Ex: Hunter x Hunter, One Piece, Re:Zero..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full py-4 pl-6 pr-16 text-lg rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all shadow-2xl"
            />
            <button
              type="submit"
              data-testid="search-button"
              disabled={loading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors shadow-lg ${
                loading ? 'bg-gray-500 cursor-wait' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* 2. SEÇÃO DE RESULTADOS (GRID) */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl md:text-2xl font-bold mb-8 border-l-4 border-blue-500 pl-3">
          {buscaAtiva ? `Resultados para "${buscaAtiva}"` : "Destaques da Comunidade"}
        </h2>

        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          data-testid="anime-grid"
        >
          
          {loading ? (
            // Skeletons de Loading
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="flex flex-col gap-2 animate-pulse">
                <div className="w-full aspect-3/4 bg-white/5 rounded-xl border border-white/10"></div>
                <div className="h-4 bg-white/10 rounded w-3/4 mt-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            ))
          ) : animes.length > 0 ? (
            animes.map((anime) => (
              <Link 
                to={`/anime/${anime.id}`} 
                key={anime.id} 
                data-testid={`anime-card-${anime.id}`}
                className="flex flex-col gap-2 group cursor-pointer transition-transform hover:-translate-y-2"
              >
                <div className="w-full aspect-3/4 rounded-xl overflow-hidden border border-white/10 group-hover:border-blue-500 transition-colors shadow-lg relative bg-gray-800">
                  <img 
                    src={anime.imageUrl || 'https://via.placeholder.com/300x400?text=Sem+Capa'} 
                    alt={`Capa de ${anime.title}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {anime.score && (
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded border border-yellow-500/30">
                      ★ {anime.score}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-100 mt-1 truncate group-hover:text-blue-400 transition-colors" title={anime.title}>
                  {anime.title}
                </h3>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400" data-testid="no-results">
              <p className="text-lg">Nenhum dossiê encontrado. Tente outro termo!</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}