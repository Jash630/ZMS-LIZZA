const Post    = require('../models/Post')
const Lead    = require('../models/Lead')
const Comment = require('../models/Comment')
const User    = require('../models/User')
const { sendSuccess } = require('../utils/apiResponse')

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// GET /api/v1/analytics/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalPosts, publishedPosts, totalLeads, hotLeads, totalUsers, pendingComments, recentPosts, recentLeads] =
      await Promise.all([
        Post.countDocuments(),
        Post.countDocuments({ status: 'published' }),
        Lead.countDocuments(),
        Lead.countDocuments({ status: 'hot' }),
        User.countDocuments({ status: 'active' }),
        Comment.countDocuments({ status: 'pending' }),
        Post.find().populate('author', 'name').sort({ createdAt: -1 }).limit(5),
        Lead.find().sort({ createdAt: -1 }).limit(5),
      ])

    const nineMonthsAgo = new Date()
    nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9)

    const [monthlyLeads, monthlyViews] = await Promise.all([
      Lead.aggregate([
        { $match: { createdAt: { $gte: nineMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, leads: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Post.aggregate([
        { $match: { status: 'published', publishedAt: { $gte: nineMonthsAgo } } },
        { $group: { _id: { year: { $year: '$publishedAt' }, month: { $month: '$publishedAt' } }, views: { $sum: '$views' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ])

    const monthlyData = monthlyLeads.map((ml) => {
      const mv = monthlyViews.find(v => v._id.year === ml._id.year && v._id.month === ml._id.month)
      return {
        month: MONTH_NAMES[ml._id.month - 1],
        leads: ml.leads,
        views: mv?.views || 0,
      }
    })

    sendSuccess(res, {
      data: {
        stats: { totalPosts, publishedPosts, totalLeads, hotLeads, totalUsers, pendingComments },
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
    const startDate      = new Date()
    startDate.setMonth(startDate.getMonth() - parseInt(months))

    const [leadsBySource, leadsByStatus, postsByCategory, topPosts] = await Promise.all([
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Post.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Post.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title views slug'),
    ])

    sendSuccess(res, { data: { leadsBySource, leadsByStatus, postsByCategory, topPosts } })
  } catch (err) {
    next(err)
  }
}