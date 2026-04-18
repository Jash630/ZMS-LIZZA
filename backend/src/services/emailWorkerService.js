const logger = require('../utils/logger')
const Subscriber = require('../models/Subscriber')
const { isEmailDeliveryEnabled } = require('../config/emailConfig')
const { initializeEmailProvider, sendEmail } = require('./emailProvider')
const { claimEmailJobs, markEmailJobSent, markEmailJobFailed } = require('./emailQueueService')

const DEFAULT_POLL_MS = Number(process.env.EMAIL_QUEUE_POLL_MS || 3000)
const DEFAULT_BATCH_SIZE = Number(process.env.EMAIL_QUEUE_BATCH_SIZE || 10)
const DEFAULT_LOCK_TIMEOUT_MS = Number(process.env.EMAIL_QUEUE_LOCK_TIMEOUT_MS || 90000)

let intervalHandle = null
let workerInFlight = false

const workerId = `${process.pid}-${Math.random().toString(16).slice(2)}`

const processSingleJob = async (job) => {
  try {
    const result = await sendEmail({
      to: job.to,
      subject: job.subject,
      html: job.html,
      replyTo: job.replyTo,
    })

    await markEmailJobSent({
      jobId: job._id,
      lockToken: job.lockToken,
      providerMessageId: result?.messageId || null,
    })

    if (job?.metadata?.subscriberId) {
      await Subscriber.updateOne(
        { _id: job.metadata.subscriberId },
        {
          $inc: { emailsSent: 1 },
          $set: { lastEmailAt: new Date() },
        }
      )
    }
  } catch (error) {
    await markEmailJobFailed({
      jobId: job._id,
      lockToken: job.lockToken,
      errorMessage: error?.message || 'Unknown email worker error',
    })

    logger.error(`Email delivery failed for job ${job._id}: ${error?.message || 'unknown error'}`)
  }
}

const processQueueTick = async () => {
  if (workerInFlight) return
  workerInFlight = true

  try {
    const jobs = await claimEmailJobs({
      workerId,
      batchSize: DEFAULT_BATCH_SIZE,
      lockTimeoutMs: DEFAULT_LOCK_TIMEOUT_MS,
    })

    if (!jobs.length) return
    await Promise.all(jobs.map((job) => processSingleJob(job)))
  } catch (error) {
    logger.error(`Email worker tick failed: ${error?.message || 'unknown error'}`)
  } finally {
    workerInFlight = false
  }
}

const startEmailWorker = () => {
  if (intervalHandle) return

  if (!isEmailDeliveryEnabled()) {
    logger.warn('Email worker not started because EMAIL_DELIVERY_ENABLED=false')
    return
  }

  initializeEmailProvider()
  intervalHandle = setInterval(processQueueTick, DEFAULT_POLL_MS)
  intervalHandle.unref()
  logger.info(`Email worker started (poll=${DEFAULT_POLL_MS}ms, batch=${DEFAULT_BATCH_SIZE})`)
}

const stopEmailWorker = () => {
  if (!intervalHandle) return
  clearInterval(intervalHandle)
  intervalHandle = null
  logger.info('Email worker stopped')
}

module.exports = {
  startEmailWorker,
  stopEmailWorker,
}