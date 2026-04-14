const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
  override: true,
})

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

const connectDB = require('./config/db')
const logger = require('./utils/logger')
const errorHandler = require('./middleware/errorHandler')
const AppError = require('./utils/AppError')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/admin')
const publicRoutes = require('./routes/public')

connectDB()

const app = express()

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)
const allowedOrigins = [
  "https://zmslizzafrontend.vercel.app",
  "https://zmslizzaadmin.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(mongoSanitize())

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
})
app.use('/api/v1/auth/login', authLimiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.http(msg.trim()) },
    })
  )
}

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'ZMS LIZZA API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

const API = '/api/v1'
app.use(`${API}/auth`, authRoutes)
app.use(`${API}/public`, publicRoutes)
app.use(API, adminRoutes)

app.all('*', (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404))
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  logger.info(`ZMS LIZZA API running on port ${PORT} in ${process.env.NODE_ENV} mode`)
  logger.info(`API base: http://localhost:${PORT}/api/v1`)
})

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})

module.exports = app
