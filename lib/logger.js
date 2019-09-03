const logger = require('heroku-logger');

module.exports = {
  logger,
  within: prefix => logger.clone({ prefix: `[${prefix}] ` }),
};
