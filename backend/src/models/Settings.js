const mongoose = require('mongoose')

const GeneralSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'ZMS LIZZA' },
    tagline: { type: String, default: 'European Technology - Embroidery Machine Manufacturer' },
    siteUrl: { type: String, default: 'https://zmslizza.com' },
    phone: { type: String, default: '+91 98008 83300' },
    whatsapp: { type: String, default: '+91 98008 83300' },
    email: { type: String, default: 'infozmslizza@gmail.com' },
    address: { type: String, default: '128 ZMS LIZZA EMBROIDERY MACHINE, RJD Business Hub Near Bada Ganesh Temple, Naginawadi, Katargam, Surat, Gujarat 395004' },
  },
  { _id: false }
)

const AppearanceSettingsSchema = new mongoose.Schema(
  {
    defaultTheme: { type: String, enum: ['light', 'dark'], default: 'light' },
    brandAccent: { type: String, default: '#E63946' },
  },
  { _id: false }
)

const NotificationSettingsSchema = new mongoose.Schema(
  {
    newLeadEnquiries: { type: Boolean, default: true },
    commentModeration: { type: Boolean, default: true },
    postPublished: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true },
    weeklyPerformanceReport: { type: Boolean, default: true },
  },
  { _id: false }
)

const SettingsSchema = new mongoose.Schema(
  {
    general: { type: GeneralSettingsSchema, default: () => ({}) },
    appearance: { type: AppearanceSettingsSchema, default: () => ({}) },
    notifications: { type: NotificationSettingsSchema, default: () => ({}) },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Settings', SettingsSchema)
