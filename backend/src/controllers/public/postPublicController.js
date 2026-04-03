const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const Notification = require('../../models/Notification')
const AppError = require('../../utils/AppError')
const { sendSuccess, sendPaginated } = require('../../utils/apiResponse')
const { trackUniqueView, getClientIp } = require('../../utils/viewTracker')

const parsePagination = (page, limit, defaultLimit = 10, maxLimit = 100) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || defaultLimit, 1), maxLimit)
  return { parsedPage, parsedLimit }
}

const getPublishedFilter = () => ({
  status: 'published',
  $or: [
    { publishedAt: { $exists: false } },
    { publishedAt: null },
    { publishedAt: { $lte: new Date() } },
  ],
})

// GET /api/v1/public/posts
exports.getPublicPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search, tag } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit, 10, 50)

    const query = getPublishedFilter()
    if (category) query.category = category
    if (tag) query.tags = tag.toLowerCase()
    if (search) query.$text = { $search: search }

    const skip = (parsedPage - 1) * parsedLimit
    const total = await Post.countDocuments(query)
    const posts = await Post.find(query)
      .select(
        'title slug excerpt category tags featuredImage author publishedAt views seoTitle seoDescription createdAt'
      )
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean()

    sendPaginated(res, {
      data: posts,
      total,
      page: parsedPage,
      limit: parsedLimit,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/public/posts/:slug
exports.getPublicPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      ...getPublishedFilter(),
      slug: req.params.slug,
    })
      .populate('author', 'name avatar')
      .populate('commentCount')

    if (!post) return next(new AppError('Post not found', 404))

    const viewResult = await trackUniqueView({
      contentType: 'post',
      contentId: post._id,
      req,
    })
    if (viewResult.counted) {
      post.views += 1
    }

    sendSuccess(res, { data: post })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/public/posts/:slug/comments
exports.getPublicCommentsByPostSlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ ...getPublishedFilter(), slug: req.params.slug }).select('_id')
    if (!post) return next(new AppError('Post not found', 404))

    const { page = 1, limit = 20 } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit, 20, 100)
    const skip = (parsedPage - 1) * parsedLimit

    const query = { post: post._id, status: 'approved' }
    const total = await Comment.countDocuments(query)
    const comments = await Comment.find(query)
      .select('author content createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean()

    sendPaginated(res, {
      data: comments,
      total,
      page: parsedPage,
      limit: parsedLimit,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/public/posts/:slug/comments
exports.createPublicCommentForPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ ...getPublishedFilter(), slug: req.params.slug }).select('_id title')
    if (!post) return next(new AppError('Post not found', 404))

    const comment = await Comment.create({
      post: post._id,
      author: req.body.author || 'Anonymous',
      email: req.body.email,
      content: req.body.content,
      status: 'pending',
      ipAddress: getClientIp(req),
      userAgent: req.get('user-agent') || '',
    })

    await Notification.create({
      type: 'comment',
      message: `New pending comment received on "${post.title}"`,
      refModel: 'Comment',
      refId: comment._id,
    })

    sendSuccess(res, {
      statusCode: 201,
      message: 'Comment submitted successfully and is awaiting moderation',
      data: {
        id: comment._id,
        status: comment.status,
      },
    })
  } catch (err) {
    next(err)
  }
}
