const express = require('express')

const postRoutes = require('./postRoutes')
const commentRoutes = require('./commentRoutes')
const leadRoutes = require('./leadRoutes')
const userRoutes = require('./userRoutes')
const mediaRoutes = require('./mediaRoutes')
const analyticsRoutes = require('./analyticsRoutes')
const notificationRoutes = require('./notificationRoutes')
const seoRoutes = require('./seoRoutes')
const settingsRoutes = require('./settingsRoutes')
const productRoutes = require('./productRoutes')

const router = express.Router()

router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)
router.use('/leads', leadRoutes)
router.use('/users', userRoutes)
router.use('/media', mediaRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/notifications', notificationRoutes)
router.use('/seo', seoRoutes)
router.use('/settings', settingsRoutes)
router.use('/products', productRoutes)

module.exports = router
