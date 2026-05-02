import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import AnimeDetails from './pages/AnimeDetails';
import Header from './pages/Header';


function App() {
  return (
    <BrowserRouter>
      {/* Wrapper principal: tela inteira escura */}
      <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans overflow-x-hidden>">
        <Header />
        {/* Container limpo para as rotas, sem o fundo cinza duplicado */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;