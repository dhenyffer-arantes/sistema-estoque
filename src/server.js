const express = require('express');
require('dotenv').config();

// Importa as rotas de autenticação configuradas na Semana 3
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware para interpretar requisições com corpo em JSON
app.use(express.json());

// 1. Registro das Rotas de Autenticação (POST /auth/register, /auth/login, etc.)
app.use('/auth', authRoutes);

// Rota de teste simples para verificar se a API está online
app.get('/', (req, res) => {
  return res.json({ 
    status: 'OK', 
    message: 'API do Sistema de Estoque rodando com sucesso!' 
  });
});

// 2. Middleware Global de Tratamento de Erros (Requisito 2.5 do Desafio)
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor'
  });
});

// 3. Inicialização do Servidor na porta definida no arquivo .env ou 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});