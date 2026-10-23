const { Router } = require('express');
const vendaController = require('../controllers/vendaController');
const { authenticateToken } = require('../middlewares/auth');

const routes = Router();

routes.post('/', authenticateToken, vendaController.create);
routes.get('/', authenticateToken, vendaController.list);

module.exports = routes;