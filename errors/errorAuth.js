const { AUTH_ERROR } = require('./errors');

class ErrorAuth extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTH_ERROR;
  }
}

module.exports = ErrorAuth;
