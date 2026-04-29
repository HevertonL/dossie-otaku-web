import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import animeRoutes from './routes/animeRoutes.js';
import { setupSwagger } from './swagger.js';

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/assets', express.static('public/assets'));

setupSwagger(app);

// Rota de teste
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Dossiê Otaku API online e operante! 🚀' });
});

// Nossas Rotas da Aplicação
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/animes', animeRoutes);

export default app;