const mongoose = require('mongoose')

const SeoSettingsSchema = new mongoose.Schema(
  {
    siteTitle:             { type: String, default: 'ZMS LIZZA – Best Embroidery Machine Manufacturer in India' },
    siteDescription:       { type: String, default: 'ZMS LIZZA European Technology offers premium multi-head embroidery machines.' },
    siteKeywords:          [{ type: String }],
    googleAnalyticsId:     { type: String },
    googleSearchConsoleId: { type: String },
    robots:                { type: String, default: 'index, follow' },
    trackedKeywords: [
      {
        keyword:   String,
        position:  Number,
        volume:    Number,
        change:    { type: Number, default: 0 },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('SeoSettings', SeoSettingsSchema)