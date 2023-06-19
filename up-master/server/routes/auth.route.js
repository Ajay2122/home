const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/jwt_verifyToken");

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post(
  "/changePassword/:id",
  validateToken,
  authController.changeUserPassword
);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);

module.exports = router;
