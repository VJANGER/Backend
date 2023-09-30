const { createLogger, transports, format } = require('winston');

const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

const developmentLogger = createLogger({
  levels,
  format: format.combine(
    format.colorize(),
    format.simple()
  ),
  transports: [new transports.Console()],
});

const productionLogger = createLogger({
  levels,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'errors.log', level: 'error' }),
    new transports.Console({ level: 'info' }),
  ],
});

module.exports = {
  developmentLogger,
  productionLogger,
};
