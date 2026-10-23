const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

module.exports = {
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
      }

      const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'E-mail já cadastrado.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, hashedPassword, role || 'user']
      );

      return res.status(201).json(newUser.rows[0]);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const user = userRes.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
      );

      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      next(err);
    }
  }
};