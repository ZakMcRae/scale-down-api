const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// get authorized users info
exports.getUserInfo = async (req, res, next) => {
  // req.userId is set by middleware which extracts token info
  if (req.userId) {
    const user = await User.findById(req.userId);

    // check if user exists in database
    if (user === null) {
      return res.status(404).json({ detail: "User not found" });
    }
    return res.status(200).json({ userId: user.id, userName: user.userName });
  }
  return res.status(401).json({ detail: "Not Authorized" });
};

exports.createNewUser = async (req, res, next) => {
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

  res.status(200).json({ id: newUser.id, userName: newUser.userName });
};

exports.createAuthToken = async (req, res, next) => {
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
};
