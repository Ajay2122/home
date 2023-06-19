const asyncHandler = require("express-async-handler");
const AppError = require("../error/AppError");
const Order = require("../models/order.model");
const Gig = require("../models/gig.model");
const Stripe = require("stripe");

// const createOrder = asyncHandler(async (req, res, next) => {
//   try {
//     const gig = await Gig.findById(req.params.gigId);

//     const newOrder = await Order({
//       gigId: gig._id,
//       img: gig.cover,
//       title: gig.title,
//       buyerId: req.userId,
//       sellerId: gig.userId,
//       price: gig.price,
//       payment_intent: "temporary",
//     });
//     await newOrder.save();
//     res.status(200).send("successfully created");
//   } catch (error) {
//     next(error);
//   }
// });
const createPaymentIntent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};
const getOrder = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller
        ? { sellerId: req.userId._id }
        : { buyerId: req.userId._id }),
      isCompleted: true,
    });
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
});

const confirm = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
});

module.exports = { getOrder, createPaymentIntent, confirm };
