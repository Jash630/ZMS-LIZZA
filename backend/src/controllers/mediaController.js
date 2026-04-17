const fs = require('fs')
const Media = require('../models/Media')
const cloudinary = require('../config/cloudinary')
const AppError = require('../utils/AppError')
const { sendSuccess, sendPaginated } = require('../utils/apiResponse')
const { formatFileSize } = require('../middleware/upload')
const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com', 'music.youtube.com'])

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100)
  return { parsedPage, parsedLimit }
}

const resolveMediaType = (mimetype = '') => {
  if (mimetype.startsWith('image/')) return 'image'
  if (mimetype === 'application/pdf') return 'pdf'
  if (mimetype.startsWith('video/')) return 'video'
  return 'other'
}

const cloudinaryResourceTypeFor = (type) => {
  if (type === 'image') return 'image'
  if (type === 'video') return 'video'
  if (type === 'pdf') return 'raw'
  return 'auto'
}

const cloudinaryFolderFor = (type) => {
  if (type === 'video') return 'zms-lizza/videos'
  if (type === 'pdf') return 'zms-lizza/documents'
  return 'zms-lizza/images'
}

const uploadBufferToCloudinary = (file, type) => {
  const resourceType = cloudinaryResourceTypeFor(type)
  const folder = cloudinaryFolderFor(type)

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    stream.end(file.buffer)
  })
}

const hasCloudinaryConfig = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)

const extractYoutubeVideoId = (rawUrl = '') => {
  if (!rawUrl || typeof rawUrl !== 'string') return null

  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.replace(/^www\./, '')
    let videoId = ''

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] || ''
    } else if (YOUTUBE_HOSTS.has(host)) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || ''
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      } else if (parsed.pathname.startsWith('/live/')) {
        videoId = parsed.pathname.split('/')[2] || ''
      }
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null
    return videoId
  } catch {
    return null
  }
}

// GET /api/v1/media
exports.getMedia = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query
    const { parsedPage, parsedLimit } = parsePagination(page, limit)

    const query = {}
    if (type)   query.type = type
    if (search) query.name = { $regex: escapeRegex(search), $options: 'i' }

    const skip  = (parsedPage - 1) * parsedLimit
    const total = await Media.countDocuments(query)
    const media = await Media.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)

    sendPaginated(res, { data: media, total, page: parsedPage, limit: parsedLimit })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/media/upload
exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Please upload a file', 400))

    const file = req.file
    const type = resolveMediaType(file.mimetype)

    let mediaPayload = {
      name: file.filename || file.originalname,
      originalName: file.originalname,
      type,
      mimeType: file.mimetype,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
      uploadedBy: req.user.id,
    }

    if (file.buffer) {
      if (!hasCloudinaryConfig()) {
        return next(new AppError('Cloudinary is not configured. Please set Cloudinary environment variables.', 500))
      }

      const uploaded = await uploadBufferToCloudinary(file, type)
      mediaPayload = {
        ...mediaPayload,
        name: uploaded.public_id?.split('/').pop() || mediaPayload.name,
        url: uploaded.secure_url || uploaded.url,
        provider: 'cloudinary',
        publicId: uploaded.public_id,
        resourceType: uploaded.resource_type,
        path: null,
      }
    } else {
      const subfolder = type === 'pdf' ? 'documents' : type === 'video' ? 'videos' : 'images'
      const localUrl = `${req.protocol}://${req.get('host')}/uploads/${subfolder}/${file.filename}`
      mediaPayload = {
        ...mediaPayload,
        url: localUrl,
        provider: 'local',
        path: file.path,
      }
    }

    const media = await Media.create(mediaPayload)

    sendSuccess(res, { data: media, statusCode: 201, message: 'File uploaded successfully' })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/media/url
exports.createMediaFromUrl = async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim()
    const rawUrl = String(req.body?.url || '').trim()

    if (!rawUrl) {
      return next(new AppError('Please provide a YouTube URL.', 400))
    }

    const videoId = extractYoutubeVideoId(rawUrl)
    if (!videoId) {
      return next(new AppError('Invalid YouTube URL. Use a watch/share/shorts link.', 400))
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`
    const existing = await Media.findOne({ type: 'video', url: canonicalUrl })
    if (existing) {
      return sendSuccess(res, {
        data: existing,
        message: 'This YouTube video already exists in the media library.',
      })
    }

    const title = name || `YouTube Video ${videoId}`
    const media = await Media.create({
      name: title,
      originalName: title,
      type: 'video',
      mimeType: 'video/youtube',
      size: 0,
      sizeFormatted: 'External',
      url: canonicalUrl,
      provider: 'external',
      publicId: `youtube:${videoId}`,
      resourceType: 'video',
      path: null,
      uploadedBy: req.user.id,
      alt: title,
    })

    sendSuccess(res, {
      data: media,
      statusCode: 201,
      message: 'YouTube video added to media library.',
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/v1/media/:id
exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id)
    if (!media) return next(new AppError('Media not found', 404))

    if (media.provider === 'cloudinary' && media.publicId) {
      await cloudinary.uploader.destroy(media.publicId, {
        resource_type: media.resourceType || 'image',
        invalidate: true,
      })
    }

    if (media.path && fs.existsSync(media.path)) {
      fs.unlinkSync(media.path)
    }

    await media.deleteOne()
    sendSuccess(res, { message: 'Media deleted successfully' })
  } catch (err) {
    next(err)
  }
}
