const { UNKNOWN_ERROR } = require('./errors');

class UnknownError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNKNOWN_ERROR;
  }
}

module.exports = UnknownError;
