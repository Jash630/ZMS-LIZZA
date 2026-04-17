const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [12, 'Password must be at least 12 characters'],
      select:    false,
    },
    role: {
      type:    String,
      enum:    ['superadmin', 'admin', 'editor'],
      default: 'editor',
    },
    status: {
      type:    String,
      enum:    ['active', 'inactive'],
      default: 'active',
    },
    avatar:               { type: String, default: null },
    lastLogin:            { type: Date },
    passwordChangedAt:    Date,
    passwordResetToken:   String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON:    { virtuals: true },
    toObject:  { virtuals: true },
  }
)

UserSchema.virtual('postCount', {
  ref:          'Post',
  localField:   '_id',
  foreignField: 'author',
  count:        true,
})

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Sign JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

// Check if password changed after token issued
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestamp < changedAt
  }
  return false
}

module.exports = mongoose.model('User', UserSchema)