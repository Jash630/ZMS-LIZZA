const express = require('express')
const {
  getSettings,
  updateGeneralSettings,
  updateAppearanceSettings,
  updateNotificationSettings,
} = require('../../controllers/settingsController')
const { protect, authorize } = require('../../middleware/auth')

const router = express.Router()

router.use(protect)
router.use(authorize('admin', 'superadmin'))

router.get('/', getSettings)
router.put('/general', updateGeneralSettings)
router.put('/appearance', updateAppearanceSettings)
router.put('/notifications', updateNotificationSettings)

module.exports = router
