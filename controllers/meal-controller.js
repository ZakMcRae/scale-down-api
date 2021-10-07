const Meal = require("../models/meal");
const updateRecentFoods = require("../utils/update-recent-foods");
const { body, validationResult } = require("express-validator");

exports.mealValidationChain = [
  body("user").trim().not().isEmpty().withMessage("user is required").escape(),
  body("name").trim().not().isEmpty().withMessage("name is required").escape(),
  body("foodList.*.foodItem")
    .trim()
    .not()
    .isEmpty()
    .withMessage("foodItem is required")
    .escape(),
  body("foodList.*.servingSize")
    .trim()
    .not()
    .isEmpty()
    .withMessage("servingSize is required")
    .isNumeric()
    .escape(),
  body("foodList.*.servingUnit")
    .trim()
    .not()
    .isEmpty()
    .withMessage("servingUnit is required")
    .escape(),
];

exports.getMealInfo = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  const meal = await Meal.findById(req.params.id)
    .populate({
      path: "foodList",
      populate: { path: "foodItem", model: "FoodItem" },
    })
    .exec();

  // check if meal does not exist in database
  if (meal === null) {
    return res.status(404).json({ detail: "Meal not found" });
  }
  return res.status(200).json(meal);
};

exports.createNewMeal = async (req, res, next) => {
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

  // create new meal
  const newMeal = new Meal({
    user: req.body.user,
    name: req.body.name,
    foodList: req.body.foodList,
  });

  await newMeal.save();

  // query from database to get virtual props to return
  const returnMeal = await Meal.findById(newMeal.id).populate({
    path: "foodList",
    populate: { path: "foodItem", model: "FoodItem" },
  });

  // update users recent foods list with used items
  res.on("finish", () => updateRecentFoods(returnMeal));

  res.status(200).json(returnMeal);
};

exports.editMealInfo = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // get meal that will be edited
  let meal = await Meal.findById(req.params.id);

  // check if meal does not exist in database
  if (meal === null) {
    return res.status(404).json({ detail: "Meal not found" });
  }

  // check for validation errors on req.body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Request body parameter(s) invalid",
      detail: errors.array(),
    });
  }

  //edit, save and return meal
  meal.user = req.userId;
  meal.name = req.body.name;
  meal.foodList = req.body.foodList.map((food) => {
    return {
      foodItem: food.foodItem,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      _id: req.params.id,
    };
  });

  await meal.save();

  // query from database to get virtual props to return
  const returnMeal = await Meal.findById(req.params.id).populate({
    path: "foodList",
    populate: { path: "foodItem", model: "FoodItem" },
  });

  res.status(200).json(returnMeal);
};

exports.deleteExistingMeal = async (req, res, next) => {
  // auth check
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // get meal to delete
  const meal = await Meal.findById(req.params.id);

  // check if meal does not exist in database
  if (meal === null) {
    return res.status(404).json({ detail: "Meal not found" });
  }

  //delete and return confirmation
  await meal.delete();

  return res.status(200).json({ detail: "Meal deleted" });
};
