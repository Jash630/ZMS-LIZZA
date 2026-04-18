const { Resend } = require('resend')
const logger = require('../utils/logger')
const { isEmailDeliveryEnabled, validateEmailConfig } = require('../config/emailConfig')

let resendClient = null

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
  const response = await client.emails.send({
    from: process.env.EMAIL_FROM,
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