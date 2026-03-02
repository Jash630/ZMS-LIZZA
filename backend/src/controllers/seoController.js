const SeoSettings = require('../models/SeoSettings')
const AppError    = require('../utils/AppError')
const { sendSuccess } = require('../utils/apiResponse')

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
    let settings = await SeoSettings.findOne()
    if (!settings) {
      settings = await SeoSettings.create(req.body)
    } else {
      Object.assign(settings, req.body)
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
