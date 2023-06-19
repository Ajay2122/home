const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


try {
  mongoose.connect(process.env.db || 'mongodb://localhost:27017/skill');
  console.log("connecting to database mongoDB");
} catch (error) {
  console.log(error);
}
