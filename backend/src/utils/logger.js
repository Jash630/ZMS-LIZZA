const winston         = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')
const path            = require('path')

const { combine, timestamp, printf, colorize, errors } = winston.format

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'HH:mm:ss' }),
        logFormat
      ),
    }),
    new DailyRotateFile({
      filename:      path.join('logs', 'error-%DATE%.log'),
      datePattern:   'YYYY-MM-DD',
      level:         'error',
      maxFiles:      '14d',
      zippedArchive: true,
    }),
    new DailyRotateFile({
      filename:      path.join('logs', 'combined-%DATE%.log'),
      datePattern:   'YYYY-MM-DD',
      maxFiles:      '7d',
      zippedArchive: true,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join('logs', 'exceptions.log') })
  ],
})

module.exports = logger