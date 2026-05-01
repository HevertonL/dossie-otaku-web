import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import bgImg from '../assets/fundo.png';
import logoImg from '../assets/logo.png';

export default function Login() {
  const navigate = useNavigate(); // Inicializando o hook para navegação programática
  // Criação dos estados para armazenar o que o usuário digita
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função disparada quando o formulário é enviado
  const handleLogin = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página (comportamento padrão do HTML)
    
    // "Pacote" que vai para o seu Backend
    const payload = {
      email: email,
      password: senha
    };

    try {
      // CA: Integrar formulário de login com a API
      const response = await api.post('/auth/login', payload);
      
      // CA: Salvar o Token JWT no LocalStorage
      const token = response.data.token; // Confirme se o seu backend devolve como 'token'
      localStorage.setItem('@dossieOtaku:token', token); 
      
      // CA: Redirecionar para a Home
      navigate('/');
      
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Email ou senha inválidos. Tente novamente!");
    }
  };

  return (
    <div
      className="h-dvh w-screen bg-cover bg-center bg-no-repeat fixed top-0 left-0 flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="z-10 w-full max-w-sm bg-black/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 flex flex-col gap-6">

        <img src={logoImg} alt="Dossiê Otaku Logo" className="w-48 mx-auto drop-shadow-2xl" />

        {/*Troca da tag form para escutar o onSubmit */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
          <div>
            <input
              type="email"
              placeholder="✉️ Email"
              value={email} // Ligamos o input ao estado
              onChange={(e) => setEmail(e.target.value)} // Atualizamos o estado a cada letra digitada
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all"
              required // Validação básica do HTML
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="🔒 Senha"
              value={senha} // Ligamos o input ao estado
              onChange={(e) => setSenha(e.target.value)} // Atualizamos o estado a cada letra digitada
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all"
              required
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Esqueceu sua senha?</a>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-2xl transition-colors shadow-lg shadow-blue-600/30"
          >
            Entrar
          </button>

          <p className="text-center text-gray-300 mt-2 text-sm">
            Não tem uma conta? <Link to="/cadastro" className="text-white font-semibold hover:underline">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}