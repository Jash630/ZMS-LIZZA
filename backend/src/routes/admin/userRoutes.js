const express = require('express')
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../../controllers/userController')
const { protect, authorize } = require('../../middleware/auth')

const router = express.Router()

router.use(protect)
router.use(authorize('admin', 'superadmin'))

router
  .route('/')
  .get(getUsers)
  .post(authorize('superadmin'), createUser)

router
  .route('/:id')
  .get(getUser)
  .put(authorize('superadmin'), updateUser)
  .delete(authorize('superadmin'), deleteUser)

module.exports = router
