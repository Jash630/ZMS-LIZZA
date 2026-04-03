const express = require('express')
const { subscribeNewsletter } = require('../../controllers/public/subscriberPublicController')
const { createPublicSubscriberValidators } = require('../../middleware/publicValidators')
const validateRequest = require('../../middleware/validateRequest')
const { publicSubscribeLimiter } = require('../../middleware/rateLimiters')

const router = express.Router()

router.post('/subscribe', publicSubscribeLimiter, createPublicSubscriberValidators, validateRequest, subscribeNewsletter)

module.exports = router
