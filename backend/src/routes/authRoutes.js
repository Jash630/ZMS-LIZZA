const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const authController = require("../controllers/authController");

router.post("/register", authController.registerAdmin);

router.post(
    "/register",
    protect,
    authorize("superadmin"),
    authController.registerAdmin
);

router.post("/login", authController.loginAdmin);

router.get(
  "/admins",
  protect,
  authorize("superadmin"),
  authController.getAdmins
);

router.delete(
  "/admins/:id",
  protect,
  authorize("superadmin"),
  authController.deleteAdmin
);

module.exports = router;
