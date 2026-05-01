import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import bgImg from '../assets/fundo.png';
import logoImg from '../assets/logo.png';

export default function Cadastro() {

  const navigate = useNavigate(); // Inicializando o hook para navegação programática
  // Estados para todos os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [termos, setTermos] = useState(false);

  // Função disparada ao submeter
  const handleCadastro = async (e) => {
    e.preventDefault();

    // Validação se as senhas coincidem
    if (senha !== confirmarSenha) {
      alert("Ops! As senhas não coincidem. Tente novamente.");
      return; // Para a execução aqui e não envia pra API
    }

    // Validação se os termos foram aceitos
    if (!termos) {
      alert("Você precisa aceitar os Termos de Uso para criar uma conta.");
      return;
    }

    // "Pacote" pronto para a API
    const payload = {
      name: nome,
      email: email,
      password: senha
    };

    try {
      // CA: Integrar formulário de cadastro com a API
      await api.post('/users/register', payload);

      alert("Conta ninja criada com sucesso!");
      navigate('/login'); // Manda o cara pro login

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert(error.response?.data?.message || "Erro no servidor ao tentar cadastrar.");
    }
  };

  const formularioValido = nome !== '' && email !== '' && senha !== '' && senha === confirmarSenha && termos;

  return (
    <div
      className="h-dvh w-screen bg-cover bg-center bg-no-repeat fixed top-0 left-0 flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="z-10 w-full max-w-md bg-black/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 flex flex-col gap-5">

        <img src={logoImg} alt="Dossiê Otaku Logo" className="w-36 mx-auto drop-shadow-2xl mb-2" />

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Criar Nova Conta</h2>
          <p className="text-gray-400 text-sm mt-1">Junte-se ao esquadrão Dossiê Otaku</p>
        </div>

        {/* Ligar o onSubmit na tag form */}
        <form onSubmit={handleCadastro} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="👤 Seu nome ninja"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-green-500 focus:bg-white/20 transition-all"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="✉️ Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-green-500 focus:bg-white/20 transition-all"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              placeholder="🔒 Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:border-green-500 focus:bg-white/20 transition-all"
              required
            />
            
            <input
              type="password"
              placeholder="🔁 Confirmar"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              // classe que muda a borda para vermelho se as senhas não coincidem, verde se coincidem, e cinza padrão
              className={`w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border transition-all focus:outline-none 
                ${confirmarSenha.length > 0 && senha !== confirmarSenha 
                  ? 'border-red-500 focus:border-red-500' 
                  : confirmarSenha.length > 0 && senha === confirmarSenha 
                    ? 'border-green-500 focus:border-green-500' 
                    : 'border-white/20 focus:border-green-500'
                }`}
              required
            />
          </div>

          {/* Adicionando mensagem de erro */}
          {confirmarSenha.length > 0 && senha !== confirmarSenha && (
            <span className="text-red-500 text-xs -mt-2 ml-1">
              ⚠️ As senhas ainda não coincidem.
            </span>
          )}

          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="termos"
              checked={termos}
              onChange={(e) => setTermos(e.target.checked)} // Checkbox usa .checked no lugar de .value
              className="w-4 h-4 accent-green-500 cursor-pointer"
            />
            <label htmlFor="termos" className="text-sm text-gray-300 cursor-pointer">
              Aceito os <span className="text-green-400 hover:underline">Termos de Uso</span> e <span className="text-green-400 hover:underline">Privacidade</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!formularioValido}
            className={`mt-2 w-full font-bold py-3 px-4 rounded-2xl transition-colors shadow-lg 
    ${formularioValido
                ? 'bg-green-600 hover:bg-green-500 text-white cursor-pointer shadow-green-600/30'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
          >
            Cadastrar
          </button>

          <p className="text-center text-gray-300 mt-2 text-sm">
            Já é um membro? <Link to="/login" className="text-green-400 font-semibold hover:underline">Faça login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}