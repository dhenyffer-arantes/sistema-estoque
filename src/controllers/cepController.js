module.exports = {
  async buscarCep(req, res, next) {
    try {
      const { cep } = req.params;
      const cepLimpo = cep.replace(/\D/g, '');

      if (cepLimpo.length !== 8) {
        return res.status(400).json({ error: 'CEP inválido. Deve conter 8 dígitos.' });
      }

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        return res.status(404).json({ error: 'CEP não encontrado.' });
      }

      return res.json({
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf
      });
    } catch (err) {
      next(err);
    }
  }
};