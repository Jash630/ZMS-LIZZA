const express = require('express')
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPostStats,
} = require('../../controllers/postController')
const { protect, authorize } = require('../../middleware/auth')
const validateRequest = require('../../middleware/validateRequest')
const { adminWriteLimiter } = require('../../middleware/rateLimiters')
const { createPostValidators, updatePostValidators } = require('../../middleware/adminValidators')

const router = express.Router()

router.use(protect)

router.get('/stats', authorize('admin', 'superadmin'), getPostStats)
router
  .route('/')
  .get(getPosts)
  .post(authorize('admin', 'superadmin'), adminWriteLimiter, createPostValidators, validateRequest, createPost)

router
  .route('/:id')
  .get(getPost)
  .put(authorize('admin', 'superadmin'), adminWriteLimiter, updatePostValidators, validateRequest, updatePost)
  .delete(authorize('admin', 'superadmin'), adminWriteLimiter, deletePost)

module.exports = router
