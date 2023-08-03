const { INCORRECT_DATA_ERROR } = require('./errors')

class ErrorValidation extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INCORRECT_DATA_ERROR;
  }
}

module.exports = ErrorValidation;
