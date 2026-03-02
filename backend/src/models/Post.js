const mongoose = require('mongoose')
const slugify  = require('slugify')

const PostSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Post title is required'],
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type:   String,
      unique: true,
    },
    content: {
      type:     String,
      required: [true, 'Post content is required'],
    },
    excerpt: {
      type:      String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    category: {
      type:    String,
      enum:    ['Product', 'Guide', 'News', 'Case Study', 'Announcement'],
      default: 'News',
    },
    tags:          [{ type: String, trim: true, lowercase: true }],
    featuredImage: { type: String, default: null },
    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    status: {
      type:    String,
      enum:    ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    publishedAt:    { type: Date },
    scheduledAt:    { type: Date },
    views:          { type: Number, default: 0 },
    seoTitle:       { type: String, maxlength: [60, 'SEO title cannot exceed 60 characters'] },
    seoDescription: { type: String, maxlength: [160, 'SEO description cannot exceed 160 characters'] },
    seoKeywords:    [{ type: String }],
  },
  {
    timestamps: true,
    toJSON:    { virtuals: true },
    toObject:  { virtuals: true },
  }
)

// Indexes
PostSchema.index({ status: 1, publishedAt: -1 })
PostSchema.index({ author: 1 })
PostSchema.index({ category: 1 })
PostSchema.index({ title: 'text', content: 'text', tags: 'text' })

PostSchema.virtual('commentCount', {
  ref:          'Comment',
  localField:   '_id',
  foreignField: 'post',
  count:        true,
})

// Auto-generate slug and set publishedAt
PostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

module.exports = mongoose.model('Post', PostSchema)