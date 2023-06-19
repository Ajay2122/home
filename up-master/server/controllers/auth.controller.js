const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const AppError = require("../error/AppError");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const sendCookie = require("../utils/sendCookie");
const sendEmail = require("../utils/sendmail");
const { LEGAL_TCP_SOCKET_OPTIONS } = require("mongodb");

const register = asyncHandler(async (req, res, next) => {
  try {
    const newUser = new User({
      ...req.body,
    });

    await newUser.save();

    res.status(201).json("User has been created.");
  } catch (err) {
    // res.status(400).send("Something went wrong",);
    if (err.code === 11000) {
      next(new AppError("email is already exit", 401));
    }
    next(new AppError(err, 401));
  }
});

const login = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(new AppError("User not found", 404));
    const isCorrectPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isCorrectPassword)
      return next(new AppError("Invalid userName OR Password", 404));
    // console.log("user from login", user.isSeller);
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_SECRET
    );

    const { password, ...info } = user._doc;

    sendCookie(user, 201, res, token);
  } catch (error) {
    next(new AppError(error, 401));
  }
});

const logout = asyncHandler(async (req, res, next) => {
  res
    .clearCookie("token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("Logged out successfully.");
});

const changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by the provided id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches the user's current password
    const isPasswordMatch = await user.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Update the user's password
    user.password = newPassword;

    // Save the updated user object
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error while changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const crypto = require("crypto");

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate reset password token and save user
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpiry = Date.now() + 3600000; // Token expires in 1 hour
  await user.save();

  // Construct the reset password URL
  const resetURL = `http://localhost:5173/resetPassword/${token}`;

  // Send the reset password email
  await sendEmail({
    email: user.email,
    username: user.name,
    subject: "Reset Password",
    url: resetURL,
    html: `
    <p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
    <p>Please click on the following link, or paste it into your browser to complete the process:</p>
    <a href="${resetURL}"><button>Reset Password</button></a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `,
  });

  res.status(200).json({
    status: "success",
    message: "Your reset token has been sent successfully",
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
  sendCookie(user, 200, res);
});

module.exports = {
  register,
  login,
  logout,
  changeUserPassword,
  forgotPassword,
  resetPassword,
};
