const jwt      = require('jsonwebtoken')
const User     = require('../models/User')
const AppError = require('../utils/AppError')
const logger   = require('../utils/logger')

// Protect routes — verify JWT
exports.protect = async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('Not authenticated. Please log in.', 401))
  }

  try {
    const decoded     = jwt.verify(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401))
    }

    if (currentUser.status !== 'active') {
      return next(new AppError('Your account has been deactivated. Contact a Super Admin.', 401))
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('Password was recently changed. Please log in again.', 401))
    }

    req.user = currentUser
    next()
  } catch (err) {
    logger.warn(`JWT verification failed: ${err.message}`)
    return next(new AppError('Invalid or expired token. Please log in again.', 401))
  }
}

// Authorize — restrict to specific roles
// Usage: authorize('superadmin', 'admin')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role '${req.user.role}' is not authorized to access this resource.`, 403)
      )
    }
    next()
  }
}