const { Router } = require('express');
const cepController = require('../controllers/cepController');

const router = Router();

router.get('/:cep', cepController.buscarCep);

module.exports = router;