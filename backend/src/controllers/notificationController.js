const Notification = require('../models/Notification')
const AppError     = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100)
  return { parsedPage, parsedLimit }
}

const canManageAnyNotification = (user) => ['admin', 'superadmin'].includes(user?.role)

// GET /api/v1/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit)

    const query = { $or: [{ recipient: req.user.id }, { recipient: null }] }
    if (unreadOnly === 'true') query.read = false

    const skip        = (parsedPage - 1) * parsedLimit
    const total       = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ ...query, read: false })
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)

    sendPaginated(res, {
      data: notifications,
      total,
      page: parsedPage,
      limit: parsedLimit,
      message: `${unreadCount} unread`,
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const filter = canManageAnyNotification(req.user)
      ? { _id: req.params.id }
      : { _id: req.params.id, recipient: req.user.id }

    const notif = await Notification.findOneAndUpdate(
      filter,
      { read: true, readAt: new Date() },
      { new: true }
    )
    if (!notif) return next(new AppError('Notification not found', 404))
    sendSuccess(res, { data: notif, message: 'Marked as read' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
  try {
    const query = canManageAnyNotification(req.user)
      ? { read: false }
      : { recipient: req.user.id, read: false }

    await Notification.updateMany(
      query,
      { read: true, readAt: new Date() }
    )
    sendSuccess(res, { message: 'All notifications marked as read' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/notifications/:id
exports.deleteNotification = async (req, res, next) => {
  try {
    const query = canManageAnyNotification(req.user)
      ? { _id: req.params.id }
      : { _id: req.params.id, recipient: req.user.id }

    const notif = await Notification.findOne(query)
    if (!notif) return next(new AppError('Notification not found', 404))
    await notif.deleteOne()
    sendSuccess(res, { message: 'Notification deleted' })
  } catch (err) {
    next(err)
  }
}
