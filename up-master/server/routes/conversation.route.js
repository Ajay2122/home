const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/jwt_verifyToken");
const Conversation = require("../controllers/conversation.controller");

router.get("/", validateToken, Conversation.getConversation);
router.post("/", validateToken, Conversation.createConversation);
router.get("/single/:id", validateToken, Conversation.getSingleConversation);
router.put("/:id", validateToken, Conversation.upDateConversation);

module.exports = router;
