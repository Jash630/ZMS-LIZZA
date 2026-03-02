const mongoose = require('mongoose')

const MediaSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    originalName:  { type: String, trim: true },
    type: {
      type:    String,
      enum:    ['image', 'pdf', 'video', 'document', 'other'],
      default: 'other',
    },
    mimeType:      { type: String },
    size:          { type: Number },
    sizeFormatted: { type: String },
    url:           { type: String, required: true },
    path:          { type: String },
    alt:           { type: String, trim: true },
    uploadedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usedIn: [
      {
        model:  String,
        itemId: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
)

MediaSchema.index({ type: 1 })
MediaSchema.index({ uploadedBy: 1 })

module.exports = mongoose.model('Media', MediaSchema)