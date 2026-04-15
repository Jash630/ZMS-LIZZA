const express = require('express')
const { protect, authorize } = require('../../middleware/auth')
const {
  getSubscribers,
  getSubscriberStats,
  updateSubscriber,
  deleteSubscriber,
  sendOffer,
} = require('../../controllers/subscriberController')

const router = express.Router()

router.use(protect)
router.use(authorize('admin', 'superadmin'))

router.get('/stats', getSubscriberStats)
router.post('/send-offer', sendOffer)
router.route('/').get(getSubscribers)
router.route('/:id').put(updateSubscriber).delete(deleteSubscriber)

module.exports = router

