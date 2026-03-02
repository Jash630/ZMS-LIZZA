const express = require('express')
const router  = express.Router()
const { getPosts, getPost, createPost, updatePost, deletePost, getPostStats } = require('../controllers/postController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)

router.get('/stats', authorize('admin','superadmin'), getPostStats)
router.route('/').get(getPosts).post(createPost)
router.route('/:id').get(getPost).put(updatePost).delete(deletePost)

module.exports = router