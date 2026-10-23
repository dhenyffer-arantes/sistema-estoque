const productRepository = require('../repositories/productRepository');

module.exports = {
  async list(req, res, next) {
    try {
      const products = await productRepository.findAll();
      return res.json(products);
    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productRepository.findById(id);
      if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });
      return res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { codigo_barras, nome, preco, estoque } = req.body;
      if (!codigo_barras || !nome || preco === undefined) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
      }

      const exists = await productRepository.findByCodigoBarras(codigo_barras);
      if (exists) return res.status(400).json({ message: 'Código de barras já cadastrado.' });

      const product = await productRepository.create({ codigo_barras, nome, preco, estoque: estoque || 0 });
      return res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { codigo_barras, nome, preco, estoque } = req.body;

      const product = await productRepository.findById(id);
      if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });

      const updated = await productRepository.update(id, {
        codigo_barras: codigo_barras || product.codigo_barras,
        nome: nome || product.nome,
        preco: preco !== undefined ? preco : product.preco,
        estoque: estoque !== undefined ? estoque : product.estoque
      });

      return res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productRepository.findById(id);
      if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });

      await productRepository.delete(id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};