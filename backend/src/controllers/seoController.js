const SeoSettings = require('../models/SeoSettings')
const AppError    = require('../utils/AppError')
const { sendSuccess } = require('../utils/apiResponse')

const SEO_KEYS = [
  'siteTitle',
  'siteDescription',
  'siteKeywords',
  'googleAnalyticsId',
  'googleSearchConsoleId',
  'robots',
  'trackedKeywords',
]

const pick = (source = {}, keys = []) => {
  const next = {}
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      next[key] = source[key]
    }
  }
  return next
}

const normalizeKeywords = (value) => {
  if (!Array.isArray(value)) return undefined

  const now = new Date()
  const keywords = []

  for (const item of value) {
    if (typeof item === 'string') {
      const keyword = item.trim()
      if (!keyword) continue
      keywords.push({ keyword, updatedAt: now })
      continue
    }

    if (item && typeof item === 'object' && typeof item.keyword === 'string') {
      const keyword = item.keyword.trim()
      if (!keyword) continue
      keywords.push({
        keyword,
        position: Number.isFinite(Number(item.position)) ? Number(item.position) : undefined,
        volume: Number.isFinite(Number(item.volume)) ? Number(item.volume) : undefined,
        change: Number.isFinite(Number(item.change)) ? Number(item.change) : 0,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : now,
      })
    }
  }

  return keywords
}

const sanitizeSeoPayload = (payload = {}) => {
  const next = pick(payload, SEO_KEYS)

  if (Object.prototype.hasOwnProperty.call(next, 'siteKeywords')) {
    next.siteKeywords = Array.isArray(next.siteKeywords)
      ? next.siteKeywords.map((item) => String(item || '').trim()).filter(Boolean)
      : []
  }

  if (Object.prototype.hasOwnProperty.call(next, 'trackedKeywords')) {
    next.trackedKeywords = normalizeKeywords(next.trackedKeywords) || []
  }

  return next
}

// GET /api/v1/seo
exports.getSeoSettings = async (req, res, next) => {
  try {
    let settings = await SeoSettings.findOne()
    if (!settings) settings = await SeoSettings.create({})
    sendSuccess(res, { data: settings })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/seo
exports.updateSeoSettings = async (req, res, next) => {
  try {
    const safePayload = sanitizeSeoPayload(req.body)
    let settings = await SeoSettings.findOne()
    if (!settings) {
      settings = await SeoSettings.create(safePayload)
    } else {
      Object.assign(settings, safePayload)
      await settings.save()
    }
    sendSuccess(res, { data: settings, message: 'SEO settings updated' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/seo/keywords
exports.updateKeywords = async (req, res, next) => {
  try {
    const settings = await SeoSettings.findOne()
    if (!settings) return next(new AppError('SEO settings not found', 404))
    settings.trackedKeywords = req.body.keywords
    await settings.save()
    sendSuccess(res, { data: settings.trackedKeywords, message: 'Keywords updated' })
  } catch (err) {
    next(err)
  }
}
