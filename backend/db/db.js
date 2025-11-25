const mongoose = require("mongoose");
require("dotenv").config();

const db = async () => {
  try {
    await mongoose.connect(`${process.env.URI}Watch-house`, {
    // await mongoose.connect("mongodb://127.0.0.1:27017/Watch-house", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected 👍");
  } catch (error) {
    console.log(error, "DB connection error");
  }
};
db();
