const mongoose = require('mongoose')

const ContentViewSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ['post', 'product'],
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    dateKey: {
      type: String,
      required: true,
    },
    fingerprintHash: {
      type: String,
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
)

ContentViewSchema.index({ viewedAt: -1 })
ContentViewSchema.index({ contentType: 1, contentId: 1, dateKey: 1 })
ContentViewSchema.index(
  { contentType: 1, contentId: 1, dateKey: 1, fingerprintHash: 1 },
  { unique: true }
)

module.exports = mongoose.model('ContentView', ContentViewSchema)
