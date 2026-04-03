const express = require('express')

const publicPostRoutes = require('./postRoutes')
const publicProductRoutes = require('./productRoutes')
const publicSiteRoutes = require('./siteRoutes')
const publicLeadRoutes = require('./leadRoutes')
const newsletterRoutes = require('./newsletterRoutes')

const router = express.Router()

router.use('/posts', publicPostRoutes)
router.use('/products', publicProductRoutes)
router.use('/', publicSiteRoutes)
router.use('/leads', publicLeadRoutes)
router.use('/newsletter', newsletterRoutes)

module.exports = router

