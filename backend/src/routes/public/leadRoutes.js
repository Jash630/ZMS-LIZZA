const express = require('express')
const { createPublicLead } = require('../../controllers/public/leadPublicController')
const { createPublicLeadValidators } = require('../../middleware/publicValidators')
const validateRequest = require('../../middleware/validateRequest')
const { publicLeadCreateLimiter } = require('../../middleware/rateLimiters')

const router = express.Router()

router.post('/', publicLeadCreateLimiter, createPublicLeadValidators, validateRequest, createPublicLead)

module.exports = router
