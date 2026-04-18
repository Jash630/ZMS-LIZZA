const mongoose = require('mongoose')

const EMAIL_JOB_STATUSES = ['queued', 'processing', 'sent', 'dead_letter']

const EmailJobSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    to: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 320,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    html: {
      type: String,
      required: true,
    },
    replyTo: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 320,
      default: null,
    },
    status: {
      type: String,
      enum: EMAIL_JOB_STATUSES,
      default: 'queued',
      index: true,
    },
    dedupeKey: {
      type: String,
      trim: true,
      default: null,
      unique: true,
      sparse: true,
      index: true,
    },
    attempts: {
      type: Number,
      min: 0,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      min: 1,
      default: 5,
    },
    nextAttemptAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastAttemptAt: {
      type: Date,
      default: null,
    },
    lastError: {
      type: String,
      default: null,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    lockToken: {
      type: String,
      default: null,
    },
    providerMessageId: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
)

EmailJobSchema.index({ status: 1, nextAttemptAt: 1, createdAt: 1 })

module.exports = mongoose.model('EmailJob', EmailJobSchema)