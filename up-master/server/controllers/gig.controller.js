const asyncHandler = require("express-async-handler");
const AppError = require("../error/AppError");
const gigModel = require("../models/gig.model");
const Gig = require("../models/gig.model");
const color = require("colors");

const createGig = asyncHandler(async (req, res, next) => {
  if (!req.userId.isSeller) {
    return next(new AppError("Only seller create a gig", 403));
  }

  const newGig = new Gig({
    userId: req.userId._id,
    ...req.body,
  });
  try {
    const savedGig = await newGig.save();
    res.status(200).json(savedGig);
  } catch (error) {
    next(error);
  }
});

const deleteGig = asyncHandler(async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return next(new AppError("Gig not found", 404));
    }

    if (gig.userId.toString() !== req.userId._id.toString()) {
      return next(new AppError("You  cannot delete a  gig", 403));
    }

    await Gig.findByIdAndDelete(req.params.id);
    res.status(201).send("Gig has deleted");
  } catch (error) {
    next(error);
  }
});

const getGig = asyncHandler(async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return next(new AppError("ID not found", 404));
    }
    res.status(200).send(gig);
  } catch (error) {
    next(error);
  }
});

// const getGigs = asyncHandler(async (req, res, next) => {
//   // console.log("hello".rainbow);
//   const page = parseInt(req.query.page);
//   const skipIndex = (page - 1) * 4;

//   const q = req.query;
//   const filters = {
//     ...(q.userId && { userId: q.userId }),
//     ...(q.cat && { cat: q.cat }),
//     ...((q.min || q.max) && {
//       price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) },
//     }),
//     ...(q.search && { title: { $regex: q.search, $options: "i" } }),
//   };
//   try {
//     const allGigs = await Gig.find();
//     const gigs = await Gig.find(filters)
//       .sort({ [q.sort]: -1 })
//       // .limit(4)
//       // .skip(skipIndex);
//     res.status(200).send( gigs );
//   } catch (error) {
//     next(error);
//   }
// });

const getGigs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page);
  const skipIndex = (page - 1) * 4;
  
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  
  try {
    const allGigs = await Gig.find();
    const gigs = await Gig.find(filters)
      .sort({ [q.sort]: -1 })
      .skip(skipIndex)
      .limit(4);
    res.status(200).send(gigs);
  } catch (error) {
    next(error);
  }
});


module.exports = { createGig, deleteGig, getGig, getGigs };
