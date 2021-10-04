const FoodItem = require("../models/food-item");
const { body, validationResult } = require("express-validator");

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
  const foodInDb = await FoodItem.findOne({ foodName: req.body.foodName });

  if (foodInDb !== null) {
    return res.status(409).json({ detail: "Food name is taken" });
  }

  // todo validate req body
  // check if all food item properties present
  // console.log(Object.keys(FoodItem.schema.paths));

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

// exports.editFoodItemInfo = async (req, res, next) => {
//   if (!req.foodId) {
//     return res.status(401).json({ detail: "Not Authorized" });
//   }

//   // check if new foodname exists in database
//   const foodInDb = await FoodItem.findOne({ foodName: req.body.foodName });
//   if (foodInDb !== null) {
//     return res.status(409).json({ detail: "FoodItemname is taken" });
//   }

//   // get food to edit info
//   const food = await FoodItem.findById(req.foodId);

//   // check if food does not exist in database
//   if (food === null) {
//     return res.status(404).json({ detail: "FoodItem not found" });
//   }

//   //edit and return food
//   food.foodName = req.body.foodName;
//   await food.save();

//   return res.status(200).json({ foodId: food.id, foodName: food.foodName });
// };

// exports.deleteExistingFoodItem = async (req, res, next) => {
//   if (!req.foodId) {
//     return res.status(401).json({ detail: "Not Authorized" });
//   }

//   // get food to delete
//   const food = await FoodItem.findById(req.foodId);

//   // check if food does not exist in database
//   if (food === null) {
//     return res.status(404).json({ detail: "FoodItem not found" });
//   }

//   //delete and return confirmation
//   await food.delete();

//   return res.status(200).json({ detail: "FoodItem deleted" });
// };
