const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type:    String,
      enum:    ['lead', 'comment', 'post', 'system', 'user'],
      default: 'system',
    },
    message: {
      type:     String,
      required: true,
      trim:     true,
    },
    read:      { type: Boolean, default: false },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    refModel:  { type: String },
    refId:     { type: mongoose.Schema.Types.ObjectId },
    readAt:    Date,
  },
  { timestamps: true }
)

NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', NotificationSchema)