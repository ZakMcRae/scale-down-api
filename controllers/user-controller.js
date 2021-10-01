const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUserInfo = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  const user = await User.findById(req.userId);

  // check if user does not exist in database
  if (user === null) {
    return res.status(404).json({ detail: "User not found" });
  }
  return res.status(200).json({ userId: user.id, userName: user.userName });
};

exports.createNewUser = async (req, res, next) => {
  // check if username exists in database and reject request if true
  const userInDb = await User.findOne({ userName: req.body.userName });

  if (userInDb !== null) {
    return res.status(409).json({ detail: "Username is taken" });
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
  const user = await User.findOne({ userName: req.body.userName });

  // check if user exists in database
  if (user === null) {
    return res.status(404).json({ detail: "User not found" });
  }

  // check if password is correct compared to stored hashedPassword
  if (!(await bcrypt.compare(req.body.password, user.hashedPassword))) {
    return res.status(401).json({ detail: "Incorrect Password" });
  }

  // create and return jwt containing user info
  const token = await jwt.sign({ user: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30 days",
  });
  res.send({ token, token_type: "Bearer", expires_in: 2592000 });
};

exports.editUserInfo = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // check if new username exists in database
  const userInDb = await User.findOne({ userName: req.body.userName });
  if (userInDb !== null) {
    return res.status(409).json({ detail: "Username is taken" });
  }

  // get user to edit info
  const user = await User.findById(req.userId);

  // check if user does not exist in database
  if (user === null) {
    return res.status(404).json({ detail: "User not found" });
  }

  //edit and return user
  user.userName = req.body.userName;
  await user.save();

  return res.status(200).json({ userId: user.id, userName: user.userName });
};

exports.deleteExistingUser = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // get user to delete
  const user = await User.findById(req.userId);

  // check if user does not exist in database
  if (user === null) {
    return res.status(404).json({ detail: "User not found" });
  }

  //delete and return confirmation
  await user.delete();

  return res.status(200).json({ detail: "User deleted" });
};

//todo complete controller functions below - want to finish other routes first

exports.getDateTotals;
exports.getWeekTotals;
