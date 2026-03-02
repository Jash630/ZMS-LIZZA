const multer   = require('multer')
const path     = require('path')
const AppError = require('../utils/AppError')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/images'
    if (file.mimetype === 'application/pdf')  folder = 'uploads/documents'
    if (file.mimetype.startsWith('video/'))   folder = 'uploads/videos'
    cb(null, folder)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext          = path.extname(file.originalname).toLowerCase()
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'video/mp4', 'video/mpeg', 'video/quicktime',
  ]
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError(`File type not allowed: ${file.mimetype}`, 400), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_UPLOAD) || 10 * 1024 * 1024 },
})

const formatFileSize = (bytes) => {
  if (bytes < 1024)            return `${bytes} B`
  if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

module.exports = { upload, formatFileSize }