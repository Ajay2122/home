const asyncHandler = require("express-async-handler");
const AppError = require("../error/AppError");
const Conversation = require("../models/conversation.model");

const createConversation = asyncHandler(async (req, res, next) => {

  const newConversation = await new Conversation({
    id: req.isSeller
      ? req.userId._id + req.body.to
      : req.body.to + req.userId._id,
    sellerId: req.isSeller ? req.userId._id : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId._id,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });

  try {
    const savedConversation = await newConversation.save();
    console.log(savedConversation, "IIIIIIIIIIIIIII");
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
});

const upDateConversation = asyncHandler(async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true}
    );

    res.status(200).json(updatedConversation);
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err });
  }
});

const getSingleConversation = asyncHandler(async (req, res, next) => {
  try {
   
    const conversation = await Conversation.findOne({ id: req.params.id });

    if (!conversation) return next(new AppError("Not found!", 404));
    res.status(200).send(conversation);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
});

const getConversation = asyncHandler(async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId._Id } : { buyerId: req.userId._id }
    ).sort({ updatedAt: -1 });
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getSingleConversation,
  upDateConversation,
  getConversation,
  createConversation,
};
