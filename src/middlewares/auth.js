const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Token inválido ou expirado.' });
    }
    req.user = user;
    next();
  });
}

function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Acesso restrito a administradores.' });
}

module.exports = { authenticateToken, authorizeAdmin };