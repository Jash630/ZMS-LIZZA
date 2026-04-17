const Post         = require('../models/Post')
const Notification = require('../models/Notification')
const AppError     = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)
  return { parsedPage, parsedLimit }
}

// GET /api/v1/posts
exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, category, search, author } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit)

    const query = {}
    if (status)   query.status   = status
    if (category) query.category = category
    if (author)   query.author   = author
    if (search)   query.$text    = { $search: search }

    const skip  = (parsedPage - 1) * parsedLimit
    const total = await Post.countDocuments(query)
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .populate('commentCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean()

    sendPaginated(res, { data: posts, total, page: parsedPage, limit: parsedLimit })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar role')
      .populate('commentCount')
    if (!post) return next(new AppError('Post not found', 404))
    sendSuccess(res, { data: post })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/posts
exports.createPost = async (req, res, next) => {
  try {
    req.body.author    = req.user.id
    const post         = await Post.create(req.body)
    const populated    = await post.populate('author', 'name email')

    if (req.user.role === 'editor') {
      await Notification.create({
        type:     'post',
        message:  `${req.user.name} submitted "${post.title}" for review`,
        refModel: 'Post',
        refId:    post._id,
      })
    }

    sendSuccess(res, { data: populated, statusCode: 201, message: 'Post created successfully' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id)
    if (!post) return next(new AppError('Post not found', 404))

    if (post.author.toString() !== req.user.id && !['admin','superadmin'].includes(req.user.role)) {
      return next(new AppError('Not authorized to update this post', 403))
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate('author', 'name email')

    sendSuccess(res, { data: post, message: 'Post updated successfully' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return next(new AppError('Post not found', 404))

    if (post.author.toString() !== req.user.id && !['admin','superadmin'].includes(req.user.role)) {
      return next(new AppError('Not authorized to delete this post', 403))
    }

    await post.deleteOne()
    sendSuccess(res, { message: 'Post deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/posts/stats
exports.getPostStats = async (req, res, next) => {
  try {
    const [byStatus, byCategory] = await Promise.all([
      Post.aggregate([{ $group: { _id: '$status',   count: { $sum: 1 }, totalViews: { $sum: '$views' } } }]),
      Post.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ])
    sendSuccess(res, { data: { byStatus, byCategory } })
  } catch (err) {
    next(err)
  }
}