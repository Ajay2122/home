const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/jwt_verifyToken");
const messageController = require("../controllers/message.controller");

router.post("/", validateToken, messageController.createMessage);
router.get("/:id", validateToken, messageController.getMessages);

module.exports = router;
