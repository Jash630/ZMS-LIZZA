export const PRODUCT_CATEGORY_SLUGS = [
  'computerized-embroidery-machines',
  'sequin-embroidery-machines',
  'bead-embroidery-machines',
  'coding-machines',
  'spare-parts',
]

export const SLUG_TO_I18N_KEY = {
  'computerized-embroidery-machines': 'computerizedEmbroidery',
  'sequin-embroidery-machines': 'sequinEmbroidery',
  'bead-embroidery-machines': 'beadEmbroidery',
  'coding-machines': 'codingMachines',
  'spare-parts': 'spareParts',
}

export function getProductCategoryI18nKey(slug) {
  return SLUG_TO_I18N_KEY[slug] || null
}
