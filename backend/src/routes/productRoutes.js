const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get("/", productController.getProducts);
router.get("/:slug", productController.getProductBySlug);

// Only logged-in admins can create
router.post(
  "/",
  protect,
  authorize("superadmin", "editor"),
  upload.array("images", 5),
  productController.createProduct
);

// Only logged-in admins can update
router.put(
  "/:id",
  protect,
  authorize("superadmin", "editor"),
  upload.array("images", 5),
  productController.updateProduct
);

// Only superadmin can delete
router.delete(
  "/:id",
  protect,
  authorize("superadmin"),
  productController.deleteProduct
);


module.exports = router;