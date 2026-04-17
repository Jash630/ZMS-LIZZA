const express = require('express')
const {
  getComments,
  updateCommentStatus,
  deleteComment,
  getCommentStats,
} = require('../../controllers/commentController')
const { protect, authorize } = require('../../middleware/auth')
const { adminWriteLimiter } = require('../../middleware/rateLimiters')

const router = express.Router()

router.use(protect)

router.get('/stats', authorize('admin', 'superadmin'), getCommentStats)
router.get('/', getComments)
router.put('/:id/status', authorize('admin', 'superadmin'), adminWriteLimiter, updateCommentStatus)
router.delete('/:id', authorize('admin', 'superadmin'), adminWriteLimiter, deleteComment)

module.exports = router
