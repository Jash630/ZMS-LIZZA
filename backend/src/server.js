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
const authRoutes         = require('./routes/authRoutes')
const postRoutes         = require('./routes/postRoutes')
const commentRoutes      = require('./routes/commentRoutes')
const leadRoutes         = require('./routes/leadRoutes')
const userRoutes         = require('./routes/userRoutes')
const mediaRoutes        = require('./routes/mediaRoutes')
const analyticsRoutes    = require('./routes/analyticsRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const seoRoutes          = require('./routes/seoRoutes')

// ── Connect Database ──────────────────────────────────
connectDB()

const app = express()

// ── Security Middleware ───────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
app.use(`${API}/auth`,          authRoutes)
app.use(`${API}/posts`,         postRoutes)
app.use(`${API}/comments`,      commentRoutes)
app.use(`${API}/leads`,         leadRoutes)
app.use(`${API}/users`,         userRoutes)
app.use(`${API}/media`,         mediaRoutes)
app.use(`${API}/analytics`,     analyticsRoutes)
app.use(`${API}/notifications`, notificationRoutes)
app.use(`${API}/seo`,           seoRoutes)

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