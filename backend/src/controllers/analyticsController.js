const Post = require('../models/Post')
const Product = require('../models/Product')
const Lead = require('../models/Lead')
const Comment = require('../models/Comment')
const User = require('../models/User')
const ContentView = require('../models/ContentView')
const { sendSuccess } = require('../utils/apiResponse')

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const toNumber = (value, fallback = 0) => {
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

const buildMonthBuckets = (months = 9) => {
  const count = Math.max(toNumber(months, 9), 1)
  const now = new Date()
  const buckets = []

  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    buckets.push({
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      label: MONTH_NAMES[d.getUTCMonth()],
    })
  }

  return buckets
}

const toMonthMap = (rows, valueKey) => {
  const map = new Map()
  for (const row of rows) {
    map.set(`${row._id.year}-${row._id.month}`, row[valueKey] || 0)
  }
  return map
}

// GET /api/v1/analytics/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const monthsToShow = 9
    const monthBuckets = buildMonthBuckets(monthsToShow)
    const startDate = new Date(Date.UTC(monthBuckets[0].year, monthBuckets[0].month - 1, 1))

    const [
      totalPosts,
      publishedPosts,
      totalProducts,
      publishedProducts,
      totalLeads,
      hotLeads,
      totalUsers,
      pendingComments,
      totalUniqueViews,
      recentPosts,
      recentLeads,
      monthlyLeads,
      monthlyViews,
    ] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: 'published' }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'published' }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'hot' }),
      User.countDocuments({ status: 'active' }),
      Comment.countDocuments({ status: 'pending' }),
      ContentView.countDocuments({ viewedAt: { $gte: startDate } }),
      Post.find().populate('author', 'name').sort({ createdAt: -1 }).limit(5),
      Lead.find().sort({ createdAt: -1 }).limit(5),
      Lead.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, leads: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      ContentView.aggregate([
        { $match: { viewedAt: { $gte: startDate } } },
        { $group: { _id: { year: { $year: '$viewedAt' }, month: { $month: '$viewedAt' } }, views: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ])

    const leadMap = toMonthMap(monthlyLeads, 'leads')
    const viewMap = toMonthMap(monthlyViews, 'views')
    const monthlyData = monthBuckets.map((item) => {
      const key = `${item.year}-${item.month}`
      return {
        month: item.label,
        leads: leadMap.get(key) || 0,
        views: viewMap.get(key) || 0,
      }
    })

    sendSuccess(res, {
      data: {
        stats: {
          totalPosts,
          publishedPosts,
          totalProducts,
          publishedProducts,
          totalLeads,
          hotLeads,
          totalUsers,
          pendingComments,
          totalUniqueViews,
        },
        monthlyData,
        recentPosts,
        recentLeads,
      },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/analytics/overview
exports.getAnalyticsOverview = async (req, res, next) => {
  try {
    const { months = 9 } = req.query
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - toNumber(months, 9))

    const [leadsBySource, leadsByStatus, postsByCategory, topPosts, topProducts, viewsByContentType] = await Promise.all([
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Post.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Post.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title views slug'),
      Product.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('name views slug'),
      ContentView.aggregate([
        { $match: { viewedAt: { $gte: startDate } } },
        { $group: { _id: '$contentType', count: { $sum: 1 } } },
      ]),
    ])

    sendSuccess(res, {
      data: {
        leadsBySource,
        leadsByStatus,
        postsByCategory,
        topPosts,
        topProducts,
        viewsByContentType,
      },
    })
  } catch (err) {
    next(err)
  }
}
