require('dotenv').config()
const mongoose     = require('mongoose')
const connectDB    = require('../config/db')
const User         = require('../models/User')
const Post         = require('../models/Post')
const Comment      = require('../models/Comment')
const Lead         = require('../models/Lead')
const Notification = require('../models/Notification')
const SeoSettings  = require('../models/SeoSettings')

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

// ── Seed ─────────────────────────────────────────────
const importData = async () => {
  try {
    await connectDB()
    console.log('🌱 Starting seed...')

    await Promise.all([
      User.deleteMany(),
      Post.deleteMany(),
      Comment.deleteMany(),
      Lead.deleteMany(),
      Notification.deleteMany(),
      SeoSettings.deleteMany(),
    ])
    console.log('🗑️  Cleared existing data')

    const createdUsers = await User.create(users)
    console.log(`✅ Created ${createdUsers.length} users`)

    const superAdmin = createdUsers.find(u => u.role === 'superadmin')
    const admin      = createdUsers.find(u => u.role === 'admin')
    const editor     = createdUsers.find(u => u.role === 'editor')

    const postData     = getPosts([superAdmin._id, admin._id, editor._id])
    const createdPosts = await Post.create(postData)
    console.log(`✅ Created ${createdPosts.length} posts`)

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
      User.deleteMany(), Post.deleteMany(), Comment.deleteMany(),
      Lead.deleteMany(), Notification.deleteMany(), SeoSettings.deleteMany(),
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