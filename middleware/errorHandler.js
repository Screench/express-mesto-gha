const { UNKNOWN_ERROR } = require('../errors/errors');

const errorHandler = (err, req, res, next) => {
  const { statusCode = UNKNOWN_ERROR } = err;
  const message = statusCode === UNKNOWN_ERROR ? 'Ошибка сервера' : err.message;

  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
