function escapeHtml(value) {
  if (!value) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildLeadAcknowledgmentEmail(lead = {}) {
  const name = lead.name || 'Customer'
  const machine = lead.machines || 'Not specified'
  const helpType = lead.helpType || 'inquiry'

  return {
    subject: `We received your enquiry, ${name}`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Enquiry Received</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:12px;border:1px solid #eceff4;">
            <tr><td style="padding:22px;background:#1f2937;color:#ffffff;font-size:22px;font-weight:700;">ZMS LIZZA</td></tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 10px;color:#111827;font-size:22px;">Thank you for contacting us</h1>
                <p style="margin:0 0 14px;color:#4b5563;line-height:1.7;">Hello ${escapeHtml(
                  name
                )}, we have received your enquiry. Our team will contact you soon.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eceff4;border-radius:8px;overflow:hidden;">
                  <tr>
                    <td style="padding:10px 12px;background:#f9fafb;font-size:13px;color:#6b7280;width:130px;">Machine</td>
                    <td style="padding:10px 12px;font-size:14px;color:#111827;">${escapeHtml(machine)}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 12px;background:#f9fafb;font-size:13px;color:#6b7280;">Request</td>
                    <td style="padding:10px 12px;font-size:14px;color:#111827;">${escapeHtml(helpType)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  }
}

module.exports = { buildLeadAcknowledgmentEmail }

