const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configuração do Transportador de E-mail (Ex: Mailtrap)
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  port: process.env.MAIL_PORT || 2525,
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || ''
  }
});

module.exports = {
  // 1. Cadastro de Usuário
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
      }

      const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'E-mail já cadastrado.' });
      }

      const password_hash = await bcrypt.hash(password, 8);
      const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

      const newUser = await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, password_hash, userRole]
      );

      return res.status(201).json(newUser.rows[0]);
    } catch (err) {
      next(err);
    }
  },

  // 2. Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      return res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token
      });
    } catch (err) {
      next(err);
    }
  },

  // 3. Esqueci Minha Senha (Envio de E-mail)
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const userResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        return res.json({ message: 'Se o e-mail estiver cadastrado, um token de recuperação será enviado.' });
      }

      const userId = userResult.rows[0].id;
      const token = crypto.randomBytes(20).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

      await db.query(
        'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt]
      );

      await transporter.sendMail({
        from: process.env.MAIL_FROM || 'no-reply@estoque.com',
        to: email,
        subject: 'Recuperação de Senha',
        text: `Utilize este token para redefinir sua senha: ${token}`
      });

      return res.json({ message: 'Se o e-mail estiver cadastrado, um token de recuperação será enviado.' });
    } catch (err) {
      next(err);
    }
  },

  // 4. Redefinir Senha com Token
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      const resetResult = await db.query(
        'SELECT * FROM password_resets WHERE token = $1 AND used = FALSE AND expires_at > NOW()',
        [token]
      );

      if (resetResult.rows.length === 0) {
        return res.status(400).json({ message: 'Token inválido ou expirado.' });
      }

      const resetRequest = resetResult.rows[0];
      const password_hash = await bcrypt.hash(newPassword, 8);

      await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, resetRequest.user_id]);
      await db.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [resetRequest.id]);

      return res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (err) {
      next(err);
    }
  }
};