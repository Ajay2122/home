const express = require("express");
const paaymentController = require("./../controllers/paaymentController");

const router = express.Router();

router.route("/checkout").post(paaymentController.checkout);
router.route("/verify").post(paaymentController.verify);
// router.route("/paymentverification").post(paymentVerification);

module.exports = router;