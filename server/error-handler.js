const logger = require('./logger.js');

// Middleware to log and sanitize errors
const errorHandler = (error, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error(error.message);
  switch (error.name) {
    case 'ValidationError':
      res.status(400).send(`Validation error(s): ${error.errors}`);
      break;
    default:
      res.status(500).send('An unexpected error was encountered');
      break;
  }
};

// Wraps async request handlers to ensure next is called
const asyncMiddleware = (f) => (
  (req, res, next) => Promise
    .resolve(f(req, res, next))
    .catch((error) => next(error))
);

module.exports = { errorHandler, asyncMiddleware };
