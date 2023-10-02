const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to Mongo Db");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDb", err);
    });
};

module.exports = connectDB;
