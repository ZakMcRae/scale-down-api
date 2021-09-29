const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// get user info
router.get("/", async (req, res, next) => {
  if (req.userId) {
    return res.send(req.userId);
  }

  res.send("Welcome Guest");
});

// create a new user
router.post("/", async (req, res, next) => {
  // check if username exists in database and reject request if true
  const userInDb = await User.findOne({ userName: req.body.userName });

  if (userInDb !== null) {
    return res.status(409).send("Username is taken");
  }

  // create new user and hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    userName: req.body.userName,
    hashedPassword: hashedPassword,
  });

  await newUser.save();

  res.send(`New User Created - ${newUser.userName}`);
});

// generate a 30day auth token for existing user
router.post("/token", async (req, res, next) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });

    // check if user exists in database
    if (user === null) {
      return res.status(404).send("User not found");
    }

    // check if password is correct compared to stored hashedPassword
    if (!(await bcrypt.compare(req.body.password, user.hashedPassword))) {
      return res.status(401).send("Incorrect Password");
    }

    // create and return jwt containing user info
    const token = await jwt.sign({ user: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30 days",
    });
    res.send({ token, token_type: "Bearer", expires_in: 2592000 });
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
});

module.exports = router;
