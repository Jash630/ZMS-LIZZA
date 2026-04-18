const {
  EMAIL_EVENTS,
  buildLeadStaffAlertEmail,
  buildLeadCustomerAckEmail,
  buildSubscriberWelcomeEmail,
  buildCampaignOfferEmail,
  buildCampaignPostEmail,
  buildCampaignProductEmail,
} = require('./emailTemplateService')
const { enqueueEmailJob, buildDedupeKey } = require('./emailQueueService')

const getAdminNotificationEmail = () =>
  process.env.EMAIL_STAFF_TO || process.env.STAFF_NOTIFICATION_EMAIL || process.env.EMAIL_FROM

const queueLeadAutomationEmails = async (lead) => {
  const adminEmail = getAdminNotificationEmail()
  const jobs = []

  if (adminEmail) {
    const staffTemplate = buildLeadStaffAlertEmail(lead)
    jobs.push(
      enqueueEmailJob({
        eventType: EMAIL_EVENTS.LEAD_STAFF_ALERT,
        to: adminEmail,
        subject: staffTemplate.subject,
        html: staffTemplate.html,
        dedupeKey: buildDedupeKey(EMAIL_EVENTS.LEAD_STAFF_ALERT, lead?._id),
        metadata: {
          leadId: lead?._id,
        },
      })
    )
  }

  if (lead?.email) {
    const customerTemplate = buildLeadCustomerAckEmail(lead)
    jobs.push(
      enqueueEmailJob({
        eventType: EMAIL_EVENTS.LEAD_CUSTOMER_ACK,
        to: lead.email,
        subject: customerTemplate.subject,
        html: customerTemplate.html,
        dedupeKey: buildDedupeKey(EMAIL_EVENTS.LEAD_CUSTOMER_ACK, lead?._id),
        metadata: {
          leadId: lead?._id,
          customerEmail: lead.email,
        },
      })
    )
  }

  return Promise.all(jobs)
}

const queueSubscriberWelcomeEmail = async (subscriber) => {
  if (!subscriber?.email || !subscriber?.unsubscribeToken) return null

  const template = buildSubscriberWelcomeEmail(subscriber)
  return enqueueEmailJob({
    eventType: EMAIL_EVENTS.SUBSCRIBER_WELCOME,
    to: subscriber.email,
    subject: template.subject,
    html: template.html,
    dedupeKey: buildDedupeKey(EMAIL_EVENTS.SUBSCRIBER_WELCOME, subscriber._id, subscriber.updatedAt),
    metadata: {
      subscriberId: subscriber._id,
    },
  })
}

const buildCampaignTemplate = ({ campaignType, payload, subscriber }) => {
  if (campaignType === 'offer') return buildCampaignOfferEmail(payload, subscriber)
  if (campaignType === 'post') return buildCampaignPostEmail(payload, subscriber)
  return buildCampaignProductEmail(payload, subscriber)
}

const getCampaignEventType = (campaignType) => {
  if (campaignType === 'offer') return EMAIL_EVENTS.CAMPAIGN_OFFER
  if (campaignType === 'post') return EMAIL_EVENTS.CAMPAIGN_POST
  return EMAIL_EVENTS.CAMPAIGN_PRODUCT
}

const queueCampaignEmail = async ({ campaignId, campaignType, payload, subscriber }) => {
  if (!subscriber?.email || !subscriber?.unsubscribeToken) return null

  const template = buildCampaignTemplate({ campaignType, payload, subscriber })
  return enqueueEmailJob({
    eventType: getCampaignEventType(campaignType),
    to: subscriber.email,
    subject: template.subject,
    html: template.html,
    dedupeKey: buildDedupeKey('campaign', campaignId, subscriber._id),
    metadata: {
      campaignId,
      campaignType,
      subscriberId: subscriber._id,
    },
  })
}

module.exports = {
  queueLeadAutomationEmails,
  queueSubscriberWelcomeEmail,
  queueCampaignEmail,
}