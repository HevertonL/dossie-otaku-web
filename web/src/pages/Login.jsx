import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api.js';
import bgImg from '../assets/fundo.png';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const payload = {
      email: email,
      password: senha
    };

    try {
      const response = await api.post('/auth/login', payload);
      
      const token = response.data.token;
      localStorage.setItem('token', token); 
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate(from, { replace: true });
      
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

        {/* Adicionado data-cy no formulário */}
        <form onSubmit={handleLogin} data-cy="login-form" className="flex flex-col gap-4 mt-2">
          <div>
            <input
              type="email"
              data-cy="login-email-input" // Mapeamento para o Cypress
              placeholder="✉️ Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all"
              required
            />
          </div>

          <div>
            <input
              type="password"
              data-cy="login-password-input" // Mapeamento para o Cypress
              placeholder="🔒 Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all"
              required
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Esqueceu sua senha?</a>
          </div>

          <button
            type="submit"
            data-cy="login-submit-button" // Mapeamento para o Cypress
            className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-2xl transition-colors shadow-lg shadow-blue-600/30"
          >
            Entrar
          </button>

          <p className="text-center text-gray-300 mt-2 text-sm">
            Não tem uma conta? <Link to="/cadastro" data-cy="login-register-link" className="text-white font-semibold hover:underline">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}