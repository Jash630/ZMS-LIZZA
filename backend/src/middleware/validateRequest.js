const { validationResult } = require('express-validator')
const AppError = require('../utils/AppError')

module.exports = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  const message = errors
    .array()
    .map((err) => err.msg)
    .filter(Boolean)
    .join('. ')

  return next(new AppError(message || 'Validation failed', 400))
}
