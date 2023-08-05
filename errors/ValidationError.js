const { INCORRECT_DATA_ERROR } = require('./errors');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INCORRECT_DATA_ERROR;
  }
}

module.exports = ValidationError;
