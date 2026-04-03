const Product = require('../../models/Product')
const AppError = require('../../utils/AppError')
const { sendSuccess, sendPaginated } = require('../../utils/apiResponse')

const canManageProduct = (product, user) => {
  if (!product || !user) return false
  if (['admin', 'superadmin'].includes(user.role)) return true
  return product.author.toString() === user.id
}

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)
  return { parsedPage, parsedLimit }
}

// GET /api/v1/products
exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search, author } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit)

    const query = {}
    if (status) query.status = status
    if (search) query.$text = { $search: search }

    if (req.user.role === 'editor') {
      query.author = req.user.id
    } else if (author) {
      query.author = author
    }

    const skip = (parsedPage - 1) * parsedLimit
    const total = await Product.countDocuments(query)
    const products = await Product.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean()

    sendPaginated(res, {
      data: products,
      total,
      page: parsedPage,
      limit: parsedLimit,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('author', 'name email avatar role')
    if (!product) return next(new AppError('Product not found', 404))

    if (!canManageProduct(product, req.user)) {
      return next(new AppError('Not authorized to access this product', 403))
    }

    sendSuccess(res, { data: product })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/products
exports.createProduct = async (req, res, next) => {
  try {
    req.body.author = req.user.id
    const product = await Product.create(req.body)
    const populated = await product.populate('author', 'name email avatar role')
    sendSuccess(res, { data: populated, statusCode: 201, message: 'Product created successfully' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
    if (!product) return next(new AppError('Product not found', 404))

    if (!canManageProduct(product, req.user)) {
      return next(new AppError('Not authorized to update this product', 403))
    }

    const updatePayload = { ...req.body }
    if (Object.prototype.hasOwnProperty.call(updatePayload, 'author')) {
      delete updatePayload.author
    }
    if (updatePayload.status === 'published' && !product.publishedAt && !updatePayload.publishedAt) {
      updatePayload.publishedAt = new Date()
    }

    product = await Product.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    }).populate('author', 'name email avatar role')

    sendSuccess(res, { data: product, message: 'Product updated successfully' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new AppError('Product not found', 404))

    if (!canManageProduct(product, req.user)) {
      return next(new AppError('Not authorized to delete this product', 403))
    }

    await product.deleteOne()
    sendSuccess(res, { message: 'Product deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/products/stats
exports.getProductStats = async (req, res, next) => {
  try {
    const [byStatus, topViewed] = await Promise.all([
      Product.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      ]),
      Product.find({ status: 'published' })
        .sort({ views: -1, publishedAt: -1 })
        .limit(5)
        .select('name slug views publishedAt'),
    ])

    sendSuccess(res, { data: { byStatus, topViewed } })
  } catch (err) {
    next(err)
  }
}
