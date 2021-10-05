const FoodItem = require("../models/food-item");

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

  // check if foodname exists in database and reject request if true
  const foodInDb = await FoodItem.findOne({ name: req.body.name });

  if (foodInDb !== null) {
    return res.status(409).json({ detail: "Food name is taken" });
  }

  // check if all food item properties present - return 422 with detail of missing info
  const requiredFields = [
    "name",
    "servingSize",
    "servingUnit",
    "calories",
    "fats",
    "carbs",
    "proteins",
  ];

  let missingFields = [];
  for (const field of requiredFields) {
    if (req.body[field] === undefined) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return res.status(422).json({
      detail: `Missing required food item information - ${missingFields.join(
        ", "
      )}`,
    });
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

  // check if all food item properties present - return 422 with detail of missing info
  const requiredFields = [
    "name",
    "servingSize",
    "servingUnit",
    "calories",
    "fats",
    "carbs",
    "proteins",
  ];

  let missingFields = [];
  for (const field of requiredFields) {
    if (req.body[field] === undefined) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return res.status(422).json({
      detail: `Missing required food item information - ${missingFields.join(
        ", "
      )}`,
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
