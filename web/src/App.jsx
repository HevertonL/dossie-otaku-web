import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      {/* Wrapper principal: tela inteira escura */}
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center pt-10">
        
        {/* Container limpo para as rotas, sem o fundo cinza duplicado */}
        <main className="w-full max-w-4xl p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/anime/:id" element={<h2 className="text-xl text-center">📂 Detalhes do Anime e Dossiês</h2>} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;