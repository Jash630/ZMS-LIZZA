require('dotenv').config()

const express       = require('express')
const cors          = require('cors')
const helmet        = require('helmet')
const morgan        = require('morgan')
const rateLimit     = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const path          = require('path')

const connectDB     = require('./config/db')
const logger        = require('./utils/logger')
const errorHandler  = require('./middleware/errorHandler')
const AppError      = require('./utils/AppError')

// ── Import Routes ─────────────────────────────────────
const authRoutes   = require('./routes/authRoutes')
const adminRoutes  = require('./routes/admin')
const publicRoutes = require('./routes/public')

// ── Connect Database ──────────────────────────────────
connectDB()

const app = express()

// ── Security Middleware ───────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

const defaultLocalOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '')

const envOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(normalizeOrigin).filter(Boolean)
  : process.env.CLIENT_URL
    ? [normalizeOrigin(process.env.CLIENT_URL)]
    : []

const corsOrigins = Array.from(
  new Set([
    ...envOrigins,
    ...(process.env.NODE_ENV === 'production' ? [] : defaultLocalOrigins.map(normalizeOrigin)),
  ])
)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    const normalized = normalizeOrigin(origin)
    if (corsOrigins.includes(normalized)) return cb(null, true)
    return cb(new AppError(`CORS blocked for origin: ${origin}`, 403))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(mongoSanitize())

// ── Rate Limiting ─────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message:  { success: false, message: 'Too many requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
})
app.use('/api', limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
})
app.use('/api/v1/auth/login', authLimiter)

// ── Body Parsers ──────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── HTTP Logger ───────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }))
}

// ── Static Files ──────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// ── Health Check ──────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({
    success:     true,
    message:     'ZMS LIZZA API is running',
    environment: process.env.NODE_ENV,
    timestamp:   new Date().toISOString(),
  })
})

// ── API Routes ────────────────────────────────────────
const API = '/api/v1'
app.use(`${API}/auth`, authRoutes)
app.use(`${API}/public`, publicRoutes)
app.use(API, adminRoutes)

// ── 404 Handler ───────────────────────────────────────
app.all('*', (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404))
})

// ── Global Error Handler ──────────────────────────────
app.use(errorHandler)

// ── Start Server ──────────────────────────────────────
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  logger.info(`🚀 ZMS LIZZA API running on port ${PORT} in ${process.env.NODE_ENV} mode`)
  logger.info(`📍 API Base: http://localhost:${PORT}/api/v1`)
})

// ── Graceful Shutdown ─────────────────────────────────
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})

module.exports = app
