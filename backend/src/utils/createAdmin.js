const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
  override: true,
})

const connectDB = require('../config/db')
const User = require('../models/User')

const ALLOWED_ROLES = ['superadmin', 'admin', 'editor']

function normalizeRole(value) {
  if (!value) return 'superadmin'
  const role = String(value).trim().toLowerCase()
  return ALLOWED_ROLES.includes(role) ? role : null
}

async function createAdmin() {
  const name = process.env.ADMIN_NAME || process.argv[2] || 'Super Admin'
  const email = String(process.env.ADMIN_EMAIL || process.argv[3] || '').trim().toLowerCase()
  const password = String(process.env.ADMIN_PASSWORD || process.argv[4] || '')
  const role = normalizeRole(process.env.ADMIN_ROLE || process.argv[5])

  if (!email || !password) {
    console.error('Usage:')
    console.error('  npm run create:admin -- "Name" "email@domain.com" "password" "superadmin"')
    console.error('or set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_ROLE in environment')
    process.exit(1)
  }

  if (!role) {
    console.error(`Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}`)
    process.exit(1)
  }

  try {
    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      console.error(`User already exists: ${email}`)
      process.exit(1)
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status: 'active',
    })

    console.log('Admin user created successfully')
    console.log(`Name: ${user.name}`)
    console.log(`Email: ${user.email}`)
    console.log(`Role: ${user.role}`)
    process.exit(0)
  } catch (error) {
    console.error(`Failed to create admin user: ${error.message}`)
    process.exit(1)
  }
}

createAdmin()

