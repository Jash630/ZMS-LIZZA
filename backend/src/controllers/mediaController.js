const path     = require('path')
const fs       = require('fs')
const Media    = require('../models/Media')
const AppError = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')
const { formatFileSize } = require('../middleware/upload')

// GET /api/v1/media
exports.getMedia = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query

    const query = {}
    if (type)   query.type = type
    if (search) query.name = { $regex: search, $options: 'i' }

    const skip  = (page - 1) * limit
    const total = await Media.countDocuments(query)
    const media = await Media.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    sendPaginated(res, { data: media, total, page, limit })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/media/upload
exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Please upload a file', 400))

    const file = req.file
    let type   = 'other'
    if (file.mimetype.startsWith('image/'))        type = 'image'
    else if (file.mimetype === 'application/pdf')  type = 'pdf'
    else if (file.mimetype.startsWith('video/'))   type = 'video'

    const subfolder = type === 'pdf' ? 'documents' : type === 'video' ? 'videos' : 'images'
    const url       = `${req.protocol}://${req.get('host')}/uploads/${subfolder}/${file.filename}`

    const media = await Media.create({
      name:          file.filename,
      originalName:  file.originalname,
      type,
      mimeType:      file.mimetype,
      size:          file.size,
      sizeFormatted: formatFileSize(file.size),
      url,
      path:          file.path,
      uploadedBy:    req.user.id,
    })

    sendSuccess(res, { data: media, statusCode: 201, message: 'File uploaded successfully' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/media/:id
exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id)
    if (!media) return next(new AppError('Media not found', 404))

    if (media.path && fs.existsSync(media.path)) {
      fs.unlinkSync(media.path)
    }

    await media.deleteOne()
    sendSuccess(res, { message: 'Media deleted successfully' })
  } catch (err) {
    next(err)
  }
}
