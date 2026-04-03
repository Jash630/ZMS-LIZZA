const { body } = require('express-validator')

const LEAD_HELP_TYPES = ['quote', 'demo', 'support', 'service', 'inquiry', 'emi', 'other']

const createPublicCommentValidators = [
  body('author')
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage('Author name cannot exceed 80 characters'),
  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
]


const createPublicSubscriberValidators = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('source')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Source cannot exceed 60 characters'),
]
const createPublicLeadValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Name must be between 2 and 120 characters'),
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Full name must be between 2 and 120 characters'),
  body('contact')
    .optional()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Contact must be between 6 and 20 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Phone must be between 6 and 20 characters'),
  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('City cannot exceed 120 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('State cannot exceed 120 characters'),
  body('businessName')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Business name cannot exceed 160 characters'),
  body('machineInterest')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Machine interest cannot exceed 200 characters'),
  body('machines')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Machines cannot exceed 200 characters'),
  body('helpType')
    .optional()
    .isIn(LEAD_HELP_TYPES)
    .withMessage(`Help type must be one of: ${LEAD_HELP_TYPES.join(', ')}`),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters'),
  body().custom((_, { req }) => {
    const name = req.body.name || req.body.fullName
    const contact = req.body.contact || req.body.phone

    if (!name || !String(name).trim()) {
      throw new Error('Name is required')
    }
    if (!contact || !String(contact).trim()) {
      throw new Error('Contact number is required')
    }
    return true
  }),
]

module.exports = {
  createPublicCommentValidators,
  createPublicLeadValidators,
  createPublicSubscriberValidators,
}

