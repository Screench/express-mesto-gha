const jwt = require('jsonwebtoken');
const ErrorAuth = require('../errors/errorAuth');

const auth = (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    if (!token) {
      throw new ErrorAuth('Пожалуйста, авторизуйтесь');
    }

    let payload = jwt.verify(token, 'SECRET');
    req.user = payload;
    next();
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
};

module.exports = auth;