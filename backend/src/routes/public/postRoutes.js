const express = require('express')
const {
  getPublicPosts,
  getPublicPostBySlug,
  getPublicCommentsByPostSlug,
  createPublicCommentForPost,
} = require('../../controllers/public/postPublicController')
const {
  createPublicCommentValidators,
} = require('../../middleware/publicValidators')
const validateRequest = require('../../middleware/validateRequest')
const { publicCommentCreateLimiter } = require('../../middleware/rateLimiters')

const router = express.Router()

router.get('/', getPublicPosts)
router.get('/:slug', getPublicPostBySlug)
router.get('/:slug/comments', getPublicCommentsByPostSlug)
router.post(
  '/:slug/comments',
  publicCommentCreateLimiter,
  createPublicCommentValidators,
  validateRequest,
  createPublicCommentForPost
)

module.exports = router
