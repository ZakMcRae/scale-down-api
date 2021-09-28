const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

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

module.exports = router;
