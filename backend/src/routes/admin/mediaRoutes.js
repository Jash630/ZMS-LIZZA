const express = require('express')
const { getMedia, uploadMedia, deleteMedia } = require('../../controllers/mediaController')
const { protect } = require('../../middleware/auth')
const { upload } = require('../../middleware/upload')

const router = express.Router()

router.use(protect)

router.get('/', getMedia)
router.post('/upload', upload.single('file'), uploadMedia)
router.delete('/:id', deleteMedia)

module.exports = router
