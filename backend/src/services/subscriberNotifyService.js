const crypto = require('crypto')
const Subscriber = require('../models/Subscriber')
const logger = require('../utils/logger')
const { sendMail } = require('./emailService')
const {
  buildNewPostEmail,
  buildNewProductEmail,
  buildOfferEmail,
} = require('../templates/subscriberEmails')

const BATCH_SIZE = 10
const BATCH_DELAY_MS = 900

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendToSubscribers(buildEmail, payload, subscriberIds) {
  const query = { status: 'active' }
  if (Array.isArray(subscriberIds) && subscriberIds.length > 0) {
    query._id = { $in: subscriberIds }
  }

  const subscribers = await Subscriber.find(query).sort({ createdAt: -1 })
  if (!subscribers.length) {
    return { sent: 0, failed: 0, total: 0 }
  }

  let sent = 0
  let failed = 0

  for (let start = 0; start < subscribers.length; start += BATCH_SIZE) {
    const batch = subscribers.slice(start, start + BATCH_SIZE)
    const jobs = batch.map(async (subscriber) => {
      const token = subscriber.unsubscribeToken || crypto.randomBytes(24).toString('hex')
      const { subject, html } = buildEmail(payload, { unsubscribeToken: token })
      await sendMail({ to: subscriber.email, subject, html })

      const updatePayload = {
        $inc: { emailsSent: 1 },
        $set: { lastEmailAt: new Date() },
      }
      if (!subscriber.unsubscribeToken) {
        updatePayload.$set.unsubscribeToken = token
      }

      await Subscriber.updateOne({ _id: subscriber._id }, updatePayload)
    })

    const results = await Promise.allSettled(jobs)
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        sent += 1
      } else {
        failed += 1
        logger.warn(`Failed to email subscriber ${batch[index].email}: ${result.reason?.message || 'unknown error'}`)
      }
    })

    if (start + BATCH_SIZE < subscribers.length) {
      await sleep(BATCH_DELAY_MS)
    }
  }

  return { sent, failed, total: subscribers.length }
}

function notifyNewPost(post, subscriberIds) {
  return sendToSubscribers(buildNewPostEmail, post, subscriberIds)
}

function notifyNewProduct(product, subscriberIds) {
  return sendToSubscribers(buildNewProductEmail, product, subscriberIds)
}

function notifyOffer(offer, subscriberIds) {
  return sendToSubscribers(buildOfferEmail, offer, subscriberIds)
}

module.exports = {
  notifyNewPost,
  notifyNewProduct,
  notifyOffer,
}

