const FoodItem = require("../models/food-item");
const { body, validationResult } = require("express-validator");

exports.foodItemValidationChain = [
  body("name").trim().not().isEmpty().withMessage("name is required").escape(),
  body("servingSize")
    .trim()
    .not()
    .isEmpty()
    .withMessage("servingSize is required")
    .isNumeric()
    .escape(),
  body("servingUnit")
    .trim()
    .not()
    .isEmpty()
    .withMessage("servingUnit is required")
    .escape(),
  body("calories")
    .trim()
    .not()
    .isEmpty()
    .withMessage("calories is required")
    .isNumeric()
    .escape(),
  body("fats")
    .trim()
    .not()
    .isEmpty()
    .withMessage("fats is required")
    .isNumeric()
    .escape(),
  body("carbs")
    .trim()
    .not()
    .isEmpty()
    .withMessage("carbs is required")
    .isNumeric()
    .escape(),
  body("proteins")
    .trim()
    .not()
    .isEmpty()
    .withMessage("proteins is required")
    .isNumeric()
    .escape(),
];

exports.getFoodItemInfo = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  const food = await FoodItem.findById(req.params.id).exec();

  // check if food does not exist in database
  if (food === null) {
    return res.status(404).json({ detail: "Food not found" });
  }
  return res.status(200).json(food);
};

exports.createNewFoodItem = async (req, res, next) => {
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

  // check if foodname exists in database and reject request if true
  const foodInDb = await FoodItem.findOne({ name: req.body.name });

  if (foodInDb !== null) {
    return res.status(409).json({ detail: "Food name is taken" });
  }

  // create new food and hash password
  const newFoodItem = new FoodItem({
    name: req.body.name,
    servingSize: req.body.servingSize,
    servingUnit: req.body.servingUnit,
    calories: req.body.calories,
    fats: req.body.fats,
    carbs: req.body.carbs,
    proteins: req.body.proteins,
  });

  await newFoodItem.save();

  res.status(200).json(newFoodItem);
};

exports.editFoodItemInfo = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // get food that will be edited
  let food = await FoodItem.findById(req.params.id);

  // check if food does not exist in database
  if (food === null) {
    return res.status(404).json({ detail: "Food not found" });
  }

  // check for validation errors on req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Request body parameter(s) invalid",
      detail: errors.array(),
    });
  }

  // if changing name, make sure name doesn't exist in database - no duplicate names allowed
  if (food.name !== req.body.name) {
    const foodInDb = await FoodItem.findOne({ name: req.body.name });
    if (foodInDb !== null) {
      return res.status(409).json({ detail: "Food name is taken" });
    }
  }

  //edit, save and return food
  food.name = req.body.name;
  food.servingSize = req.body.servingSize;
  food.servingUnit = req.body.servingUnit;
  food.calories = req.body.calories;
  food.fats = req.body.fats;
  food.carbs = req.body.carbs;
  food.proteins = req.body.proteins;
  food._id = req.params.id;

  await food.save();

  return res.status(200).json(food);
};

exports.deleteExistingFoodItem = async (req, res, next) => {
  // auth check
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // get food to delete
  const food = await FoodItem.findById(req.params.id);

  // check if food does not exist in database
  if (food === null) {
    return res.status(404).json({ detail: "Food not found" });
  }

  //delete and return confirmation
  await food.delete();

  return res.status(200).json({ detail: "Food deleted" });
};
