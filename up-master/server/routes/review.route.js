const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/jwt_verifyToken");
const reviewController = require("../controllers/review.controller");

router.post("/", validateToken, reviewController.createReview);
router.get("/:gigId", reviewController.getReview);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
