const User     = require('../models/User')
const AppError = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')

// GET /api/v1/users
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query

    const query = {}
    if (role)   query.role   = role
    if (status) query.status = status
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const skip  = (page - 1) * limit
    const total = await User.countDocuments(query)
    const users = await User.find(query)
      .populate('postCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    sendPaginated(res, { data: users, total, page, limit })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/users/:id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('postCount')
    if (!user) return next(new AppError('User not found', 404))
    sendSuccess(res, { data: user })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/users
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    if (role === 'superadmin' && req.user.role !== 'superadmin') {
      return next(new AppError('Only a Super Admin can create another Super Admin', 403))
    }

    const user = await User.create({ name, email, password, role })
    const { password: _, ...userData } = user.toObject()
    sendSuccess(res, { data: userData, statusCode: 201, message: 'User created successfully' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { password, ...updateData } = req.body

    if (req.params.id === req.user.id.toString() && updateData.role) {
      return next(new AppError('You cannot change your own role', 400))
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
    })
    if (!user) return next(new AppError('User not found', 404))
    sendSuccess(res, { data: user, message: 'User updated successfully' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return next(new AppError('You cannot delete your own account', 400))
    }
    const user = await User.findById(req.params.id)
    if (!user) return next(new AppError('User not found', 404))
    await user.deleteOne()
    sendSuccess(res, { message: 'User deleted successfully' })
  } catch (err) {
    next(err)
  }
}
