const APP_BASE_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api/v1'

function escapeHtml(value) {
  if (!value) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildLayout({ title, intro, bodyHtml, ctaText, ctaHref, unsubscribeToken }) {
  const unsubscribeUrl = `${API_BASE_URL}/public/newsletter/unsubscribe?token=${encodeURIComponent(
    unsubscribeToken || ''
  )}`

  return `<!doctype html>
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
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #eceff4;">
            <tr>
              <td style="padding:24px;background:#1f2937;color:#ffffff;">
                <div style="font-size:22px;font-weight:700;">ZMS LIZZA</div>
                <div style="opacity:0.8;font-size:12px;margin-top:4px;">European Technology</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 10px;color:#111827;font-size:22px;">${escapeHtml(title)}</h1>
                <p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">${escapeHtml(intro)}</p>
                ${bodyHtml}
                <div style="margin-top:18px;">
                  <a href="${ctaHref}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:600;border-radius:8px;padding:11px 16px;">
                    ${escapeHtml(ctaText)}
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #eceff4;">
                <div style="font-size:12px;color:#6b7280;">
                  You are receiving this email because you subscribed for ZMS LIZZA updates.
                </div>
                <a href="${unsubscribeUrl}" style="display:inline-block;margin-top:8px;font-size:12px;color:#374151;">
                  Unsubscribe
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function buildWelcomeEmail({ unsubscribeToken } = {}) {
  return {
    subject: 'Welcome to ZMS LIZZA updates',
    html: buildLayout({
      title: 'Welcome',
      intro: 'Thank you for subscribing. You will receive updates for products, blog posts, and offers.',
      bodyHtml:
        '<ul style="margin:0;padding-left:18px;color:#1f2937;line-height:1.7;"><li>New machine launches</li><li>Maintenance tips and blogs</li><li>Promotional offers</li></ul>',
      ctaText: 'Explore Website',
      ctaHref: APP_BASE_URL,
      unsubscribeToken,
    }),
  }
}

function buildNewPostEmail(post = {}, { unsubscribeToken } = {}) {
  const title = post.title || 'New blog post available'
  const excerpt = post.excerpt || 'A new article has been published on ZMS LIZZA.'

  return {
    subject: `New blog post: ${title}`,
    html: buildLayout({
      title: 'New Blog Post',
      intro: title,
      bodyHtml: `<p style="margin:0;color:#1f2937;line-height:1.7;">${escapeHtml(excerpt)}</p>`,
      ctaText: 'Read Blog',
      ctaHref: `${APP_BASE_URL}/?page=blog`,
      unsubscribeToken,
    }),
  }
}

function buildNewProductEmail(product = {}, { unsubscribeToken } = {}) {
  const title = product.name || 'New product launched'
  const summary = product.tagline || product.description || 'We launched a new product in our catalog.'

  return {
    subject: `New product launch: ${title}`,
    html: buildLayout({
      title: 'New Product Launch',
      intro: title,
      bodyHtml: `<p style="margin:0;color:#1f2937;line-height:1.7;">${escapeHtml(summary)}</p>`,
      ctaText: 'View Products',
      ctaHref: `${APP_BASE_URL}/?page=products`,
      unsubscribeToken,
    }),
  }
}

function buildOfferEmail(offer = {}, { unsubscribeToken } = {}) {
  const title = offer.title || 'Special offer'
  const description = offer.description || 'We have a special offer for you.'
  const promoCodeHtml = offer.promoCode
    ? `<div style="margin-top:12px;padding:12px;border:1px dashed #d1d5db;border-radius:8px;background:#f9fafb;">
         <div style="font-size:12px;color:#6b7280;">Promo code</div>
         <div style="font-size:20px;font-weight:700;color:#111827;margin-top:4px;">${escapeHtml(offer.promoCode)}</div>
       </div>`
    : ''

  const imageHtml = offer.image
    ? `<div style="margin-bottom:14px;"><img src="${escapeHtml(offer.image)}" alt="${escapeHtml(
        title
      )}" style="max-width:100%;height:auto;border-radius:10px;" /></div>`
    : ''

  return {
    subject: `${title} | ZMS LIZZA`,
    html: buildLayout({
      title: 'Exclusive Offer',
      intro: title,
      bodyHtml: `${imageHtml}<p style="margin:0;color:#1f2937;line-height:1.7;">${escapeHtml(
        description
      )}</p>${promoCodeHtml}`,
      ctaText: 'Contact Us',
      ctaHref: `${APP_BASE_URL}/?page=contact`,
      unsubscribeToken,
    }),
  }
}

module.exports = {
  buildWelcomeEmail,
  buildNewPostEmail,
  buildNewProductEmail,
  buildOfferEmail,
}

