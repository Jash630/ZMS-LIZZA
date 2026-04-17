const express = require('express')
const router  = express.Router()
const { login, getMe, updatePassword, updateMe, logout } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const validateRequest = require('../middleware/validateRequest')
const { passwordChangeLimiter } = require('../middleware/rateLimiters')
const { loginValidators, updatePasswordValidators, updateMeValidators } = require('../middleware/adminValidators')

router.post('/login',           loginValidators, validateRequest, login)
router.get('/me',               protect, getMe)
router.put('/update-password',  passwordChangeLimiter, protect, updatePasswordValidators, validateRequest, updatePassword)
router.put('/update-me',        protect, updateMeValidators, validateRequest, updateMe)
router.post('/logout',          protect, logout)

module.exports = router