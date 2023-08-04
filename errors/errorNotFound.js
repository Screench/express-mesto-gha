const { DOCUMENT_NOT_FOUND_ERROR } = require('./errors');

class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DOCUMENT_NOT_FOUND_ERROR;
  }
}

module.exports = ErrorNotFound;
