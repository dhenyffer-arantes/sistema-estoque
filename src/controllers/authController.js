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
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, hashedPassword, role || 'USER']
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

      const validPassword = await bcrypt.compare(password, user.password_hash);
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
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'O e-mail é obrigatório.' });
      }

      const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      return res.json({ 
        message: 'Instruções para redefinição de senha enviadas para o e-mail.' 
      });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(400).json({ message: 'E-mail e nova senha são obrigatórios.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const updateRes = await db.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email',
        [hashedPassword, email]
      );

      if (updateRes.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      return res.json({ message: 'Senha alterada com sucesso.' });
    } catch (err) {
      next(err);
    }
  }
};