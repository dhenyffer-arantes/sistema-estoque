const { Router } = require('express');
const productController = require('../controllers/productController');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');

const routes = Router();

routes.get('/', authenticateToken, productController.list);
routes.get('/:id', authenticateToken, productController.show);
routes.post('/', authenticateToken, authorizeAdmin, productController.create);
routes.put('/:id', authenticateToken, authorizeAdmin, productController.update);
routes.delete('/:id', authenticateToken, authorizeAdmin, productController.delete);

module.exports = routes;