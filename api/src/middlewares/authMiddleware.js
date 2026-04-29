import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  // Pega o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // O padrão é "Bearer token_gigante_aqui", então dividimos a string
  const [, token] = authHeader.split(' ');

  try {
    // Tenta decodificar usando a nossa chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Injeta os dados do usuário na requisição para o Controller usar
    req.user = { id: decoded.id, email: decoded.email };
    
    // Libera a passagem!
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}