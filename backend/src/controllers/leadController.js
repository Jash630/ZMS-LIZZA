const Lead         = require('../models/Lead')
const Notification = require('../models/Notification')
const AppError     = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')

// GET /api/v1/leads
exports.getLeads = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, status, source, search } = req.query

    const query = {}
    if (status) query.status = status
    if (source) query.source = source
    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { city:    { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
      ]
    }

    const skip  = (page - 1) * limit
    const total = await Lead.countDocuments(query)
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    sendPaginated(res, { data: leads, total, page, limit })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/leads/:id
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email')
    if (!lead) return next(new AppError('Lead not found', 404))
    sendSuccess(res, { data: lead })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/leads
exports.createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body)

    if (lead.status === 'hot') {
      await Notification.create({
        type:     'lead',
        message:  `New hot lead: ${lead.name} (${lead.machines || ''}) from ${lead.city || 'Unknown'}`,
        refModel: 'Lead',
        refId:    lead._id,
      })
    }

    sendSuccess(res, { data: lead, statusCode: 201, message: 'Lead created successfully' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/v1/leads/:id
exports.updateLead = async (req, res, next) => {
  try {
    const existing = await Lead.findById(req.params.id)
    if (!existing) return next(new AppError('Lead not found', 404))

    if (req.body.status && req.body.status !== existing.status) {
      req.body.statusHistory = [
        ...existing.statusHistory,
        { status: req.body.status, changedBy: req.user.id, note: req.body.statusNote },
      ]
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate('assignedTo', 'name email')

    sendSuccess(res, { data: lead, message: 'Lead updated successfully' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/leads/:id
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) return next(new AppError('Lead not found', 404))
    await lead.deleteOne()
    sendSuccess(res, { message: 'Lead deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// GET /api/v1/leads/stats
exports.getLeadStats = async (req, res, next) => {
  try {
    const [byStatus, bySource, monthly] = await Promise.all([
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      Lead.aggregate([
        {
          $group: {
            _id:   { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
    ])
    sendSuccess(res, { data: { byStatus, bySource, monthly } })
  } catch (err) {
    next(err)
  }
}