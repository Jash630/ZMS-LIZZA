const express = require('express')
const router  = express.Router()
const { getComments, updateCommentStatus, deleteComment, getCommentStats } = require('../controllers/commentController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)

router.get('/stats',       authorize('admin','superadmin'), getCommentStats)
router.get('/',            getComments)
router.put('/:id/status',  authorize('admin','superadmin'), updateCommentStatus)
router.delete('/:id',      authorize('admin','superadmin'), deleteComment)

module.exports = router