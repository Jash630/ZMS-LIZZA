const express = require('express')
const router  = express.Router()
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController')
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin','superadmin'))

router.route('/')
  .get(getUsers)
  .post(authorize('superadmin'), createUser)

router.route('/:id')
  .get(getUser)
  .put(authorize('superadmin'), updateUser)
  .delete(authorize('superadmin'), deleteUser)

module.exports = router