const AppError = require('../utils/AppError')

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue
  return String(value).trim().toLowerCase() === 'true'
}

const isProduction = () => process.env.NODE_ENV === 'production'

const isEmailDeliveryEnabled = () => {
  const defaultValue = isProduction()
  return parseBoolean(process.env.EMAIL_DELIVERY_ENABLED, defaultValue)
}

const requiredEmailEnv = ['RESEND_API_KEY', 'EMAIL_FROM']

const getMissingEmailEnv = () => requiredEmailEnv.filter((key) => !String(process.env[key] || '').trim())

const validateEmailConfig = () => {
  if (!isEmailDeliveryEnabled()) return

  const missing = getMissingEmailEnv()
  if (missing.length > 0) {
    throw new AppError(`Email delivery is enabled but missing env vars: ${missing.join(', ')}`, 500)
  }
}

module.exports = {
  isProduction,
  isEmailDeliveryEnabled,
  getMissingEmailEnv,
  validateEmailConfig,
}