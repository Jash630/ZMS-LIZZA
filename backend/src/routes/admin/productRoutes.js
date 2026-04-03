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

const router = express.Router()

router.use(protect)

router.get('/stats', authorize('admin', 'superadmin'), getProductStats)
router.route('/').get(getProducts).post(createProduct)
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct)

module.exports = router
