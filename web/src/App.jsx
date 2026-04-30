import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center">
        
        <h1 className="text-4xl font-bold text-blue-500 mb-8">
          Dossiê Otaku
        </h1>

        <main className="p-8 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <Routes>
            <Route path="/" element={<h2 className="text-xl">📺 Vitrine de Animes (Home)</h2>} />
            <Route path="/login" element={<h2 className="text-xl">🔑 Página de Login</h2>} />
            <Route path="/cadastro" element={<h2 className="text-xl">📝 Página de Cadastro</h2>} />
            <Route path="/anime/:id" element={<h2 className="text-xl">📂 Detalhes do Anime e Dossiês</h2>} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;