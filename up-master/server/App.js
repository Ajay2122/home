const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

const AppError = require("./error/AppError");
require("./conn");

const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const gigRoute = require("./routes/gig.route");
const orderRoute = require("./routes/order.route");
const conversationRoute = require("./routes/conversation.route");
const messageRoute = require("./routes/message.route");
const reviewRoute = require("./routes/review.route");
const globalErrorHandler = require("./error/globalErrorHandler");
const cors = require("cors");
const pay = require("./routes/paymentRoute")

const app = express();
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/pay", pay);

app.all("*", (req, res, next) => {
  return next(new AppError("This router is not available"), 400);
});

app.use(globalErrorHandler);

module.exports = app;
