const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const auth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new AuthError('Пожалуйста, авторизуйтесь');
    }

    const payload = jwt.verify(token, 'SECRET_KEY');
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
