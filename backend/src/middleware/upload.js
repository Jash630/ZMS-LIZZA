const multer   = require('multer')
const AppError = require('../utils/AppError')

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
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_UPLOAD, 10) || 10 * 1024 * 1024 },
})

const formatFileSize = (bytes) => {
  if (bytes < 1024)            return `${bytes} B`
  if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

module.exports = { upload, formatFileSize }
