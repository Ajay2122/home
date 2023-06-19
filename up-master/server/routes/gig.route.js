const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/jwt_verifyToken");
const gigController = require("../controllers/gig.controller");

router.post("/", validateToken, gigController.createGig);
router.delete("/:id", validateToken, gigController.deleteGig);
router.get("/single/:id", gigController.getGig);
router.get("/", gigController.getGigs);

module.exports = router;
