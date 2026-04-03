export const PRODUCTS = [
  {
    id: 'high-speed-embroidery',
    name: 'High-Speed Embroidery Machine',
    tagline: 'Core embroidery with exceptional speed',
    badge: 'Foundation Series',
    description: 'Core embroidery capabilities with exceptional speed and precision for high-volume production.',
    keySpecs: ['1200 SPM', 'Multiple Heads', 'Computerized'],
    image: 'https://images.unsplash.com/photo-1663888673897-f8bc14482f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
  {
    id: 'sequins-embroidery',
    name: 'Sequins Embroidery Machine',
    tagline: 'Single to 8-sequin precision work',
    badge: 'Popular Choice',
    badgeOrange: true,
    description: 'Specialized sequin work from single to 8-sequin designs with unmatched precision.',
    keySpecs: ['High Precision', '1-8 Sequins', 'Fast Speed'],
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    isPopular: true,
  },
  {
    id: 'beads-embroidery',
    name: 'Beads Embroidery Machine',
    tagline: 'Perfect bead placement for intricate designs',
    badge: 'Premium Quality',
    description: 'Perfect bead placement for intricate designs with multiple bead size compatibility.',
    keySpecs: ['Multiple Bead Sizes', 'Precise Control', 'Durable'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
  {
    id: 'coding-coiling',
    name: 'Coding & Coiling Machine',
    tagline: 'Expert coding and coiling for detailed work',
    badge: 'Specialized',
    description: 'Expert coding and coiling for detailed work with fine precision and consistent quality.',
    keySpecs: ['Fine Details', 'Consistent Quality', 'Efficient'],
    image: 'https://images.unsplash.com/photo-1619209703532-d30117f3eff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  },
  {
    id: 'multi-function',
    name: 'Multi-Function Pro Series',
    tagline: 'Sequins, beads, and coding in one machine',
    badge: 'Best Value',
    badgeOrange: true,
    description: 'Sequins, beads, and coding in one powerful machine — maximum versatility for any need.',
    keySpecs: ['All-in-One', 'Maximum Versatility', '1200 SPM'],
    image: 'https://images.unsplash.com/photo-1663888673897-f8bc14482f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    isFeatured: true,
    isPopular: true,
  },
]

export const PRODUCT_DETAILS = {
  'multi-function': {
    id: 'multi-function',
    name: 'Multi-Function Pro Series',
    tagline: 'Sequins, beads, and coding in one powerful machine',
    badge: 'Best Seller',
    description: 'The Multi-Function Pro Series is our flagship embroidery machine, combining sequin work, bead placement, and coding functions in a single high-performance unit.',
    keyFeatures: [
      '⚡ Speed: 1200 stitches per minute',
      '🎯 Sequin capacity: 1-8 sequins',
      '🔧 12 heads, 9 needles per head',
      '💻 European computerized control panel',
      '⚙️ Multi-function: sequins + beads + coding',
      '✅ 2-year warranty included',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1663888673897-f8bc14482f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      'https://images.unsplash.com/photo-1619209703532-d30117f3eff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    ],
    specifications: {
      Performance: [
        { label: 'Machine Speed', value: '1200 stitches/minute' },
        { label: 'Number of Heads', value: '12' },
        { label: 'Needles per Head', value: '9' },
        { label: 'Production Output', value: 'Up to 500 pieces/hour' },
      ],
      Functionality: [
        { label: 'Sequin Capacity', value: '1-8 sequins' },
        { label: 'Bead Size', value: '2mm – 8mm' },
        { label: 'Coding/Coiling', value: 'Yes, integrated' },
        { label: 'Supported Formats', value: 'DST, DSB, Tajima' },
      ],
      Technical: [
        { label: 'Control Panel', value: 'European computerized system' },
        { label: 'Motor Type', value: 'Servo motor' },
        { label: 'Power Requirements', value: '220V, 50Hz' },
        { label: 'Weight', value: 'Contact for details' },
      ],
      'Warranty & Support': [
        { label: 'Warranty Period', value: '2 years comprehensive' },
        { label: 'Installation', value: 'Included, on-site' },
        { label: 'Training', value: 'Complimentary 2-day training' },
        { label: 'Support', value: '24/7 technical assistance' },
      ],
    },
    features: [
      {
        title: 'High-Speed Performance',
        description: 'Achieves up to 1200 stitches per minute with European servo motor technology.',
        benefit: 'Complete orders faster and increase daily output by up to 40%',
        image: 'https://images.unsplash.com/photo-1663888673897-f8bc14482f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      },
      {
        title: 'Multi-Sequin Capability',
        description: 'Handles 1 to 8 sequins per stitch with precise sequin delivery.',
        benefit: 'Handle complex designs without machine changes, saving 2+ hours per shift',
        image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      },
      {
        title: 'Precise Bead Placement',
        description: 'Accommodates bead sizes from 2mm to 8mm with zero misalignment.',
        benefit: 'Zero wastage and perfect bead alignment every time',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      },
      {
        title: 'European Control System',
        description: 'Intuitive touchscreen control panel with multi-language support including Hindi.',
        benefit: 'Intuitive operation, fewer errors, and easy design loading',
        image: 'https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      },
      {
        title: 'Easy Maintenance Design',
        description: 'Engineered for quick access to all key components, reducing average servicing time by 60%.',
        benefit: 'Minimal downtime, quick servicing, and lower maintenance costs',
        image: 'https://images.unsplash.com/photo-1565010640914-8d817b58d808?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
      },
    ],
    applications: ['Garment Embroidery', 'Saree Decoration', 'Lehenga Work', 'Boutique Customization', 'Export Quality Production', 'Bulk Orders'],
    packageIncludes: [
      { title: 'Machine Package', items: ['Machine unit', 'European control panel', 'Standard accessories kit', 'User manual (Hindi/English)'] },
      { title: 'Installation & Training', items: ['On-site installation', 'Operator training (2 days)', 'Setup assistance', 'Test run documentation'] },
      { title: 'After-Sales Support', items: ['2-year comprehensive warranty', '24/7 technical support', 'Spare parts availability', 'Maintenance guidance'] },
    ],
    faqs: [
      { q: 'What designs can this machine handle?', a: 'The Multi-Function Pro Series handles all types of embroidery including sequins (1-8), beads (2-8mm), coding, coiling, and standard embroidery.' },
      { q: 'How long does installation take?', a: 'Standard installation takes 1-2 days. Our certified technicians handle everything from machine positioning to calibration, test runs, and initial design loading.' },
      { q: 'Is operator training provided?', a: 'Yes. We provide a comprehensive 2-day on-site training program covering machine operation, design loading, maintenance routines, and troubleshooting.' },
      { q: 'What does the warranty cover?', a: 'Our 2-year comprehensive warranty covers all mechanical parts, electrical systems, the European control panel, and motor components.' },
      { q: 'Do you provide spare parts?', a: 'Yes, we maintain a full inventory of spare parts for all our machines. Parts available for same-day or next-day delivery within Gujarat.' },
      { q: 'Can I see a demo before purchasing?', a: 'Absolutely! We have a fully operational showroom in Surat where you can see the machine running live with your own designs.' },
    ],
  },
}

export function getProductDetail(id) {
  return PRODUCT_DETAILS[id] || PRODUCT_DETAILS['multi-function']
}