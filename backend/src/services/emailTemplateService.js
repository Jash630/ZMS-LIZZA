const APP_BASE_URL = process.env.CLIENT_URL || 'https://zmslizzafrontend.vercel.app'
const API_BASE_URL = process.env.API_BASE_URL || 'https://zms-lizza-backend.onrender.com/api/v1'

const EMAIL_EVENTS = {
  LEAD_STAFF_ALERT: 'lead.staff_alert',
  LEAD_CUSTOMER_ACK: 'lead.customer_ack',
  SUBSCRIBER_WELCOME: 'subscriber.welcome',
  CAMPAIGN_OFFER: 'campaign.offer',
  CAMPAIGN_POST: 'campaign.post',
  CAMPAIGN_PRODUCT: 'campaign.product',
}

const escapeHtml = (value) => {
  if (value === undefined || value === null) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const buildLayout = ({ title, intro, bodyHtml, ctaText, ctaHref, footerHtml = '' }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:24px;background:#111827;color:#ffffff;">
                <div style="font-size:22px;font-weight:700;">LIZZA INDIA PRIVATE LIMITED</div>
                <div style="opacity:0.8;font-size:12px;margin-top:4px;">ZMS LIZZA - European Technology</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 10px;color:#111827;font-size:22px;">${escapeHtml(title)}</h1>
                <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">${escapeHtml(intro)}</p>
                ${bodyHtml}
                ${ctaHref && ctaText ? `<div style="margin-top:18px;"><a href="${ctaHref}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:600;border-radius:8px;padding:11px 16px;">${escapeHtml(ctaText)}</a></div>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #eceff4;">
                <div style="font-size:12px;color:#6b7280;line-height:1.6;">
                  This is an automated email from LIZZA INDIA PRIVATE LIMITED.
                </div>
                ${footerHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

const buildLeadStaffAlertEmail = (lead) => {
  const safe = {
    name: escapeHtml(lead?.name || 'Unknown'),
    contact: escapeHtml(lead?.contact || 'Not provided'),
    email: escapeHtml(lead?.email || 'Not provided'),
    city: escapeHtml(lead?.city || 'Not provided'),
    businessName: escapeHtml(lead?.businessName || 'Not provided'),
    machines: escapeHtml(lead?.machines || 'Not specified'),
    helpType: escapeHtml(lead?.helpType || 'inquiry'),
    message: escapeHtml(lead?.message || 'No message provided'),
  }

  const bodyHtml = `
    <p style="margin:0 0 14px;color:#111827;font-weight:600;">A new potential lead has submitted an enquiry.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Name</td><td style="padding:8px 0;font-size:14px;color:#111827;">${safe.name}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Phone</td><td style="padding:8px 0;font-size:14px;color:#111827;">${safe.contact}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td><td style="padding:8px 0;font-size:14px;color:#111827;">${safe.email}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Business</td><td style="padding:8px 0;font-size:14px;color:#111827;">${safe.businessName}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">City</td><td style="padding:8px 0;font-size:14px;color:#111827;">${safe.city}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Machine Interest</td><td style="padding:8px 0;font-size:14px;color:#111827;">${safe.machines}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Request Type</td><td style="padding:8px 0;font-size:14px;color:#111827;text-transform:capitalize;">${safe.helpType}</td></tr>
    </table>
    <div style="margin-top:14px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
      <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Message</div>
      <div style="font-size:14px;color:#111827;line-height:1.6;">${safe.message}</div>
    </div>
  `

  return {
    subject: `New potential lead enquiry: ${lead?.name || 'Customer'}`,
    html: buildLayout({
      title: 'New Lead Enquiry',
      intro: 'Please follow up with this customer as soon as possible.',
      bodyHtml,
      ctaText: 'Open Admin Dashboard',
      ctaHref: `${APP_BASE_URL}/admin`,
    }),
  }
}

const buildLeadCustomerAckEmail = (lead) => {
  const safeName = escapeHtml(lead?.name || 'Customer')
  const safeMachine = escapeHtml(lead?.machines || 'your requested machine')
  const safeHelpType = escapeHtml(lead?.helpType || 'inquiry')

  const bodyHtml = `
    <p style="margin:0 0 10px;color:#1f2937;line-height:1.7;">Dear ${safeName},</p>
    <p style="margin:0 0 10px;color:#1f2937;line-height:1.7;">
      Thank you for contacting <strong>LIZZA INDIA PRIVATE LIMITED</strong>. We have received your enquiry.
    </p>
    <p style="margin:0 0 10px;color:#1f2937;line-height:1.7;">
      Our team will contact you soon regarding <strong>${safeMachine}</strong> (${safeHelpType}).
    </p>
    <p style="margin:0;color:#1f2937;line-height:1.7;">
      If your request is urgent, please reply to this email or call customer care.
    </p>
  `

  return {
    subject: `Thank you for contacting LIZZA INDIA PRIVATE LIMITED, ${lead?.name || 'Customer'}`,
    html: buildLayout({
      title: 'Enquiry Received',
      intro: 'Thank you for reaching out to us.',
      bodyHtml,
      ctaText: 'Visit Website',
      ctaHref: APP_BASE_URL,
    }),
  }
}

const buildSubscriberWelcomeEmail = (subscriber) => {
  const unsubscribeUrl = `${API_BASE_URL}/public/newsletter/unsubscribe?token=${encodeURIComponent(subscriber?.unsubscribeToken || '')}`

  const bodyHtml = `
    <p style="margin:0;color:#1f2937;line-height:1.7;">
      Thank you for subscribing to ZMS LIZZA updates. You will receive new product launches, blog updates, and offers.
    </p>
  `

  return {
    subject: 'Welcome to ZMS LIZZA updates',
    html: buildLayout({
      title: 'Welcome',
      intro: 'Your subscription is now active.',
      bodyHtml,
      ctaText: 'Explore Website',
      ctaHref: APP_BASE_URL,
      footerHtml: `<a href="${unsubscribeUrl}" style="display:inline-block;margin-top:8px;font-size:12px;color:#374151;">Unsubscribe</a>`,
    }),
  }
}

const buildCampaignOfferEmail = (offer = {}, subscriber = {}) => {
  const unsubscribeUrl = `${API_BASE_URL}/public/newsletter/unsubscribe?token=${encodeURIComponent(subscriber?.unsubscribeToken || '')}`
  const title = escapeHtml(offer.title || 'Special Offer')
  const description = escapeHtml(offer.description || 'We have a special offer for you.')
  const promoCode = escapeHtml(offer.promoCode || '')
  const image = offer.image ? `<div style="margin-bottom:14px;"><img src="${escapeHtml(offer.image)}" alt="${title}" style="max-width:100%;height:auto;border-radius:10px;" /></div>` : ''
  const promoHtml = promoCode
    ? `<div style="margin-top:12px;padding:12px;border:1px dashed #d1d5db;border-radius:8px;background:#f9fafb;"><div style="font-size:12px;color:#6b7280;">Promo code</div><div style="font-size:20px;font-weight:700;color:#111827;margin-top:4px;">${promoCode}</div></div>`
    : ''

  return {
    subject: `${title} | ZMS LIZZA`,
    html: buildLayout({
      title: 'Exclusive Offer',
      intro: title,
      bodyHtml: `${image}<p style="margin:0;color:#1f2937;line-height:1.7;">${description}</p>${promoHtml}`,
      ctaText: 'Contact Us',
      ctaHref: `${APP_BASE_URL}/?page=contact`,
      footerHtml: `<a href="${unsubscribeUrl}" style="display:inline-block;margin-top:8px;font-size:12px;color:#374151;">Unsubscribe</a>`,
    }),
  }
}

const buildCampaignPostEmail = (post = {}, subscriber = {}) => {
  const unsubscribeUrl = `${API_BASE_URL}/public/newsletter/unsubscribe?token=${encodeURIComponent(subscriber?.unsubscribeToken || '')}`
  const title = escapeHtml(post.title || 'New blog post available')
  const excerpt = escapeHtml(post.excerpt || 'A new article has been published on ZMS LIZZA.')

  return {
    subject: `New blog post: ${title}`,
    html: buildLayout({
      title: 'New Blog Post',
      intro: title,
      bodyHtml: `<p style="margin:0;color:#1f2937;line-height:1.7;">${excerpt}</p>`,
      ctaText: 'Read Blog',
      ctaHref: `${APP_BASE_URL}/?page=blog`,
      footerHtml: `<a href="${unsubscribeUrl}" style="display:inline-block;margin-top:8px;font-size:12px;color:#374151;">Unsubscribe</a>`,
    }),
  }
}

const buildCampaignProductEmail = (product = {}, subscriber = {}) => {
  const unsubscribeUrl = `${API_BASE_URL}/public/newsletter/unsubscribe?token=${encodeURIComponent(subscriber?.unsubscribeToken || '')}`
  const title = escapeHtml(product.name || 'New product launched')
  const summary = escapeHtml(product.tagline || product.description || 'We launched a new product in our catalog.')

  return {
    subject: `New product launch: ${title}`,
    html: buildLayout({
      title: 'New Product Launch',
      intro: title,
      bodyHtml: `<p style="margin:0;color:#1f2937;line-height:1.7;">${summary}</p>`,
      ctaText: 'View Products',
      ctaHref: `${APP_BASE_URL}/?page=products`,
      footerHtml: `<a href="${unsubscribeUrl}" style="display:inline-block;margin-top:8px;font-size:12px;color:#374151;">Unsubscribe</a>`,
    }),
  }
}

module.exports = {
  EMAIL_EVENTS,
  buildLeadStaffAlertEmail,
  buildLeadCustomerAckEmail,
  buildSubscriberWelcomeEmail,
  buildCampaignOfferEmail,
  buildCampaignPostEmail,
  buildCampaignProductEmail,
}