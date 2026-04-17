const Comment  = require('../models/Comment')
const AppError = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)
  return { parsedPage, parsedLimit }
}

// GET /api/v1/comments
exports.getComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit)

    const query = {}
    if (status) query.status = status
    if (search) {
      const safeSearch = escapeRegex(search)
      query.$or = [
        { author:  { $regex: safeSearch, $options: 'i' } },
        { content: { $regex: safeSearch, $options: 'i' } },
      ]
    }

    const skip     = (parsedPage - 1) * parsedLimit
    const total    = await Comment.countDocuments(query)
    const commentsQuery = Comment.find(query)
      .populate('post',       'title slug')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)

    if (!['admin', 'superadmin'].includes(req.user.role)) {
      commentsQuery.select('-ipAddress -userAgent -email')
    }

    const comments = await commentsQuery

    sendPaginated(res, { data: comments, total, page: parsedPage, limit: parsedLimit })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/comments/:id/status
exports.updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    if (!['approved','spam','pending'].includes(status)) {
      return next(new AppError('Invalid status value', 400))
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status, reviewedBy: req.user.id, reviewedAt: new Date() },
      { new: true }
    ).populate('post', 'title')

    if (!comment) return next(new AppError('Comment not found', 404))
    sendSuccess(res, { data: comment, message: `Comment marked as ${status}` })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return next(new AppError('Comment not found', 404))
    await comment.deleteOne()
    sendSuccess(res, { message: 'Comment deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/comments/stats
exports.getCommentStats = async (req, res, next) => {
  try {
    const stats = await Comment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    sendSuccess(res, { data: stats })
  } catch (err) {
    next(err)
  }
}