function escapeHtml(value) {
  if (!value) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildLeadStaffNotification(lead = {}) {
  const name = lead.name || 'Unknown'
  const phone = lead.contact || 'Not provided'
  const email = lead.email || 'Not provided'
  const city = lead.city || 'Not provided'
  const machine = lead.machines || 'Not specified'
  const message = lead.message || 'No message'

  return {
    subject: `New lead: ${name}`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Lead Alert</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;background:#f3f4f6;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr><td style="padding:20px 24px;background:#111827;color:#ffffff;font-size:20px;font-weight:700;">New Website Lead</td></tr>
            <tr>
              <td style="padding:20px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;width:120px;">Name</td><td style="padding:8px 0;font-size:14px;color:#111827;">${escapeHtml(name)}</td></tr>
                  <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Phone</td><td style="padding:8px 0;font-size:14px;color:#111827;">${escapeHtml(phone)}</td></tr>
                  <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td><td style="padding:8px 0;font-size:14px;color:#111827;">${escapeHtml(email)}</td></tr>
                  <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">City</td><td style="padding:8px 0;font-size:14px;color:#111827;">${escapeHtml(city)}</td></tr>
                  <tr><td style="padding:8px 0;font-size:13px;color:#6b7280;">Machine</td><td style="padding:8px 0;font-size:14px;color:#111827;">${escapeHtml(machine)}</td></tr>
                </table>
                <div style="margin-top:14px;padding:12px;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;color:#111827;line-height:1.6;">
                  ${escapeHtml(message)}
                </div>
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

module.exports = { buildLeadStaffNotification }

