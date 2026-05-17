const SITE_URL = String(import.meta.env.VITE_SITE_URL || 'https://lizza.in').replace(/\/+$/, '')

const setMetaTag = (attribute, key, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

const setCanonicalLink = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

const setJsonLd = (data) => {
  const existing = document.getElementById('app-jsonld')
  if (existing) existing.remove()
  if (!data) return

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'app-jsonld'
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

export const trimDescription = (value, limit = 160) => {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  if (clean.length <= limit) return clean
  return `${clean.slice(0, limit - 1).trim()}...`
}

export const applySeo = ({ title, description, path, type = 'website', schema = null }) => {
  const fullUrl = `${SITE_URL}${path}`
  document.title = title

  setMetaTag('name', 'description', description)
  setMetaTag('name', 'keywords', 'embroidery machine India, computerized embroidery machine India, sequin embroidery machine India, bead embroidery machine, coding embroidery machine, embroidery machine spare parts, embroidery machine manufacturer India, embroidery machine supplier Surat')
  setMetaTag('name', 'author', 'Lizza India Private Limited')
  setMetaTag('name', 'application-name', 'ZMS LIZZA')
  setMetaTag('name', 'theme-color', '#ff6b35')
  setMetaTag('name', 'robots', 'index,follow')
  setMetaTag('property', 'og:type', type)
  setMetaTag('property', 'og:site_name', 'ZMS LIZZA')
  setMetaTag('property', 'og:locale', 'en_IN')
  setMetaTag('property', 'og:title', title)
  setMetaTag('property', 'og:description', description)
  setMetaTag('property', 'og:url', fullUrl)
  setMetaTag('property', 'og:image', `${SITE_URL}/bgr_logo.png`)
  setMetaTag('property', 'og:image:alt', 'ZMS LIZZA embroidery machines by Lizza India Private Limited')
  setMetaTag('name', 'twitter:card', 'summary_large_image')
  setMetaTag('name', 'twitter:site', '@zmslizza')
  setMetaTag('name', 'twitter:title', title)
  setMetaTag('name', 'twitter:description', description)
  setMetaTag('name', 'twitter:image', `${SITE_URL}/bgr_logo.png`)
  setMetaTag('name', 'twitter:image:alt', 'ZMS LIZZA embroidery machines by Lizza India Private Limited')

  setCanonicalLink(fullUrl)
  setJsonLd(schema)
}

export const companyAddress = {
  '@type': 'PostalAddress',
  streetAddress: '128 ZMS LIZZA EMBROIDERY MACHINE, RJD Business Hub Near Bada Ganesh Temple, Naginawadi, Katargam',
  addressLocality: 'Surat',
  postalCode: '395004',
  addressRegion: 'Gujarat',
  addressCountry: 'IN',
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Lizza India Private Limited',
  brand: 'ZMS LIZZA',
  url: SITE_URL,
  logo: `${SITE_URL}/bgr_logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9800883300',
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi', 'Gujarati'],
  },
  address: companyAddress,
}

export const localBusinessSchema = {
  ...organizationSchema,
  '@type': 'LocalBusiness',
  image: `${SITE_URL}/bgr_logo.png`,
}

export const buildProductSchema = ({ name, description, path, category, image }) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description,
  category,
  brand: {
    '@type': 'Brand',
    name: 'ZMS LIZZA',
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'Lizza India Private Limited',
  },
  image: image ? [image] : [`${SITE_URL}/bgr_logo.png`],
  url: `${SITE_URL}${path}`,
})

export const buildFaqSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
})
