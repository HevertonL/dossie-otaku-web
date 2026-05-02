import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  
  // Lê os dados do usuário que salvamos no Login
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    // Limpa o cofre
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Manda para a Home e força um refresh para limpar os estados
    navigate('/');
    window.location.reload(); 
  };

  return (
    <header className="w-full bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* VOLTAR PARA A HOME FÁCIL */}
      <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
        Dossiê<span className="text-blue-500">Otaku</span>
      </Link>

      {/* ÁREA DO USUÁRIO E LOGOUT */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Ícone genérico com a inicial do nome */}
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-gray-200 hidden md:block">Olá, {user.name}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 px-3 py-1 rounded transition-colors"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold transition-colors shadow-lg"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}