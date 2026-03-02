export const revenueData = [
  { month: 'Jul', leads: 28, views: 4200 },
  { month: 'Aug', leads: 34, views: 5100 },
  { month: 'Sep', leads: 31, views: 4700 },
  { month: 'Oct', leads: 42, views: 6200 },
  { month: 'Nov', leads: 56, views: 7800 },
  { month: 'Dec', leads: 48, views: 7100 },
  { month: 'Jan', leads: 65, views: 9200 },
  { month: 'Feb', leads: 72, views: 10400 },
  { month: 'Mar', leads: 80, views: 11800 },
]

export const trafficSourceData = [
  { name: 'Organic Search', value: 42, color: '#E63946' },
  { name: 'Direct',         value: 23, color: '#8B2F97' },
  { name: 'Social Media',   value: 18, color: '#2E5EAA' },
  { name: 'Referral',       value: 11, color: '#FF6B35' },
  { name: 'WhatsApp',       value: 6,  color: '#10B981' },
]

export const topPagesData = [
  { page: 'ZJ-Premium Series',     views: 4820, leads: 34 },
  { page: 'About ZMS LIZZA',       views: 3210, leads: 18 },
  { page: 'Product Catalog',       views: 2980, leads: 52 },
  { page: 'Contact / Demo',        views: 2640, leads: 78 },
  { page: 'Blog: Embroidery Tips', views: 1920, leads: 12 },
]

export const postsData = [
  { id: 1, title: '5 Reasons ZJ-Series is Best for Indian Factories', category: 'Product',    author: 'Priya Sharma', status: 'published', views: 2840, date: '2024-03-01' },
  { id: 2, title: 'How to Maintain Your Embroidery Machine',          category: 'Guide',     author: 'Arjun Mehta',  status: 'published', views: 1920, date: '2024-02-26' },
  { id: 3, title: 'ZMS LIZZA Expands to South India Market',          category: 'News',      author: 'Ravi Kumar',   status: 'published', views: 1540, date: '2024-02-20' },
  { id: 4, title: 'Thread Tension Guide for Dense Designs',           category: 'Guide',     author: 'Arjun Mehta',  status: 'draft',     views: 0,    date: '2024-03-05' },
  { id: 5, title: 'Upcoming Machine Launch: ZJ-Pro 2024',             category: 'News',      author: 'Priya Sharma', status: 'scheduled', views: 0,    date: '2024-03-10' },
  { id: 6, title: 'Case Study: 200% ROI for Tirupur Factory',         category: 'Case Study',author: 'Ravi Kumar',   status: 'published', views: 3100, date: '2024-02-15' },
]

export const commentsData = [
  { id: 1, author: 'Ramesh Patel',   post: '5 Reasons ZJ-Series...', content: 'Excellent machine quality! We are using it for 2 years.',      status: 'approved', date: '2024-03-02' },
  { id: 2, author: 'Suresh Kumar',   post: 'How to Maintain...',     content: 'Very helpful guide, thank you ZMS team.',                       status: 'approved', date: '2024-03-01' },
  { id: 3, author: 'Anonymous',      post: 'ZMS LIZZA Expands...',   content: 'Buy cheap machines here [spam link]',                           status: 'spam',     date: '2024-03-01' },
  { id: 4, author: 'Anita Singh',    post: 'Case Study: 200% ROI',   content: 'Can I get a demo for my factory in Surat?',                     status: 'pending',  date: '2024-03-03' },
  { id: 5, author: 'Mohammed Riyaz', post: '5 Reasons ZJ-Series...', content: 'What is the price for 20 heads machine?',                      status: 'pending',  date: '2024-03-04' },
]

export const leadsData = [
  { id: 1, name: 'Vikram Textiles',   contact: '+91 98765 43210', city: 'Surat',      source: 'WhatsApp', status: 'hot',  machines: '10 heads', date: '2024-03-04' },
  { id: 2, name: 'Ravi Embroidery',   contact: '+91 87654 32109', city: 'Tirupur',    source: 'Website',  status: 'warm', machines: '4 heads',  date: '2024-03-03' },
  { id: 3, name: 'Kumar Fashion',     contact: '+91 76543 21098', city: 'Mumbai',     source: 'Call',     status: 'cold', machines: '2 heads',  date: '2024-03-02' },
  { id: 4, name: 'Star Garments',     contact: '+91 65432 10987', city: 'Delhi',      source: 'WhatsApp', status: 'hot',  machines: '20 heads', date: '2024-03-04' },
  { id: 5, name: 'Mehta Brothers',    contact: '+91 54321 09876', city: 'Ahmedabad',  source: 'Website',  status: 'warm', machines: '6 heads',  date: '2024-03-01' },
  { id: 6, name: 'Southern Stitch',   contact: '+91 43210 98765', city: 'Coimbatore', source: 'Referral', status: 'hot',  machines: '15 heads', date: '2024-03-05' },
  { id: 7, name: 'Patil Enterprises', contact: '+91 32109 87654', city: 'Pune',       source: 'WhatsApp', status: 'cold', machines: '2 heads',  date: '2024-02-28' },
]

export const usersData = [
  { id: 1, name: 'Ravi Kumar',   email: 'superadmin@zmslizza.com', role: 'superadmin', status: 'active',   posts: 34, lastLogin: '2 hours ago'  },
  { id: 2, name: 'Priya Sharma', email: 'admin@zmslizza.com',      role: 'admin',      status: 'active',   posts: 58, lastLogin: '1 day ago'    },
  { id: 3, name: 'Arjun Mehta',  email: 'editor@zmslizza.com',     role: 'editor',     status: 'active',   posts: 42, lastLogin: '3 hours ago'  },
  { id: 4, name: 'Sneha Patel',  email: 'sneha@zmslizza.com',      role: 'editor',     status: 'inactive', posts: 14, lastLogin: '2 weeks ago'  },
]

export const mediaData = [
  { id: 1, name: 'zj-premium-machine.jpg',    type: 'image', size: '2.4 MB', date: '2024-03-01', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300' },
  { id: 2, name: 'factory-setup-tirupur.jpg', type: 'image', size: '1.8 MB', date: '2024-03-02', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300' },
  { id: 3, name: 'embroidery-closeup.jpg',    type: 'image', size: '3.1 MB', date: '2024-02-28', url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=300' },
  { id: 4, name: 'product-catalog-2024.pdf',  type: 'pdf',   size: '4.5 MB', date: '2024-02-20', url: '#' },
  { id: 5, name: 'demo-video-zj.mp4',         type: 'video', size: '45 MB',  date: '2024-02-15', url: '#' },
  { id: 6, name: 'logo-zmslizza.png',          type: 'image', size: '0.3 MB', date: '2024-01-10', url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300' },
]

export const notificationsData = [
  { id: 1, type: 'lead',    message: 'New hot lead: Star Garments (20 heads) from Delhi',        time: '5 min ago',  read: false },
  { id: 2, type: 'comment', message: 'New pending comment on "Case Study: 200% ROI"',             time: '18 min ago', read: false },
  { id: 3, type: 'post',    message: 'Arjun Mehta submitted "Thread Tension Guide" for review',   time: '1 hr ago',   read: false },
  { id: 4, type: 'system',  message: 'Backup completed successfully',                             time: '3 hrs ago',  read: true  },
  { id: 5, type: 'lead',    message: 'New warm lead: Mehta Brothers from Ahmedabad',              time: '5 hrs ago',  read: true  },
]