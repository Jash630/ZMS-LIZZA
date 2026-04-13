const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
  override: true,
})
const mongoose     = require('mongoose')
const connectDB    = require('../config/db')
const User         = require('../models/User')
const Post         = require('../models/Post')
const Product      = require('../models/Product')
const Comment      = require('../models/Comment')
const Lead         = require('../models/Lead')
const Notification = require('../models/Notification')
const SeoSettings  = require('../models/SeoSettings')
const Settings     = require('../models/Settings')
const ContentView  = require('../models/ContentView')

// ── Sample Users ──────────────────────────────────────
const users = [
  { name: 'Ravi Kumar',   email: 'superadmin@zmslizza.com', password: 'super123',  role: 'superadmin', status: 'active'   },
  { name: 'Priya Sharma', email: 'admin@zmslizza.com',      password: 'admin123',  role: 'admin',      status: 'active'   },
  { name: 'Arjun Mehta',  email: 'editor@zmslizza.com',     password: 'editor123', role: 'editor',     status: 'active'   },
  { name: 'Sneha Patel',  email: 'sneha@zmslizza.com',      password: 'editor123', role: 'editor',     status: 'inactive' },
]

const getPosts = (authorIds) => [
  {
    title:       '5 Reasons ZJ-Series is Best for Indian Factories',
    content:     '<h2>Why ZJ Series Dominates</h2><p>The ZJ-Series embroidery machine by ZMS LIZZA has become the top choice for textile factories across India...</p>',
    excerpt:     'Discover why thousands of Indian embroidery factories trust ZJ-Series machines.',
    category:    'Product',
    tags:        ['embroidery', 'zj-series', 'india', 'textile'],
    author:      authorIds[1],
    status:      'published',
    publishedAt: new Date('2024-03-01'),
    views:       2840,
    seoTitle: 'ZJ-Series Embroidery Machine for Indian Factories',
    seoDescription: 'Top 5 reasons ZJ-Series embroidery machine is best for Indian textile factories.',
  },
  {
    title:       'How to Maintain Your Embroidery Machine for Maximum Life',
    content:     '<p>Regular maintenance is the secret to keeping your embroidery machine running at peak performance for 10+ years...</p>',
    excerpt:     'Step-by-step maintenance guide from ZMS LIZZA technicians.',
    category:    'Guide',
    tags:        ['maintenance', 'guide', 'tips'],
    author:      authorIds[2],
    status:      'published',
    publishedAt: new Date('2024-02-26'),
    views:       1920,
  },
  {
    title:       'ZMS LIZZA Expands to South India Market',
    content:     '<p>ZMS LIZZA European Technology is proud to announce the opening of our South India Service Center in Coimbatore...</p>',
    excerpt:     'ZMS LIZZA opens new service center in Coimbatore.',
    category:    'News',
    tags:        ['news', 'expansion', 'south-india'],
    author:      authorIds[0],
    status:      'published',
    publishedAt: new Date('2024-02-20'),
    views:       1540,
  },
  {
    title:       'Thread Tension Guide for Dense Embroidery Designs',
    content:     '<p>Getting perfect thread tension is one of the most challenging aspects of embroidery...</p>',
    excerpt:     'Master thread tension settings for flawless dense embroidery designs.',
    category:    'Guide',
    tags:        ['thread', 'tension', 'guide'],
    author:      authorIds[2],
    status:      'draft',
    views:       0,
  },
  {
    title:       'Case Study: 200% ROI in 18 Months — Tirupur Factory',
    content:     '<p>Discover how a garment factory in Tirupur achieved 200% ROI within 18 months...</p>',
    excerpt:     'Real-world case study of a Tirupur factory with exceptional returns.',
    category:    'Case Study',
    tags:        ['case-study', 'roi', 'tirupur'],
    author:      authorIds[0],
    status:      'published',
    publishedAt: new Date('2024-02-15'),
    views:       3100,
  },
]

const leads = [
  { name: 'Vikram Textiles',   contact: '+91 98765 43210', city: 'Surat',      state: 'Gujarat',     source: 'WhatsApp', status: 'hot',  machines: '10 heads', notes: 'Very interested. Call back Monday.' },
  { name: 'Ravi Embroidery',   contact: '+91 87654 32109', city: 'Tirupur',    state: 'Tamil Nadu',  source: 'Website',  status: 'warm', machines: '4 heads',  notes: 'Requested catalog.' },
  { name: 'Kumar Fashion',     contact: '+91 76543 21098', city: 'Mumbai',     state: 'Maharashtra', source: 'Call',     status: 'cold', machines: '2 heads',  notes: 'Budget concern.' },
  { name: 'Star Garments',     contact: '+91 65432 10987', city: 'Delhi',      state: 'Delhi',       source: 'WhatsApp', status: 'hot',  machines: '20 heads', notes: 'Large order. Priority!' },
  { name: 'Mehta Brothers',    contact: '+91 54321 09876', city: 'Ahmedabad',  state: 'Gujarat',     source: 'Website',  status: 'warm', machines: '6 heads',  notes: 'Demo scheduled next week.' },
  { name: 'Southern Stitch',   contact: '+91 43210 98765', city: 'Coimbatore', state: 'Tamil Nadu',  source: 'Referral', status: 'hot',  machines: '15 heads', notes: 'Referred by Ravi Embroidery.' },
  { name: 'Patil Enterprises', contact: '+91 32109 87654', city: 'Pune',       state: 'Maharashtra', source: 'WhatsApp', status: 'cold', machines: '2 heads',  notes: 'Will reconsider in Q2.' },
]

const getProducts = (authorIds) => [
  {
    name: 'Sequins Embroidery Machine',
    category: 'Embroidery Machine',
    modelNo: 'LZ-SQ-1200',
    tagline: 'Automatic sequins embroidery solution for premium decorative work',
    badge: 'Top Seller',
    priceDisplay: 'Rs 55,00,000 / Piece',
    priceNote: 'Get Latest Price',
    image: '',
    description: 'We offer a complete range of automatic sequins embroidery machines for high-quality textile production with stable output and long-duty operation.',
    keySpecs: ['1 Needle', 'Automatic', '240 V', '10 kW', '1 Year Warranty'],
    keyFeatures: [
      'High-speed sequins handling with uniform finishing',
      'Low vibration frame for stable long runs',
      'Suitable for fashion and industrial embroidery work',
    ],
    galleryImages: [],
    specifications: [
      {
        category: 'Specifications',
        items: [
          { label: 'Number Of Needles', value: '1' },
          { label: 'Machine Type', value: 'Automatic' },
          { label: 'Types Of Embroidery Machine', value: 'Sequin Machine' },
          { label: 'Voltage', value: '240 V' },
          { label: 'Material', value: 'Mild Steel' },
          { label: 'Warranty', value: '1 Year' },
          { label: 'Power Consumption', value: '10 kW' },
        ],
      },
    ],
    features: [
      { title: 'Automatic Sequin Feed', description: 'Consistent sequins placement at production speed.' },
      { title: 'Stable Chassis', description: 'Rigid build for reduced vibration and better stitch quality.' },
      { title: 'Factory Ready', description: 'Built for continuous operation in textile units.' },
    ],
    applications: ['Designer Garments', 'Premium Fashionwear', 'Decorative Textile Work'],
    packageIncludes: [
      { title: 'Included', items: ['Machine setup support', 'Operator orientation', 'Basic accessories'] },
    ],
    faqs: [
      { q: 'Is this suitable for daily industrial operation?', a: 'Yes. It is built for factory shifts and continuous production use.' },
    ],
    isFeatured: true,
    isPopular: true,
    status: 'published',
    publishedAt: new Date('2026-03-01'),
    views: 950,
    author: authorIds[1],
  },
  {
    name: 'Single Head Embroidery Machine',
    category: 'Embroidery Machine',
    modelNo: 'LZ-SH-650',
    tagline: 'Compact automatic embroidery machine for sampling and boutique work',
    badge: 'SME Choice',
    priceDisplay: 'Rs 3,50,000 / Piece',
    priceNote: 'Get Latest Price',
    image: '',
    description: 'A compact single-head embroidery machine ideal for boutique units, custom orders, sampling operations, and flexible production environments.',
    keySpecs: ['7 Needles', 'Automatic', '650 Stitches/Min', 'Single Head'],
    keyFeatures: [
      'Ideal for custom and low-batch embroidery orders',
      'Low power consumption and easy maintenance',
      'Reliable stitch quality for daily workshop use',
    ],
    galleryImages: [],
    specifications: [
      {
        category: 'Specifications',
        items: [
          { label: 'Number of Needles', value: '7' },
          { label: 'Automation Grade', value: 'Automatic' },
          { label: 'Voltage', value: '220 V' },
          { label: 'Capacity', value: '650 Stitches/Min' },
          { label: 'No. Of Heads', value: 'Single Head' },
          { label: 'Material', value: 'Mild Steel' },
          { label: 'Warranty', value: '1 Year' },
          { label: 'Max Speed For Flat Stitch', value: '2000 SPM' },
          { label: 'Power Consumption', value: '0.5 kW' },
          { label: 'Stitch Length', value: '12.7 mm' },
          { label: 'Power Source', value: 'Electric' },
          { label: 'Phase', value: 'Single Phase' },
        ],
      },
    ],
    features: [
      { title: 'Compact Footprint', description: 'Fits easily in small and medium workshop spaces.' },
      { title: 'Easy Operation', description: 'Simple controls for faster operator onboarding.' },
      { title: 'Low Running Cost', description: 'Efficient power use and maintenance-friendly design.' },
    ],
    applications: ['Boutique Production', 'Sampling', 'Name and Logo Work'],
    packageIncludes: [
      { title: 'Included', items: ['Machine installation support', 'Starter tool kit', 'Basic training'] },
    ],
    faqs: [
      { q: 'Is this a good entry machine for new units?', a: 'Yes. It is one of the best choices for startups and boutique-scale production.' },
    ],
    isFeatured: true,
    isPopular: false,
    status: 'published',
    publishedAt: new Date('2026-03-03'),
    views: 640,
    author: authorIds[0],
  },
  {
    name: 'Computerized Embroidery Machine',
    category: 'Computerized Embroidery Machine',
    modelNo: 'LZ-CE-12H',
    tagline: 'Computerized multi-head embroidery with smooth digital control',
    badge: 'Digital Control',
    priceDisplay: 'Rs 5,50,000 / Piece',
    priceNote: 'Get Latest Price',
    image: '',
    description: 'Computerized embroidery solution with intuitive operation and consistent precision, suitable for organized production lines and quality-focused output.',
    keySpecs: ['12 Needles', 'Semi-Automatic', '440 V', 'Multi-Head'],
    keyFeatures: [
      'Computerized pattern control and memory support',
      'Stable stitch quality with production consistency',
      'Suitable for medium to high-volume operations',
    ],
    galleryImages: [],
    specifications: [
      {
        category: 'Specifications',
        items: [
          { label: 'Max Speed For Flat Stitch', value: '500 SPM' },
          { label: 'Number Of Needles', value: '12' },
          { label: 'Machine Type', value: 'Semi-Automatic' },
          { label: 'Voltage', value: '440 V' },
          { label: 'No. Of Heads', value: 'Multi-Head' },
          { label: 'ISI Certified', value: 'Yes' },
          { label: 'Material', value: 'Mild Steel' },
        ],
      },
    ],
    features: [
      { title: 'Digital Precision', description: 'Computerized controls maintain accurate stitch patterns.' },
      { title: 'Production Stability', description: 'Built for repeatable output with reduced manual error.' },
      { title: 'Operator Friendly', description: 'Simple navigation and easy pattern setup workflow.' },
    ],
    applications: ['Uniform Units', 'Commercial Embroidery', 'General Textile Production'],
    packageIncludes: [
      { title: 'Included', items: ['Startup assistance', 'Operator guidance', 'Basic service support'] },
    ],
    faqs: [
      { q: 'Can this machine handle continuous daily orders?', a: 'Yes. It is designed for regular production workloads with stable quality.' },
    ],
    isFeatured: true,
    isPopular: true,
    status: 'published',
    publishedAt: new Date('2026-03-05'),
    views: 780,
    author: authorIds[2],
  },
  {
    name: 'High Speed Flat Embroidery Machine',
    category: 'Embroidery Machine',
    modelNo: 'LZ-HSF-15',
    tagline: 'Heavy-duty high-speed flat embroidery machine for industrial lines',
    badge: 'Factory Grade',
    priceDisplay: 'Rs 30,00,000 / Piece',
    priceNote: 'Get Latest Price',
    image: '',
    description: 'Built for high productivity, this machine delivers speed, stability, and durable performance for demanding textile factories.',
    keySpecs: ['15 Needles', 'Automatic', '380 V', '100000 Stitch/Hr'],
    keyFeatures: [
      'Original control system for smooth production',
      'Strong vibration-resistant body for high speed',
      'Reliable feeding and thread control in long runs',
    ],
    galleryImages: [],
    specifications: [
      {
        category: 'Specifications',
        items: [
          { label: 'Number Of Needles', value: '15' },
          { label: 'Automation Grade', value: 'Automatic' },
          { label: 'Voltage', value: '380 V' },
          { label: 'Capacity', value: '100000 Stitch/hr' },
          { label: 'No. Of Heads', value: 'Single Head' },
          { label: 'Usage/Application', value: 'Textile Industries' },
          { label: 'Warranty', value: '1 Year' },
          { label: 'Max Speed For Flat Stitch', value: '1000-1500 SPM' },
          { label: 'Power Consumption', value: '2 kW' },
          { label: 'Belt Size', value: '50 mm' },
          { label: 'Frequency', value: '60 Hz' },
        ],
      },
    ],
    features: [
      { title: 'Advanced Control', description: 'Original control architecture for full embroidery performance.' },
      { title: 'Vibration-Proof Chassis', description: 'Strong frame for speedy and smooth embroidery.' },
      { title: 'High Precision Pantograph', description: 'Improved motion control for large-area stitching.' },
      { title: 'Powerful Servo System', description: 'Custom servo motor setup for accurate X/Y shaft drive.' },
      { title: 'Durable Rail and Bearings', description: 'Wide linear rails with jumbo bearings for long life.' },
      { title: 'Automatic Oiling Support', description: 'Lubrication support for smoother operation and longer life.' },
    ],
    applications: ['Industrial Garment Units', 'Bulk Production', 'Export-Quality Embroidery'],
    packageIncludes: [
      { title: 'Included', items: ['Installation support', 'Machine setup', 'Initial operator handover'] },
    ],
    faqs: [
      { q: 'Is this machine suitable for high-volume factories?', a: 'Yes. It is designed for large-scale embroidery production and long operation cycles.' },
    ],
    isFeatured: true,
    isPopular: true,
    status: 'published',
    publishedAt: new Date('2026-03-07'),
    views: 1100,
    author: authorIds[1],
  },
  {
    name: 'Custom Embroidery Machine (As Per Requirement)',
    category: 'Custom Embroidery Machines',
    modelNo: 'LZ-CUSTOM',
    tagline: 'Tailor-made embroidery machine solutions for unique production goals',
    badge: 'Custom Solution',
    priceDisplay: 'Price On Request',
    priceNote: 'Share Requirement',
    image: '',
    description: 'We design and configure custom embroidery machines based on your fabric type, output targets, head configuration, and special process requirements.',
    keySpecs: ['Custom Heads', 'Custom Attachments', 'Factory-specific Configuration'],
    keyFeatures: [
      'Machine design based on your exact use case',
      'Custom attachments for specialty embroidery work',
      'Consultation from technical team before final setup',
    ],
    galleryImages: [],
    specifications: [
      {
        category: 'Customization Options',
        items: [
          { label: 'Head Configuration', value: 'As per requirement' },
          { label: 'Embroidery Type', value: 'Flat / Sequin / Beads / Mixed' },
          { label: 'Automation Level', value: 'Semi or Full Automatic' },
          { label: 'Application', value: 'As per production need' },
        ],
      },
    ],
    features: [
      { title: 'Requirement Analysis', description: 'We study your operation before proposing machine configuration.' },
      { title: 'Custom Build', description: 'Machine features are aligned to your material and output goals.' },
      { title: 'Deployment Support', description: 'Setup, calibration, and training are provided for your team.' },
    ],
    applications: ['Specialty Embroidery', 'Prototype and R&D', 'Factory Expansion Projects'],
    packageIncludes: [
      { title: 'Included', items: ['Pre-sales consultation', 'Technical recommendation', 'Commissioning support'] },
    ],
    faqs: [
      { q: 'Can you make machines for specific product lines?', a: 'Yes. We provide custom machine configurations as per your exact production requirements.' },
    ],
    isFeatured: true,
    isPopular: true,
    status: 'published',
    publishedAt: new Date('2026-03-09'),
    views: 520,
    author: authorIds[0],
  },
]

const seoSettings = {
  siteTitle:       'ZMS LIZZA – Best Embroidery Machine Manufacturer in India | ZJ Series',
  siteDescription: 'ZMS LIZZA European Technology offers premium multi-head embroidery machines for Indian textile factories.',
  siteKeywords:    ['embroidery machine', 'ZJ series', 'textile machinery india', 'ZMS LIZZA'],
  robots:          'index, follow',
  trackedKeywords: [
    { keyword: 'embroidery machine manufacturer india', position: 3,  volume: 2400, change: 2  },
    { keyword: 'ZJ series embroidery',                  position: 1,  volume: 480,  change: 0  },
    { keyword: 'industrial embroidery machine price',   position: 8,  volume: 5400, change: -1 },
    { keyword: 'best embroidery machine for factory',   position: 12, volume: 1900, change: 4  },
    { keyword: 'ZMS LIZZA machine',                     position: 1,  volume: 320,  change: 0  },
  ],
}

const dashboardSettings = {
  general: {
    siteName: 'ZMS LIZZA',
    tagline: 'European Technology - Embroidery Machine Manufacturer',
    siteUrl: 'https://zmslizza.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'info@zmslizza.com',
    address: 'Mumbai, Maharashtra, India',
  },
  appearance: {
    defaultTheme: 'light',
    brandAccent: '#E63946',
  },
  notifications: {
    newLeadEnquiries: true,
    commentModeration: true,
    postPublished: true,
    systemUpdates: true,
    weeklyPerformanceReport: true,
  },
}

// ── Seed ─────────────────────────────────────────────
const importData = async () => {
  try {
    await connectDB()
    console.log('🌱 Starting seed...')

    await Promise.all([
      User.deleteMany(),
      Post.deleteMany(),
      Product.deleteMany(),
      Comment.deleteMany(),
      Lead.deleteMany(),
      Notification.deleteMany(),
      SeoSettings.deleteMany(),
      Settings.deleteMany(),
      ContentView.deleteMany(),
    ])
    console.log('🗑️  Cleared existing data')

    const createdUsers = await User.create(users)
    console.log(`✅ Created ${createdUsers.length} users`)

    const superAdmin = createdUsers.find(u => u.role === 'superadmin')
    const admin      = createdUsers.find(u => u.role === 'admin')
    const editor     = createdUsers.find(u => u.role === 'editor')

    const postData = getPosts([superAdmin._id, admin._id, editor._id])
    const createdPosts = await Post.create(postData)
    console.log(`✅ Created ${createdPosts.length} posts`)

    const productData = getProducts([superAdmin._id, admin._id, editor._id])
    const createdProducts = await Product.create(productData)
    console.log(`✅ Created ${createdProducts.length} products`)

    const comments = [
      { post: createdPosts[0]._id, author: 'Ramesh Patel',   email: 'ramesh@example.com', content: 'Excellent machine quality! Using ZJ-Series for 2 years.',        status: 'approved' },
      { post: createdPosts[1]._id, author: 'Suresh Kumar',   email: 'suresh@example.com', content: 'Very helpful maintenance guide, thank you ZMS team.',             status: 'approved' },
      { post: createdPosts[2]._id, author: 'Anonymous',                                   content: 'Buy cheap machines here: [spam link removed]',                     status: 'spam'     },
      { post: createdPosts[4]._id, author: 'Anita Singh',    email: 'anita@example.com',  content: 'Can I get a demo for my factory in Surat?',                       status: 'pending'  },
      { post: createdPosts[0]._id, author: 'Mohammed Riyaz', email: 'riyaz@example.com',  content: 'What is the price for 20 heads machine?',                        status: 'pending'  },
    ]
    await Comment.create(comments)
    console.log(`✅ Created ${comments.length} comments`)

    await Lead.create(leads)
    console.log(`✅ Created ${leads.length} leads`)

    await SeoSettings.create(seoSettings)
    console.log('✅ SEO settings created')

    await Settings.create(dashboardSettings)
    console.log('✅ Dashboard settings created')

    await Notification.create([
      { type: 'lead',    message: 'New hot lead: Star Garments (20 heads) from Delhi',           read: false },
      { type: 'comment', message: 'New pending comment on "Case Study: 200% ROI"',               read: false },
      { type: 'post',    message: `${editor.name} submitted "Thread Tension Guide" for review`,  read: false },
      { type: 'system',  message: 'Database seed completed successfully',                         read: true  },
      { type: 'lead',    message: 'New warm lead: Mehta Brothers from Ahmedabad',                read: true  },
    ])
    console.log('✅ Notifications created')

    console.log('\n🎉 Seed complete!\n')
    console.log('📧 Login Credentials:')
    console.log('   superadmin@zmslizza.com  /  super123')
    console.log('   admin@zmslizza.com       /  admin123')
    console.log('   editor@zmslizza.com      /  editor123\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await connectDB()
    await Promise.all([
      User.deleteMany(), Post.deleteMany(), Product.deleteMany(), Comment.deleteMany(),
      Lead.deleteMany(), Notification.deleteMany(), SeoSettings.deleteMany(), Settings.deleteMany(), ContentView.deleteMany(),
    ])
    console.log('💥 All data destroyed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Destroy error:', error)
    process.exit(1)
  }
}

if (process.argv[2] === '--destroy') {
  destroyData()
} else {
  importData()
}

