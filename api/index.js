require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const connectDB = require("./db/connect");
const cors = require("cors");
const routes = require("./routes/chat");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

//routes navigations
app.use("/api/v1/chat", routes);
app.use("/files", express.static("files"));
//error handling
app.use(errorHandler);

//handling resource not found
app.use(notFound);

const port = 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
