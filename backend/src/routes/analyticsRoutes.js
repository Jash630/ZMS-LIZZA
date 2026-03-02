const express = require('express')
const router  = express.Router()
const { getDashboardStats, getAnalyticsOverview } = require('../controllers/analyticsController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin','superadmin'))

router.get('/dashboard', getDashboardStats)
router.get('/overview',  getAnalyticsOverview)

module.exports = router