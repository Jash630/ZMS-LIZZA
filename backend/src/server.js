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
const { startEmailWorker, stopEmailWorker } = require('./services/emailWorkerService')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/admin')
const publicRoutes = require('./routes/public')

connectDB()

const app = express()

app.set('trust proxy', 1)

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)
const normalizeOrigin = (value = '') => String(value).trim().replace(/\/$/, '').toLowerCase()

const isAllowedVercelPreviewOrigin = (origin) => {
  const normalized = normalizeOrigin(origin)
  return /^https:\/\/zmslizzafrontend(?:-[a-z0-9-]+)?\.vercel\.app$/.test(normalized)
    || /^https:\/\/zmslizzaadmin(?:-[a-z0-9-]+)?\.vercel\.app$/.test(normalized)
}

const defaultAllowedOrigins = [
  'https://zmslizzafrontend.vercel.app',
  'https://zmslizzaadmin.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
]

const envAllowedOrigins = String(process.env.CORS_ORIGINS || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)

const allowedOrigins = new Set(
  [...defaultAllowedOrigins, ...envAllowedOrigins].map((origin) => normalizeOrigin(origin))
)

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true)

    if (allowedOrigins.has(normalizeOrigin(origin)) || isAllowedVercelPreviewOrigin(origin)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(mongoSanitize())

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/v1/health',
})

const healthResponse = () => ({
  success: true,
  message: 'ZMS LIZZA API is running',
  timestamp: new Date().toISOString(),
})

app.get('/health', (req, res) => {
  res.json(healthResponse())
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
  res.json(healthResponse())
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
  logger.info(`API base: ${process.env.API_BASE_URL || 'https://zms-lizza-backend.onrender.com/api/v1'}`)
  startEmailWorker()
})

const gracefulShutdown = () => {
  stopEmailWorker()
  server.close(() => process.exit(0))
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

process.on('unhandledRejection', (err) => {
  stopEmailWorker()
  logger.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

process.on('uncaughtException', (err) => {
  stopEmailWorker()
  logger.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})

module.exports = app
