const Subscriber = require('../../models/Subscriber')
const { sendSuccess } = require('../../utils/apiResponse')
const logger = require('../../utils/logger')
const { sendMail } = require('../../services/emailService')
const { buildWelcomeEmail } = require('../../templates/subscriberEmails')

const normalizeEmail = (value = '') => String(value).trim().toLowerCase()

// POST /api/v1/public/newsletter/subscribe
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email)
    const source = String(req.body.source || 'blog').trim().slice(0, 60) || 'blog'

    let subscriber = await Subscriber.findOne({ email })

    if (subscriber) {
      let reactivated = false
      if (subscriber.status !== 'active') {
        subscriber.status = 'active'
        subscriber.subscribedAt = new Date()
        subscriber.unsubscribedAt = null
        reactivated = true
      }
      subscriber.source = source
      await subscriber.save()

      if (reactivated) {
        const { subject, html } = buildWelcomeEmail({
          unsubscribeToken: subscriber.unsubscribeToken,
        })
        sendMail({ to: subscriber.email, subject, html }).catch((error) => {
          logger.warn(`Welcome email failed for ${subscriber.email}: ${error.message}`)
        })
      }

      return sendSuccess(res, {
        message: reactivated
          ? 'Welcome back. Your subscription has been reactivated.'
          : 'You are already subscribed.',
        data: { email: subscriber.email, status: subscriber.status },
      })
    }

    subscriber = await Subscriber.create({
      email,
      source,
      status: 'active',
      subscribedAt: new Date(),
    })

    const { subject, html } = buildWelcomeEmail({
      unsubscribeToken: subscriber.unsubscribeToken,
    })
    sendMail({ to: subscriber.email, subject, html }).catch((error) => {
      logger.warn(`Welcome email failed for ${subscriber.email}: ${error.message}`)
    })

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Subscribed successfully.',
      data: { email: subscriber.email, status: subscriber.status },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/public/newsletter/unsubscribe?token=...
exports.unsubscribeNewsletter = async (req, res) => {
  try {
    const token = String(req.query.token || '').trim()
    if (!token) {
      return res.status(400).send(renderUnsubscribePage('Invalid unsubscribe link.', false))
    }

    const subscriber = await Subscriber.findOne({ unsubscribeToken: token })
    if (!subscriber) {
      return res.status(404).send(renderUnsubscribePage('Subscriber not found.', false))
    }

    if (subscriber.status !== 'unsubscribed') {
      subscriber.status = 'unsubscribed'
      subscriber.unsubscribedAt = new Date()
      await subscriber.save()
    }

    return res.send(renderUnsubscribePage('You have been unsubscribed successfully.', true))
  } catch (error) {
    logger.error(`Unsubscribe failed: ${error.message}`)
    return res.status(500).send(renderUnsubscribePage('Something went wrong. Please try again.', false))
  }
}

function renderUnsubscribePage(message, isSuccess) {
  const homeUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const title = isSuccess ? 'Unsubscribed' : 'Oops'
  const icon = isSuccess ? 'OK' : '!'

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | ZMS LIZZA</title>
    <style>
      body { margin:0; font-family: Arial, sans-serif; background:#f5f7fa; display:flex; align-items:center; justify-content:center; min-height:100vh; }
      .card { width:min(500px, 92vw); background:#fff; border-radius:14px; padding:28px; text-align:center; box-shadow:0 8px 28px rgba(0,0,0,0.08); }
      .icon { width:54px; height:54px; line-height:54px; border-radius:50%; margin:0 auto 14px; font-weight:700; color:#fff; background:${isSuccess ? '#16a34a' : '#dc2626'}; }
      h1 { margin:0 0 8px; color:#111827; font-size:22px; }
      p { margin:0 0 18px; color:#4b5563; }
      a { display:inline-block; padding:10px 16px; border-radius:8px; background:#f97316; color:#fff; text-decoration:none; font-weight:600; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon">${icon}</div>
      <h1>${title}</h1>
      <p>${message}</p>
      <a href="${homeUrl}">Go to ZMS LIZZA</a>
    </div>
  </body>
</html>`
}
