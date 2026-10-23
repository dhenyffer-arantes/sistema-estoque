const db = require('../database');

module.exports = {
  async create(req, res, next) {
    try {
      const { itens } = req.body;
      const usuario_id = req.user.id;

      if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ message: 'A venda deve possuir pelo menos um item.' });
      }

      await db.query('BEGIN');

      const vendaRes = await db.query(
        'INSERT INTO vendas (usuario_id) VALUES ($1) RETURNING *',
        [usuario_id]
      );
      const venda = vendaRes.rows[0];

      for (const item of itens) {
        const { produto_id, quantidade } = item;

        const prodRes = await db.query('SELECT * FROM products WHERE id = $1', [produto_id]);
        if (prodRes.rows.length === 0) {
          await db.query('ROLLBACK');
          return res.status(404).json({ message: `Produto ID ${produto_id} não encontrado.` });
        }

        const produto = prodRes.rows[0];

        if (produto.estoque < quantidade) {
          await db.query('ROLLBACK');
          return res.status(400).json({ 
            message: `Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.estoque}` 
          });
        }

        await db.query(
          'INSERT INTO item_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)',
          [venda.id, produto_id, quantidade, produto.preco]
        );

        await db.query(
          'UPDATE products SET estoque = estoque - $1, updated_at = NOW() WHERE id = $2',
          [quantidade, produto_id]
        );
      }

      await db.query('COMMIT');

      return res.status(201).json({ message: 'Venda realizada com sucesso!', venda_id: venda.id });
    } catch (err) {
      await db.query('ROLLBACK');
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const result = await db.query(`
        SELECT v.id, v.data, u.name as usuario,
               json_agg(json_build_object('produto', p.nome, 'quantidade', iv.quantidade, 'preco_unitario', iv.preco_unitario)) as itens
        FROM vendas v
        LEFT JOIN users u ON v.usuario_id = u.id
        JOIN item_venda iv ON iv.venda_id = v.id
        JOIN products p ON iv.produto_id = p.id
        GROUP BY v.id, u.name
        ORDER BY v.data DESC
      `);
      return res.json(result.rows);
    } catch (err) {
      next(err);
    }
  }
};