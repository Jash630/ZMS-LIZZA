const crypto = require('crypto')
const EmailJob = require('../models/EmailJob')

const DEFAULT_MAX_ATTEMPTS = Number(process.env.EMAIL_QUEUE_MAX_ATTEMPTS || 5)
const DEFAULT_BASE_DELAY_SECONDS = Number(process.env.EMAIL_QUEUE_BASE_DELAY_SECONDS || 30)
const DEFAULT_MAX_DELAY_SECONDS = Number(process.env.EMAIL_QUEUE_MAX_DELAY_SECONDS || 1800)

const now = () => new Date()

const createLockToken = () => crypto.randomUUID()

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const buildDedupeKey = (...parts) => {
  const value = parts
    .filter(Boolean)
    .map((part) => String(part).trim())
    .join('::')
  return value || null
}

const enqueueEmailJob = async ({
  eventType,
  to,
  subject,
  html,
  replyTo,
  dedupeKey,
  metadata = {},
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
}) => {
  const normalizedTo = normalizeEmail(to)

  const payload = {
    eventType,
    to: normalizedTo,
    subject,
    html,
    replyTo: replyTo ? normalizeEmail(replyTo) : null,
    status: 'queued',
    nextAttemptAt: now(),
    attempts: 0,
    maxAttempts,
    lastError: null,
    lockedAt: null,
    lockToken: null,
    metadata,
    dedupeKey: dedupeKey || null,
  }

  try {
    const job = await EmailJob.create(payload)
    return { job, deduped: false }
  } catch (error) {
    if (error?.code === 11000 && payload.dedupeKey) {
      const existing = await EmailJob.findOne({ dedupeKey: payload.dedupeKey })
      return { job: existing, deduped: true }
    }

    throw error
  }
}

const claimEmailJobs = async ({ workerId, batchSize, lockTimeoutMs }) => {
  const claimed = []
  const claimSize = Math.max(1, Number(batchSize) || 1)
  const lockTimeout = Math.max(5000, Number(lockTimeoutMs) || 60000)
  const staleThreshold = new Date(Date.now() - lockTimeout)

  for (let index = 0; index < claimSize; index += 1) {
    const lockToken = `${workerId}:${createLockToken()}`
    const job = await EmailJob.findOneAndUpdate(
      {
        status: 'queued',
        nextAttemptAt: { $lte: now() },
        $or: [{ lockedAt: null }, { lockedAt: { $lte: staleThreshold } }],
      },
      {
        $set: {
          status: 'processing',
          lockedAt: now(),
          lockToken,
          lastAttemptAt: now(),
        },
        $inc: { attempts: 1 },
      },
      {
        sort: { createdAt: 1 },
        new: true,
      }
    )

    if (!job) break
    claimed.push(job)
  }

  return claimed
}

const markEmailJobSent = async ({ jobId, lockToken, providerMessageId }) =>
  EmailJob.findOneAndUpdate(
    {
      _id: jobId,
      lockToken,
      status: 'processing',
    },
    {
      $set: {
        status: 'sent',
        sentAt: now(),
        providerMessageId: providerMessageId || null,
        lastError: null,
        lockedAt: null,
        lockToken: null,
      },
    },
    { new: true }
  )

const calculateDelaySeconds = (attempts) => {
  const exponential = DEFAULT_BASE_DELAY_SECONDS * 2 ** Math.max(0, attempts - 1)
  return Math.min(DEFAULT_MAX_DELAY_SECONDS, exponential)
}

const markEmailJobFailed = async ({ jobId, lockToken, errorMessage }) => {
  const job = await EmailJob.findOne({ _id: jobId, lockToken })
  if (!job) return null

  const shouldDeadLetter = job.attempts >= job.maxAttempts

  if (shouldDeadLetter) {
    return EmailJob.findOneAndUpdate(
      { _id: jobId, lockToken, status: 'processing' },
      {
        $set: {
          status: 'dead_letter',
          lastError: errorMessage,
          lockedAt: null,
          lockToken: null,
        },
      },
      { new: true }
    )
  }

  const delaySeconds = calculateDelaySeconds(job.attempts)
  const nextAttemptAt = new Date(Date.now() + delaySeconds * 1000)

  return EmailJob.findOneAndUpdate(
    { _id: jobId, lockToken, status: 'processing' },
    {
      $set: {
        status: 'queued',
        nextAttemptAt,
        lastError: errorMessage,
        lockedAt: null,
        lockToken: null,
      },
    },
    { new: true }
  )
}

module.exports = {
  buildDedupeKey,
  enqueueEmailJob,
  claimEmailJobs,
  markEmailJobSent,
  markEmailJobFailed,
}