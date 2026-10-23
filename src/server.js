const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const vendaRoutes = require('./routes/vendaRoutes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/vendas', vendaRoutes);

app.get('/', (req, res) => {
  return res.json({ status: 'OK', message: 'API do Sistema de Estoque completa!' });
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});