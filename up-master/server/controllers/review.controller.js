const asyncHandler = require("express-async-handler");
const AppError = require("../error/AppError");
const Review = require("../models/review.model");
const Gig = require("../models/gig.model");

const createReview = asyncHandler(async (req, res, next) => {
  // console.log(req,"hello".rainbow)
  if (req.userId.isSeller) {
    return next(new AppError("seller can't be created Review"));
  }
  const newReview = await Review({
    userId: req.userId._id,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });
  try {
    const review = await Review.findOne({
      userId: req.userId._id,
      gigId: req.body.gigId,
    });

    if (review) {
      return next(new AppError("you  have already created a review", 403));
    }
    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(200).send(savedReview);
  } catch (error) {
    next(error);
  }
});

const getReview = asyncHandler(async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);
  } catch (error) {
    next(error);
  }
});

const deleteReview = asyncHandler(async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = { createReview, getReview, deleteReview };
