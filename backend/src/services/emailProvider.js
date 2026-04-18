const { Resend } = require('resend')
const logger = require('../utils/logger')
const { isEmailDeliveryEnabled, validateEmailConfig } = require('../config/emailConfig')

let resendClient = null

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i

const normalizeFromField = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return raw

  if (/^[^<>]+<[^<>]+>$/.test(raw)) {
    return raw
  }

  const match = raw.match(EMAIL_REGEX)
  if (!match) return raw

  const email = match[0]

  // If value is only an email, this is already valid for Resend.
  if (raw.toLowerCase() === email.toLowerCase()) {
    return email
  }

  const name = raw.replace(email, '').replace(/[<>]/g, '').trim()
  if (!name) return email

  return `${name} <${email}>`
}

const initializeEmailProvider = () => {
  if (!isEmailDeliveryEnabled()) {
    logger.warn('Email delivery is disabled (EMAIL_DELIVERY_ENABLED=false). Jobs will be queued but not sent.')
    return null
  }

  validateEmailConfig()

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
    logger.info('Resend email provider initialized')
  }

  return resendClient
}

const sendEmail = async ({ to, subject, html, replyTo }) => {
  if (!isEmailDeliveryEnabled()) {
    return {
      skipped: true,
      messageId: null,
    }
  }

  const client = initializeEmailProvider()
  const normalizedFrom = normalizeFromField(process.env.EMAIL_FROM)

  if (normalizedFrom !== String(process.env.EMAIL_FROM || '').trim()) {
    logger.warn(`EMAIL_FROM auto-normalized for Resend: ${normalizedFrom}`)
  }

  const response = await client.emails.send({
    from: normalizedFrom,
    to: [to],
    subject,
    html,
    reply_to: replyTo || process.env.EMAIL_REPLY_TO_DEFAULT || undefined,
  })

  if (response?.error) {
    throw new Error(response.error.message || 'Resend email delivery failed')
  }

  return {
    skipped: false,
    messageId: response?.data?.id || null,
  }
}

module.exports = {
  initializeEmailProvider,
  sendEmail,
}