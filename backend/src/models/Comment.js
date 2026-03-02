const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Post',
      required: true,
    },
    author:    { type: String, default: 'Anonymous', trim: true },
    email:     { type: String, trim: true, lowercase: true },
    content: {
      type:      String,
      required:  [true, 'Comment content is required'],
      trim:      true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    status: {
      type:    String,
      enum:    ['pending', 'approved', 'spam'],
      default: 'pending',
    },
    ipAddress:  { type: String },
    userAgent:  { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
)

CommentSchema.index({ post: 1, status: 1 })
CommentSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('Comment', CommentSchema)