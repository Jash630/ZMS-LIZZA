const Notification = require('../models/Notification')
const AppError     = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')

// GET /api/v1/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query

    const query = { $or: [{ recipient: req.user.id }, { recipient: null }] }
    if (unreadOnly === 'true') query.read = false

    const skip        = (page - 1) * limit
    const total       = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ ...query, read: false })
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    sendPaginated(res, { data: notifications, total, page, limit, message: `${unreadCount} unread` })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
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
    await Notification.updateMany(
      { $or: [{ recipient: req.user.id }, { recipient: null }], read: false },
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
    const notif = await Notification.findById(req.params.id)
    if (!notif) return next(new AppError('Notification not found', 404))
    await notif.deleteOne()
    sendSuccess(res, { message: 'Notification deleted' })
  } catch (err) {
    next(err)
  }
}
