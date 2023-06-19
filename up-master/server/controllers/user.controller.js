const asyncHandler = require("express-async-handler");
const AppError = require("../error/AppError");
const User = require("../models/user.model");

const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    // console.log(user);

    if (req.userId._id.toString() !== user._id.toString()) {
      return next(new AppError("You can delete only your account!", 403));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted Successfully.");
  } catch (error) {
    return next(new AppError(error, 401));
  }
});

const getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(401).send("id is not valid: " + error.message);
  }
});

module.exports = { deleteUser, getUser };
