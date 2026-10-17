const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Rota de Teste de Saúde da API
app.get('/', (req, res) => {
  return res.json({ 
    status: 'OK', 
    message: 'API do Sistema de Gerenciamento de Estoque está ativa!' 
  });
});

// Middleware Global de Tratamento de Erros (Requisito 2.5)
app.use((err, req, res, next) => {
  console.error(err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});