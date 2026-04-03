const Settings = require('../models/Settings')
const { sendSuccess } = require('../utils/apiResponse')

const GENERAL_KEYS = ['siteName', 'tagline', 'siteUrl', 'phone', 'whatsapp', 'email', 'address']
const APPEARANCE_KEYS = ['defaultTheme', 'brandAccent']
const NOTIFICATION_KEYS = [
  'newLeadEnquiries',
  'commentModeration',
  'postPublished',
  'systemUpdates',
  'weeklyPerformanceReport',
]

const pick = (source, keys) => {
  const next = {}
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      next[key] = source[key]
    }
  }
  return next
}

const getSettingsDoc = async () => {
  let settings = await Settings.findOne()
  if (!settings) settings = await Settings.create({})
  return settings
}

// GET /api/v1/settings
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsDoc()
    sendSuccess(res, { data: settings, message: 'Settings fetched successfully' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/settings/general
exports.updateGeneralSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsDoc()
    Object.assign(settings.general, pick(req.body, GENERAL_KEYS))
    await settings.save()
    sendSuccess(res, { data: settings.general, message: 'General settings updated' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/settings/appearance
exports.updateAppearanceSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsDoc()
    Object.assign(settings.appearance, pick(req.body, APPEARANCE_KEYS))
    await settings.save()
    sendSuccess(res, { data: settings.appearance, message: 'Appearance settings updated' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/settings/notifications
exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const settings = await getSettingsDoc()
    Object.assign(settings.notifications, pick(req.body, NOTIFICATION_KEYS))
    await settings.save()
    sendSuccess(res, { data: settings.notifications, message: 'Notification settings updated' })
  } catch (err) {
    next(err)
  }
}
