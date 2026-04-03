const crypto = require('crypto')
const Post = require('../models/Post')
const Product = require('../models/Product')
const ContentView = require('../models/ContentView')

const CONTENT_MODELS = {
  post: Post,
  product: Product,
}

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  return req.ip || req.socket?.remoteAddress || 'unknown'
}

const getDateKeyUTC = (date) => date.toISOString().slice(0, 10)

const buildFingerprint = (req) => {
  const ip = getClientIp(req)
  const userAgent = req.get('user-agent') || 'unknown'
  const salt = process.env.VIEW_FINGERPRINT_SALT || 'zms-lizza'
  return crypto.createHash('sha256').update(`${ip}|${userAgent}|${salt}`).digest('hex')
}

const trackUniqueView = async ({ contentType, contentId, req }) => {
  const Model = CONTENT_MODELS[contentType]
  if (!Model) {
    throw new Error(`Unsupported content type for view tracking: ${contentType}`)
  }

  const viewedAt = new Date()
  const dateKey = getDateKeyUTC(viewedAt)
  const fingerprintHash = buildFingerprint(req)

  try {
    await ContentView.create({ contentType, contentId, dateKey, fingerprintHash, viewedAt })
    await Model.findByIdAndUpdate(contentId, { $inc: { views: 1 } })
    return { counted: true }
  } catch (err) {
    if (err?.code === 11000) {
      return { counted: false }
    }
    throw err
  }
}

module.exports = { trackUniqueView, getClientIp }
