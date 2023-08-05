const jwt = require('jsonwebtoken');
const ErrorAuth = require('../errors/errorAuth');

const auth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new ErrorAuth('Пожалуйста, авторизуйтесь');
    }

    const payload = jwt.verify(token, 'SECRET_KEY');
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
