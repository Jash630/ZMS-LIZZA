export const COMPANY_ADDRESS = '128 ZMS LIZZA EMBROIDERY MACHINE, RJD Business Hub Near Bada Ganesh Temple, Naginawadi, Katargam, Surat, Gujarat 395004'
export const COMPANY_EMAIL = 'infozmslizza@gmail.com'
export const COMPANY_MAP_URL = 'https://maps.app.goo.gl/DGPsk1X8HbFxKNaU8?g_st=aw'
export const COMPANY_MAP_EMBED_QUERY = 'RJD Business Hub, Naginawadi, Katargam, Surat, Gujarat 395004'
export const COMPANY_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(COMPANY_MAP_EMBED_QUERY)}&z=18&output=embed`

export const SUPPORT_PHONE_LOCAL = '9800883300'
export const SUPPORT_PHONE_DISPLAY = '+91 98008 83300'
export const SUPPORT_PHONE_E164 = `+91${SUPPORT_PHONE_LOCAL}`

export const WHATSAPP_DEFAULT_MESSAGE =
  'Hello! I am interested in ZMS LIZZA embroidery machines. Please connect me with customer care.'

export const buildTelUrl = (phone = SUPPORT_PHONE_DISPLAY) => {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return `tel:${SUPPORT_PHONE_E164}`
  const normalized = digits.startsWith('91') ? digits : `91${digits.slice(-10)}`
  return `tel:+${normalized}`
}

export const buildWhatsAppUrl = (phone = SUPPORT_PHONE_DISPLAY, message = WHATSAPP_DEFAULT_MESSAGE) => {
  const digits = String(phone || '').replace(/\D/g, '')
  const normalized = digits
    ? (digits.startsWith('91') ? digits : `91${digits.slice(-10)}`)
    : `91${SUPPORT_PHONE_LOCAL}`
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export const SUPPORT_TEL_URL = buildTelUrl(SUPPORT_PHONE_DISPLAY)
export const SUPPORT_WHATSAPP_URL = buildWhatsAppUrl(SUPPORT_PHONE_DISPLAY)
