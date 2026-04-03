const express = require('express')
const {
  getPublicMedia,
  getPublicSeoSettings,
  getPublicSettings,
} = require('../../controllers/public/sitePublicController')

const router = express.Router()

router.get('/media', getPublicMedia)
router.get('/seo', getPublicSeoSettings)
router.get('/settings', getPublicSettings)

module.exports = router
