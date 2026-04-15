const Subscriber = require('../models/Subscriber')
const AppError = require('../utils/AppError')
const logger = require('../utils/logger')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')
const { notifyOffer } = require('../services/subscriberNotifyService')

// GET /api/v1/subscribers
exports.getSubscribers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 500)
    const search = String(req.query.search || '').trim()
    const status = String(req.query.status || '').trim()

    const query = {}
    if (status) query.status = status
    if (search) query.email = { $regex: search, $options: 'i' }

    const skip = (page - 1) * limit

    const [total, subscribers] = await Promise.all([
      Subscriber.countDocuments(query),
      Subscriber.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ])

    sendPaginated(res, { data: subscribers, total, page, limit })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/subscribers/stats
exports.getSubscriberStats = async (req, res, next) => {
  try {
    const [byStatus, bySource, totalEmails] = await Promise.all([
      Subscriber.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Subscriber.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Subscriber.aggregate([{ $group: { _id: null, total: { $sum: '$emailsSent' } } }]),
    ])

    const active = byStatus.find((row) => row._id === 'active')?.count || 0
    const unsubscribed = byStatus.find((row) => row._id === 'unsubscribed')?.count || 0

    sendSuccess(res, {
      data: {
        total: active + unsubscribed,
        active,
        unsubscribed,
        totalEmailsSent: totalEmails[0]?.total || 0,
        bySource,
      },
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/v1/subscribers/:id
exports.updateSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id)
    if (!subscriber) return next(new AppError('Subscriber not found', 404))

    const status = String(req.body.status || '').trim()
    if (status) {
      if (!['active', 'unsubscribed'].includes(status)) {
        return next(new AppError('Invalid status value', 400))
      }
      subscriber.status = status
      subscriber.unsubscribedAt = status === 'unsubscribed' ? new Date() : null
      if (status === 'active') subscriber.subscribedAt = new Date()
    }

    await subscriber.save()
    sendSuccess(res, { message: 'Subscriber updated', data: subscriber })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/v1/subscribers/:id
exports.deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id)
    if (!subscriber) return next(new AppError('Subscriber not found', 404))

    await subscriber.deleteOne()
    sendSuccess(res, { message: 'Subscriber deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// POST /api/v1/subscribers/send-offer
exports.sendOffer = async (req, res, next) => {
  try {
    const title = String(req.body.title || '').trim()
    const description = String(req.body.description || '').trim()
    const promoCode = String(req.body.promoCode || '').trim()
    const image = String(req.body.image || '').trim()
    const subscriberIds = Array.isArray(req.body.subscriberIds)
      ? req.body.subscriberIds.filter((id) => typeof id === 'string' && id.trim())
      : undefined

    if (!title) return next(new AppError('Offer title is required', 400))

    const result = await notifyOffer({ title, description, promoCode, image }, subscriberIds)
    logger.info(`Offer broadcast by ${req.user?.email || 'unknown'}: ${result.sent}/${result.total} sent`)

    sendSuccess(res, {
      message: `Offer sent to ${result.sent} subscribers`,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

