const express = require('express')
const router  = express.Router()
const { getLeads, getLead, createLead, updateLead, deleteLead, getLeadStats } = require('../controllers/leadController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin','superadmin'))

router.get('/stats', getLeadStats)
router.route('/').get(getLeads).post(createLead)
router.route('/:id').get(getLead).put(updateLead).delete(deleteLead)

module.exports = router