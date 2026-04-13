const mongoose = require('mongoose')
const slugify = require('slugify')

const ProductSpecItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const ProductSpecGroupSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    items: { type: [ProductSpecItemSchema], default: [] },
  },
  { _id: false }
)

const ProductFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    benefit: { type: String, trim: true },
    image: { type: String, trim: true },
  },
  { _id: false }
)

const ProductPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    items: { type: [String], default: [] },
  },
  { _id: false }
)

const ProductFaqSchema = new mongoose.Schema(
  {
    q: { type: String, required: true, trim: true },
    a: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [180, 'Name cannot exceed 180 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    tagline: { type: String, trim: true, maxlength: [240, 'Tagline cannot exceed 240 characters'] },
    badge: { type: String, trim: true, maxlength: [60, 'Badge cannot exceed 60 characters'] },
    category: {
      type: String,
      trim: true,
      maxlength: [120, 'Category cannot exceed 120 characters'],
      default: 'Embroidery Machine',
    },
    modelNo: { type: String, trim: true, maxlength: [120, 'Model number cannot exceed 120 characters'] },
    priceDisplay: { type: String, trim: true, maxlength: [120, 'Price display cannot exceed 120 characters'] },
    priceNote: { type: String, trim: true, maxlength: [240, 'Price note cannot exceed 240 characters'] },
    image: { type: String, trim: true },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    keySpecs: { type: [String], default: [] },
    keyFeatures: { type: [String], default: [] },
    galleryImages: { type: [String], default: [] },
    specifications: { type: [ProductSpecGroupSchema], default: [] },
    features: { type: [ProductFeatureSchema], default: [] },
    applications: { type: [String], default: [] },
    packageIncludes: { type: [ProductPackageSchema], default: [] },
    faqs: { type: [ProductFaqSchema], default: [] },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    publishedAt: { type: Date },
    scheduledAt: { type: Date },
    views: { type: Number, default: 0 },
    seoTitle: { type: String, maxlength: [60, 'SEO title cannot exceed 60 characters'] },
    seoDescription: { type: String, maxlength: [160, 'SEO description cannot exceed 160 characters'] },
    seoKeywords: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

ProductSchema.index({ status: 1, publishedAt: -1 })
ProductSchema.index({ author: 1 })
ProductSchema.index({ category: 1, status: 1 })
ProductSchema.index({ isFeatured: 1, isPopular: 1 })
ProductSchema.index({ name: 'text', description: 'text', category: 'text', keySpecs: 'text', keyFeatures: 'text' })

ProductSchema.pre('save', function saveHook(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

module.exports = mongoose.model('Product', ProductSchema)
