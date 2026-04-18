const Subscriber = require('../models/Subscriber')
const logger = require('../utils/logger')
const { queueCampaignEmail } = require('./emailAutomationService')

async function queueToSubscribers(campaignType, payload, subscriberIds) {
  const query = { status: 'active' }
  if (Array.isArray(subscriberIds) && subscriberIds.length > 0) {
    query._id = { $in: subscriberIds }
  }

  const subscribers = await Subscriber.find(query).sort({ createdAt: -1 })
  if (!subscribers.length) {
    return { queued: 0, failed: 0, total: 0 }
  }

  const campaignId = payload._id || `${campaignType}-${Date.now()}`

  const results = await Promise.allSettled(
    subscribers.map((subscriber) =>
      queueCampaignEmail({
        campaignId,
        campaignType,
        payload,
        subscriber,
      })
    )
  )

  let queued = 0
  let failed = 0

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      queued += 1
    } else {
      failed += 1
      logger.warn(
        `Failed to queue campaign email for ${subscribers[index].email}: ${result.reason?.message || 'unknown error'}`
      )
    }
  })

  return { queued, failed, total: subscribers.length }
}

function notifyNewPost(post, subscriberIds) {
  return queueToSubscribers('post', post, subscriberIds)
}

function notifyNewProduct(product, subscriberIds) {
  return queueToSubscribers('product', product, subscriberIds)
}

function notifyOffer(offer, subscriberIds) {
  return queueToSubscribers('offer', offer, subscriberIds)
}

module.exports = {
  notifyNewPost,
  notifyNewProduct,
  notifyOffer,
}
