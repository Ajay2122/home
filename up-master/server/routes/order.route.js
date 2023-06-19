const express = require("express");
const router = express.Router();

const validateToken = require("../middleware/jwt_verifyToken");
const orderController = require("../controllers/order.controller")

router.post('/create-payment-intent/:id',validateToken,orderController.createPaymentIntent)
// router.post("/:gigId", validateToken, orderController.createOrder)
router.get("/", validateToken, orderController.getOrder)
router.put("/",validateToken, orderController.confirm)


module.exports = router;