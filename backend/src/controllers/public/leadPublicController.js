const Lead = require('../../models/Lead')
const Notification = require('../../models/Notification')
const { sendSuccess } = require('../../utils/apiResponse')
const logger = require('../../utils/logger')
const { queueLeadAutomationEmails } = require('../../services/emailAutomationService')

// POST /api/v1/public/leads
exports.createPublicLead = async (req, res, next) => {
  try {
    const payload = {
      name: (req.body.name || req.body.fullName || '').trim(),
      contact: (req.body.contact || req.body.phone || '').trim(),
      email: String(req.body.email || '').trim().toLowerCase() || undefined,
      businessName: req.body.businessName || undefined,
      city: req.body.city || undefined,
      state: req.body.state || undefined,
      source: 'Website',
      status: 'warm',
      machines: req.body.machines || req.body.machineInterest || undefined,
      helpType: req.body.helpType || 'inquiry',
      message: req.body.message || undefined,
      notes: req.body.notes || req.body.message || undefined,
    }

    const lead = await Lead.create(payload)

    if (lead.status === 'hot') {
      await Notification.create({
        type: 'lead',
        message: `New hot lead: ${lead.name} (${lead.machines || ''}) from ${lead.city || 'Unknown'}`,
        refModel: 'Lead',
        refId: lead._id,
      })
    }

    try {
      await queueLeadAutomationEmails(lead)
    } catch (error) {
      logger.warn(`Lead email automation queueing failed for ${lead._id}: ${error.message}`)
    }

    sendSuccess(res, {
      statusCode: 201,
      message: 'Enquiry submitted successfully',
      data: {
        id: lead._id,
        status: lead.status,
      },
    })
  } catch (err) {
    next(err)
  }
}
