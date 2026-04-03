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
module.exports = {
  publicCommentCreateLimiter,
  publicLeadCreateLimiter,
  publicSubscribeLimiter,
}

