const express = require('express')
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require('../../controllers/admin/productController')
const { protect, authorize } = require('../../middleware/auth')
const validateRequest = require('../../middleware/validateRequest')
const { adminWriteLimiter } = require('../../middleware/rateLimiters')
const { createProductValidators, updateProductValidators } = require('../../middleware/adminValidators')

const router = express.Router()

router.use(protect)

router.get('/stats', authorize('admin', 'superadmin'), getProductStats)
router
  .route('/')
  .get(getProducts)
  .post(authorize('admin', 'superadmin'), adminWriteLimiter, createProductValidators, validateRequest, createProduct)
router
  .route('/:id')
  .get(getProduct)
  .put(authorize('admin', 'superadmin'), adminWriteLimiter, updateProductValidators, validateRequest, updateProduct)
  .delete(authorize('admin', 'superadmin'), adminWriteLimiter, deleteProduct)

module.exports = router
