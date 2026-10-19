const { Router } = require('express');
const authController = require('../controllers/authController');

const routes = Router();

routes.post('/register', authController.register);
routes.post('/login', authController.login);
routes.post('/forgot-password', authController.forgotPassword);
routes.post('/reset-password', authController.resetPassword);

module.exports = routes;