const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../error/AppError");
const asyncHandler = require("express-async-handler");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    return next(new AppError("Please Login to Access", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = await User.findById(decodedData.id);

  req.isSeller = await decodedData.isSeller;

  next();
});

module.exports = isAuthenticated;
