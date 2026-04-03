const mongoose = require('mongoose')

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
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
  },
  { timestamps: true }
)

SubscriberSchema.index({ email: 1 }, { unique: true })
SubscriberSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('Subscriber', SubscriberSchema)

