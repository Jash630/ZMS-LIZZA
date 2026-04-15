const mongoose = require('mongoose')
const crypto = require('crypto')

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      default: 'blog',
      trim: true,
      maxlength: 60,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
    unsubscribeToken: {
      type: String,
      trim: true,
    },
    emailsSent: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastEmailAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

SubscriberSchema.pre('save', function generateUnsubscribeToken(next) {
  if (!this.unsubscribeToken) {
    this.unsubscribeToken = crypto.randomBytes(24).toString('hex')
  }
  next()
})

SubscriberSchema.index({ email: 1 }, { unique: true })
SubscriberSchema.index({ status: 1, createdAt: -1 })
SubscriberSchema.index({ unsubscribeToken: 1 })

module.exports = mongoose.model('Subscriber', SubscriberSchema)
