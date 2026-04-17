const rateLimit = require('express-rate-limit')

const publicCommentCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many comments from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const publicLeadCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many enquiries from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})


const publicSubscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many subscribe attempts from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const adminWriteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many write operations. Please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const mediaUploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 8,
  message: { success: false, message: 'Too many upload attempts. Please try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many password change attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = {
  publicCommentCreateLimiter,
  publicLeadCreateLimiter,
  publicSubscribeLimiter,
  adminWriteLimiter,
  mediaUploadLimiter,
  passwordChangeLimiter,
}

