const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const validateToken = require("../middleware/jwt_verifyToken");

router.delete("/:id", validateToken, userController.deleteUser);
router.get("/:id", validateToken, userController.getUser);

module.exports = router;
