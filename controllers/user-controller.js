const User = require("../models/user");
const Meal = require("../models/meal");
const RecentFoods = require("../models/recentFoods");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isValidParamDate = require("../utils/validate-date-param");
const { body, validationResult } = require("express-validator");

exports.userValidationChain = [
  body("userName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("userName is required")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("password should be at least 6 characters long.")
    .escape(),
];

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
  // check for validation errors on req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Request body parameter(s) invalid",
      detail: errors.array(),
    });
  }

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
  // check for validation errors on req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Request body parameter(s) invalid",
      detail: errors.array(),
    });
  }

  // check if user exists in database
  const user = await User.findOne({ userName: req.body.userName });

  if (user === null) {
    return res.status(404).json({ detail: "User not found" });
  }

  // check if password is correct compared to stored hashedPassword
  if (!(await bcrypt.compare(req.body.password, user.hashedPassword))) {
    return res.status(403).json({ detail: "Incorrect password" });
  }

  // create and return jwt containing user info
  const token = await jwt.sign({ user: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30 days",
  });
  res.send({ token, token_type: "Bearer", expires_in: 2592000 });
};

exports.editUserInfo = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // check for validation errors on req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Request body parameter(s) invalid",
      detail: errors.array(),
    });
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

  // check if password is correct compared to stored hashedPassword
  if (!(await bcrypt.compare(req.body.password, user.hashedPassword))) {
    return res.status(403).json({ detail: "Incorrect Password" });
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

exports.getRecentFoods = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  const recentFoods = await RecentFoods.findOne({ user: req.userId }).populate({
    path: "foods",
    populate: { path: "foodItem", model: "FoodItem" },
  });

  // check if recentFoods is empty
  if (recentFoods === null) {
    return res.status(404).json({
      detail:
        "Recent Foods not found, user has never created a meal. They are automatically tracked when users create/edit meals",
    });
  }

  // if no issues - send recentFoods
  res.status(200).json(recentFoods);
};

// gets user nutrition totals for a specific timeframe (defaults to today if no query params passed)
// as query param - can specify "date" for single day, or "startDate" and "endDate" to get a range
exports.getUserTotals = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // check if passed too many parameters at once
  if (req.query.date && req.query.startDate && req.query.endDate) {
    return res.status(400).json({
      detail:
        "Too many options specified at once. Can only send just 'date' or both 'startDate' and 'endDate'",
    });
  }

  // check if date parameter fits YYYY-MM-DD format
  // isValidParamDate not a full validation, handles common cases
  if (req.query !== null) {
    Object.keys(req.query).map((param) => {
      if (!isValidParamDate(req.query[param])) {
        return res.status(400).json({
          detail:
            "Date parameter error - typically invalid date format. Should be YYYY-MM-DD",
        });
      }
    });
  }

  // set search dates based on query parameters
  let searchStartDate = new Date();
  let searchEndDate = new Date();

  // set search for specific date
  if (req.query.date) {
    searchStartDate = new Date(req.query.date);
    searchEndDate = new Date(req.query.date);
    searchEndDate.setDate(searchEndDate.getDate() + 1);
    // set search for specific range
  } else if (req.query.startDate && req.query.endDate) {
    searchStartDate = new Date(req.query.startDate);
    searchEndDate = new Date(req.query.endDate);
    // send error response if using date range and only specifying 1 of 2 dates
  } else if (req.query.startDate || req.query.endDate) {
    res.status(400).json({
      detail:
        "You only specified either startDate or endDate. You must send both. For 1 date use 'date' instead",
    });
  } else {
    // defaults to todays date as no parameters were passed
    // time removed from date, we only want to match on date ranges - not specific hours, min,...
    searchStartDate.setHours(0, 0, 0, 0);
    searchEndDate.setHours(0, 0, 0, 0);
    searchEndDate.setDate(searchEndDate.getDate() + 1);
  }

  // in mongoose you have to search on dates in a range (even for single day) since our database has times included on dates
  const meals = await Meal.find({
    user: req.userId,
    date: { $gte: searchStartDate, $lte: searchEndDate },
  })
    .populate({
      path: "foodList",
      populate: { path: "foodItem", model: "FoodItem" },
    })
    .exec();

  // keep track of totals and add total of each meal from query "meals"
  let totals = {
    calories: 0,
    fats: 0,
    carbs: 0,
    proteins: 0,
  };

  meals.map((meal) => {
    totals.calories += meal.totals.calories;
    totals.carbs += meal.totals.carbs;
    totals.fats += meal.totals.fats;
    totals.proteins += meal.totals.proteins;
  });

  // send totals with dates info
  res.status(200).json({ user: req.userId, ...req.query, totals: totals });
};
