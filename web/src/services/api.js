import axios from 'axios';

// Altere a URL base para a porta que o seu backend Node.js estiver rodando
export const api = axios.create({
  baseURL: 'http://localhost:3000', 
});