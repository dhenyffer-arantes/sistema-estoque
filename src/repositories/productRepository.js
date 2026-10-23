const db = require('../database');

module.exports = {
  async findAll() {
    const result = await db.query('SELECT * FROM products ORDER BY id ASC');
    return result.rows;
  },

  async findById(id) {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByCodigoBarras(codigo_barras) {
    const result = await db.query('SELECT * FROM products WHERE codigo_barras = $1', [codigo_barras]);
    return result.rows[0];
  },

  async create({ codigo_barras, nome, preco, estoque }) {
    const result = await db.query(
      'INSERT INTO products (codigo_barras, nome, preco, estoque) VALUES ($1, $2, $3, $4) RETURNING *',
      [codigo_barras, nome, preco, estoque]
    );
    return result.rows[0];
  },

  async update(id, { codigo_barras, nome, preco, estoque }) {
    const result = await db.query(
      'UPDATE products SET codigo_barras = $1, nome = $2, preco = $3, estoque = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [codigo_barras, nome, preco, estoque, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM products WHERE id = $1', [id]);
  }
};