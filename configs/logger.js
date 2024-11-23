// /config/logger.js
const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    // You can add file transport if needed
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

module.exports = logger;
