const User = require("../models/user");
const asyncwrapper = require("../middleware/aysnc");
const { createCustomError } = require("../error/customErrorHandler");
const jwt = require("jsonwebtoken");

// function to register new user
const registerUser = asyncwrapper(async (req, res, next) => {
  const { name, email, password, image } = req.body;

  // create a new User object
  const newUser = new User({ name, email, password, image });

  // save the user to the database
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      console.log("Error registering user", err);
      return next(createCustomError(`Error registering the user!`, 500));
    });
});

//function to create a token for the user
const createToken = (userId) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

  return token;
};

// function to login existing user
const loginUser = asyncwrapper(async (req, res, next) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and the password are required" });
  }

  //check for that user in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //user not found
        return next(createCustomError(`User not found`, 404));
      }

      //compare the provided passwords with the password in the database
      if (user.password !== password) {
        return next(createCustomError(`Invalid Password!`, 404));
      }

      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((error) => {
      return next(createCustomError(`Internal server Error!`, 500));
    });
});

module.exports = {
  loginUser,
  registerUser,
};
