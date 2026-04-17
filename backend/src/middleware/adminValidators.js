const { body } = require('express-validator')

const POST_STATUS = ['draft', 'published', 'scheduled']
const POST_CATEGORIES = ['Product', 'Guide', 'News', 'Case Study', 'Announcement']

const trimStringArray = (value) => {
  if (!Array.isArray(value)) return value
  return value.map((item) => String(item || '').trim()).filter(Boolean)
}

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false
  }
  return value
}

const loginValidators = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ max: 128 })
    .withMessage('Password is too long'),
]

const updatePasswordValidators = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .isLength({ max: 128 })
    .withMessage('Current password is too long'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 12, max: 128 })
    .withMessage('New password must be between 12 and 128 characters')
    .matches(/[a-z]/)
    .withMessage('New password must include at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('New password must include at least one uppercase letter')
    .matches(/\d/)
    .withMessage('New password must include at least one number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('New password must include at least one special character'),
]

const updateMeValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('avatar')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Avatar must be a valid URL string')
    .isLength({ max: 2000 })
    .withMessage('Avatar URL is too long'),
]

const createPostValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Post title is required')
    .isLength({ max: 200 })
    .withMessage('Post title cannot exceed 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required'),
  body('excerpt')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(POST_CATEGORIES)
    .withMessage(`Category must be one of: ${POST_CATEGORIES.join(', ')}`),
  body('status')
    .optional()
    .isIn(POST_STATUS)
    .withMessage(`Status must be one of: ${POST_STATUS.join(', ')}`),
  body('tags')
    .optional()
    .customSanitizer(trimStringArray),
]

const updatePostValidators = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Post title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Post title cannot exceed 200 characters'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Post content cannot be empty'),
  body('excerpt')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(POST_CATEGORIES)
    .withMessage(`Category must be one of: ${POST_CATEGORIES.join(', ')}`),
  body('status')
    .optional()
    .isIn(POST_STATUS)
    .withMessage(`Status must be one of: ${POST_STATUS.join(', ')}`),
  body('tags')
    .optional()
    .customSanitizer(trimStringArray),
]

const createProductValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 180 })
    .withMessage('Product name cannot exceed 180 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('status')
    .optional()
    .isIn(POST_STATUS)
    .withMessage(`Status must be one of: ${POST_STATUS.join(', ')}`),
  body('isFeatured').optional().customSanitizer(parseBoolean),
  body('isPopular').optional().customSanitizer(parseBoolean),
  body('keySpecs').optional().customSanitizer(trimStringArray),
  body('keyFeatures').optional().customSanitizer(trimStringArray),
  body('galleryImages').optional().customSanitizer(trimStringArray),
  body('applications').optional().customSanitizer(trimStringArray),
  body('seoKeywords').optional().customSanitizer(trimStringArray),
]

const updateProductValidators = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isLength({ max: 180 })
    .withMessage('Product name cannot exceed 180 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product description cannot be empty'),
  body('status')
    .optional()
    .isIn(POST_STATUS)
    .withMessage(`Status must be one of: ${POST_STATUS.join(', ')}`),
  body('isFeatured').optional().customSanitizer(parseBoolean),
  body('isPopular').optional().customSanitizer(parseBoolean),
  body('keySpecs').optional().customSanitizer(trimStringArray),
  body('keyFeatures').optional().customSanitizer(trimStringArray),
  body('galleryImages').optional().customSanitizer(trimStringArray),
  body('applications').optional().customSanitizer(trimStringArray),
  body('seoKeywords').optional().customSanitizer(trimStringArray),
]

const createMediaFromUrlValidators = [
  body('name')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 180 })
    .withMessage('Name cannot exceed 180 characters'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please provide a valid URL'),
]

module.exports = {
  loginValidators,
  updatePasswordValidators,
  updateMeValidators,
  createPostValidators,
  updatePostValidators,
  createProductValidators,
  updateProductValidators,
  createMediaFromUrlValidators,
}
