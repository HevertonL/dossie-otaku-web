import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json()); 

// Rota de teste
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Dossiê Otaku API online e operante! 🚀' });
});

// Nossas Rotas da Aplicação
app.use('/users', userRoutes);

export default app;