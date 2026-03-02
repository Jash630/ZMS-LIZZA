const User      = require('../models/User')
const AppError  = require('../utils/AppError')
const { sendSuccess } = require('../utils/apiResponse')
const logger    = require('../utils/logger')

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token    = user.getSignedJwtToken()
  const userData = {
    id:        user._id,
    name:      user.name,
    email:     user.email,
    role:      user.role,
    status:    user.status,
    avatar:    user.avatar,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  }
  return res.status(statusCode).json({ success: true, message, token, data: userData })
}

// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return next(new AppError('Please provide email and password', 400))

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError('Invalid email or password', 401))
    }
    if (user.status !== 'active') {
      return next(new AppError('Your account has been deactivated', 401))
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    logger.info(`User logged in: ${user.email} (${user.role})`)
    sendTokenResponse(user, 200, res, 'Logged in successfully')
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('postCount')
    sendSuccess(res, { data: user, message: 'Profile fetched' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/auth/update-password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id).select('+password')

    if (!(await user.matchPassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 400))
    }

    user.password          = newPassword
    user.passwordChangedAt = new Date()
    await user.save()

    logger.info(`Password updated for user: ${user.email}`)
    sendTokenResponse(user, 200, res, 'Password updated successfully')
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/auth/update-me
exports.updateMe = async (req, res, next) => {
  try {
    const { password, role, ...allowedFields } = req.body
    const user = await User.findByIdAndUpdate(req.user.id, allowedFields, {
      new: true, runValidators: true,
    })
    sendSuccess(res, { data: user, message: 'Profile updated successfully' })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/auth/logout
exports.logout = (req, res) => {
  sendSuccess(res, { message: 'Logged out successfully' })
}