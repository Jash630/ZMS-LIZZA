const Comment  = require('../models/Comment')
const AppError = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')

// GET /api/v1/comments
exports.getComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query

    const query = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { author:  { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]
    }

    const skip     = (page - 1) * limit
    const total    = await Comment.countDocuments(query)
    const comments = await Comment.find(query)
      .populate('post',       'title slug')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    sendPaginated(res, { data: comments, total, page, limit })
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