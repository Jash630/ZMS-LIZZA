const nodemailer = require('nodemailer')
const logger = require('../utils/logger')

let transporter = null
let warnedMissingCredentials = false

function getTransporter() {
  if (transporter) return transporter

  const user = process.env.EMAIL_APP
  const pass = process.env.EMAIL_APP_PASS

  if (!user || !pass) {
    if (!warnedMissingCredentials) {
      logger.warn('Email credentials are missing (EMAIL_APP / EMAIL_APP_PASS). Email sending is disabled.')
      warnedMissingCredentials = true
    }
    return null
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  transporter.verify().then(
    () => logger.info('Email transporter initialized successfully'),
    (error) => logger.error(`Email transporter verification failed: ${error.message}`)
  )

  return transporter
}

async function sendMail({ to, subject, html, replyTo }) {
  const activeTransporter = getTransporter()
  if (!activeTransporter) return null

  const fromName = process.env.EMAIL_FROM_NAME || 'ZMS LIZZA'
  const fromAddress = process.env.EMAIL_APP

  return activeTransporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    html,
    replyTo,
  })
}

module.exports = { sendMail }

