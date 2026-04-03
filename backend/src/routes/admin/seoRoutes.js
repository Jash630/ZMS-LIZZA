const express = require('express')
const {
  getSeoSettings,
  updateSeoSettings,
  updateKeywords,
} = require('../../controllers/seoController')
const { protect, authorize } = require('../../middleware/auth')

const router = express.Router()

router.use(protect)
router.use(authorize('admin', 'superadmin'))

router.route('/').get(getSeoSettings).put(updateSeoSettings)
router.put('/keywords', updateKeywords)

module.exports = router
