const express = require('express')
const router  = express.Router()
const { getMedia, uploadMedia, deleteMedia } = require('../controllers/mediaController')
const { protect }  = require('../middleware/auth')
const { upload }   = require('../middleware/upload')

router.use(protect)

router.get('/',        getMedia)
router.post('/upload', upload.single('file'), uploadMedia)
router.delete('/:id',  deleteMedia)

module.exports = router