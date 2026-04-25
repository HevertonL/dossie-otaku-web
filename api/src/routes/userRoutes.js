import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const router = Router();

// Rota POST para criar usuário
router.post('/register', UserController.register);

export default router;