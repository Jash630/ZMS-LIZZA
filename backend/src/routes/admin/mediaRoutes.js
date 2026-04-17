const express = require('express')
const { getMedia, uploadMedia, createMediaFromUrl, deleteMedia } = require('../../controllers/mediaController')
const { protect, authorize } = require('../../middleware/auth')
const validateRequest = require('../../middleware/validateRequest')
const { adminWriteLimiter, mediaUploadLimiter } = require('../../middleware/rateLimiters')
const { createMediaFromUrlValidators } = require('../../middleware/adminValidators')
const { upload } = require('../../middleware/upload')

const router = express.Router()

router.use(protect)

router.get('/', getMedia)
router.post('/upload', authorize('admin', 'superadmin'), mediaUploadLimiter, upload.single('file'), uploadMedia)
router.post('/url', authorize('admin', 'superadmin'), adminWriteLimiter, createMediaFromUrlValidators, validateRequest, createMediaFromUrl)
router.delete('/:id', authorize('admin', 'superadmin'), adminWriteLimiter, deleteMedia)

module.exports = router
