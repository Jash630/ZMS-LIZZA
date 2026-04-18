const mongoose = require('mongoose')

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Lead name is required'],
      trim:     true,
    },
    contact: {
      type:     String,
      required: [true, 'Contact number is required'],
      trim:     true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    businessName: { type: String, trim: true },
    city:     { type: String, trim: true },
    state:    { type: String, trim: true },
    source: {
      type:    String,
      enum:    ['WhatsApp', 'Website', 'Call', 'Referral', 'Exhibition', 'Social Media', 'Other'],
      default: 'Website',
    },
    status: {
      type:    String,
      enum:    ['hot', 'warm', 'cold', 'converted', 'lost'],
      default: 'warm',
    },
    machines:     { type: String, trim: true },
    helpType: {
      type: String,
      enum: ['quote', 'demo', 'support', 'service', 'inquiry', 'emi', 'other'],
      default: 'inquiry',
    },
    message:      { type: String, trim: true, maxlength: [2000, 'Message cannot exceed 2000 characters'] },
    notes:        { type: String, trim: true },
    assignedTo:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followUpDate: { type: Date },
    statusHistory: [
      {
        status:    String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note:      String,
      },
    ],
  },
  { timestamps: true }
)

LeadSchema.index({ status: 1, createdAt: -1 })
LeadSchema.index({ source: 1 })
LeadSchema.index({ assignedTo: 1 })

module.exports = mongoose.model('Lead', LeadSchema)
