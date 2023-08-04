const { FORBIDDEN_ERROR } = require('./errors');

class ErrorForbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

module.exports = ErrorForbidden;
