const { Pool } = require('pg');

// Prioriza a DATABASE_URL do Render; se não existir, usa as variáveis locais
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Obrigatório para conexões no Render
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'suasenha',
      database: process.env.DB_NAME || 'sistema_estoque',
      port: process.env.DB_PORT || 5432,
    });

module.exports = {
  query: (text, params) => pool.query(text, params),
};