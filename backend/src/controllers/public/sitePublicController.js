const Media = require('../../models/Media')
const SeoSettings = require('../../models/SeoSettings')
const Settings = require('../../models/Settings')
const { sendSuccess, sendPaginated } = require('../../utils/apiResponse')

const parsePagination = (page, limit, defaultLimit = 20, maxLimit = 100) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || defaultLimit, 1), maxLimit)
  return { parsedPage, parsedLimit }
}

// GET /api/v1/public/media
exports.getPublicMedia = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit, 20, 60)

    const query = {}
    if (type) query.type = type
    if (search) query.name = { $regex: search, $options: 'i' }

    const skip = (parsedPage - 1) * parsedLimit
    const total = await Media.countDocuments(query)
    const media = await Media.find(query)
      .select('name originalName type mimeType size sizeFormatted url alt createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean()

    sendPaginated(res, {
      data: media,
      total,
      page: parsedPage,
      limit: parsedLimit,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/public/seo
exports.getPublicSeoSettings = async (req, res, next) => {
  try {
    let settings = await SeoSettings.findOne().lean()
    if (!settings) settings = await SeoSettings.create({})

    const publicSeo = {
      siteTitle: settings.siteTitle,
      siteDescription: settings.siteDescription,
      siteKeywords: settings.siteKeywords || [],
      robots: settings.robots,
    }

    sendSuccess(res, { data: publicSeo })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/public/settings
exports.getPublicSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne().lean()
    if (!settings) settings = await Settings.create({})

    sendSuccess(res, {
      data: {
        general: settings.general,
        appearance: settings.appearance,
      },
    })
  } catch (err) {
    next(err)
  }
}
