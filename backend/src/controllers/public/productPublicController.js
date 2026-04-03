const Product = require('../../models/Product')
const AppError = require('../../utils/AppError')
const { sendSuccess, sendPaginated } = require('../../utils/apiResponse')
const { trackUniqueView } = require('../../utils/viewTracker')

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

// GET /api/v1/public/products
exports.getPublicProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, featured, popular } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit, 12, 50)

    const query = getPublishedFilter()
    if (search) query.$text = { $search: search }
    if (featured === 'true') query.isFeatured = true
    if (popular === 'true') query.isPopular = true

    const skip = (parsedPage - 1) * parsedLimit
    const total = await Product.countDocuments(query)
    const products = await Product.find(query)
      .select(
        'name slug tagline badge image description keySpecs isFeatured isPopular views publishedAt createdAt'
      )
      .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
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

// GET /api/v1/public/products/:slug
exports.getPublicProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      ...getPublishedFilter(),
      slug: req.params.slug,
    }).populate('author', 'name avatar')

    if (!product) return next(new AppError('Product not found', 404))

    const viewResult = await trackUniqueView({
      contentType: 'product',
      contentId: product._id,
      req,
    })
    if (viewResult.counted) {
      product.views += 1
    }

    sendSuccess(res, { data: product })
  } catch (err) {
    next(err)
  }
}
