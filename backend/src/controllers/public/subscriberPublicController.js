const Subscriber = require('../../models/Subscriber')
const { sendSuccess } = require('../../utils/apiResponse')

const normalizeEmail = (value = '') => String(value).trim().toLowerCase()

// POST /api/v1/public/newsletter/subscribe
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email)
    const source = String(req.body.source || 'blog').trim().slice(0, 60) || 'blog'

    let subscriber = await Subscriber.findOne({ email })

    if (subscriber) {
      if (subscriber.status !== 'active') {
        subscriber.status = 'active'
        subscriber.subscribedAt = new Date()
      }
      subscriber.source = source
      await subscriber.save()

      return sendSuccess(res, {
        message: 'You are already subscribed.',
        data: { email: subscriber.email, status: subscriber.status },
      })
    }

    subscriber = await Subscriber.create({
      email,
      source,
      status: 'active',
      subscribedAt: new Date(),
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
