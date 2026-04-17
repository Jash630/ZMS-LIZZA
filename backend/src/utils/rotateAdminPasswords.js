const path = require('path')
const crypto = require('crypto')
const mongoose = require('mongoose')

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
  override: true,
})

const connectDB = require('../config/db')
const User = require('../models/User')

const ROLE_TARGETS = [
  { role: 'superadmin', emailVar: 'ROTATE_SUPERADMIN_EMAIL', passwordVar: 'ROTATE_SUPERADMIN_PASSWORD' },
  { role: 'admin', emailVar: 'ROTATE_ADMIN_EMAIL', passwordVar: 'ROTATE_ADMIN_PASSWORD' },
  { role: 'editor', emailVar: 'ROTATE_EDITOR_EMAIL', passwordVar: 'ROTATE_EDITOR_PASSWORD' },
]

const normalize = (value) => String(value || '').trim()
const normalizeEmail = (value) => normalize(value).toLowerCase()
const generatePassword = () => crypto.randomBytes(18).toString('base64url')

function getRotationTargets() {
  return ROLE_TARGETS
    .map((target) => {
      const email = normalizeEmail(process.env[target.emailVar])
      const password = normalize(process.env[target.passwordVar])

      return {
        role: target.role,
        emailVar: target.emailVar,
        passwordVar: target.passwordVar,
        email,
        password,
      }
    })
    .filter((target) => target.email)
}

function printUsage() {
  console.log('No rotation target found.')
  console.log('Set at least one ROTATE_*_EMAIL in environment, for example:')
  console.log('  ROTATE_SUPERADMIN_EMAIL=superadmin@yourdomain.com')
  console.log('Optional password vars: ROTATE_*_PASSWORD')
  console.log('If password is missing for a provided email, a strong random password is generated and printed once.')
}

async function rotateAdminPasswords() {
  const targets = getRotationTargets()

  if (!targets.length) {
    printUsage()
    process.exit(1)
  }

  try {
    await connectDB()

    console.log(`Starting password rotation for ${targets.length} target(s)...`)

    const results = []

    for (const target of targets) {
      const user = await User.findOne({ email: target.email })

      if (!user) {
        results.push({ status: 'missing', role: target.role, email: target.email })
        continue
      }

      const generated = !target.password
      const nextPassword = generated ? generatePassword() : target.password

      user.password = nextPassword
      user.passwordChangedAt = new Date()
      await user.save()

      results.push({
        status: 'updated',
        role: user.role,
        email: user.email,
        generated,
        passwordVar: target.passwordVar,
        password: nextPassword,
      })
    }

    const updated = results.filter((item) => item.status === 'updated')
    const missing = results.filter((item) => item.status === 'missing')

    console.log(`Updated ${updated.length} account(s).`)

    if (updated.length) {
      console.log('Updated credentials:')
      for (const item of updated) {
        if (item.generated) {
          console.log(`  ${item.role}: ${item.email} / ${item.password} (generated)`)
        } else {
          console.log(`  ${item.role}: ${item.email} / [from ${item.passwordVar}]`)
        }
      }
    }

    if (missing.length) {
      console.log('No user found for:')
      for (const item of missing) {
        console.log(`  ${item.role}: ${item.email}`)
      }
    }

    await mongoose.connection.close()
    process.exit(updated.length ? 0 : 1)
  } catch (error) {
    console.error(`Failed to rotate passwords: ${error.message}`)
    try {
      await mongoose.connection.close()
    } catch (closeError) {
      // ignore close errors
    }
    process.exit(1)
  }
}

rotateAdminPasswords()
