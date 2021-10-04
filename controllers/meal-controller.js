const Meal = require("../models/meal");

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

// exports.createNewMeal = async (req, res, next) => {
//   // check user auth
//   if (!req.userId) {
//     return res.status(401).json({ detail: "Not Authorized" });
//   }

//   // check if mealname exists in database and reject request if true
//   const mealInDb = await Meal.findOne({ mealName: req.body.mealName });

//   if (mealInDb !== null) {
//     return res.status(409).json({ detail: "Meal name is taken" });
//   }

//   // check if all meal item properties present - return 422 with detail of missing info
//   const requiredFields = [
//     "name",
//     "servingSize",
//     "servingUnit",
//     "calories",
//     "fats",
//     "carbs",
//     "proteins",
//   ];

//   let missingFields = [];
//   for (const field of requiredFields) {
//     if (req.body[field] === undefined) {
//       missingFields.push(field);
//     }
//   }

//   if (missingFields.length > 0) {
//     return res.status(422).json({
//       detail: `Missing required meal item information - ${missingFields.join(
//         ", "
//       )}`,
//     });
//   }

//   // create new meal and hash password
//   const newMeal = new Meal({
//     name: req.body.name,
//     servingSize: req.body.servingSize,
//     servingUnit: req.body.servingUnit,
//     calories: req.body.calories,
//     fats: req.body.fats,
//     carbs: req.body.carbs,
//     proteins: req.body.proteins,
//   });

//   await newMeal.save();

//   res.status(200).json(newMeal);
// };

// exports.editMealInfo = async (req, res, next) => {
//   // check user auth
//   if (!req.userId) {
//     return res.status(401).json({ detail: "Not Authorized" });
//   }

//   // get meal that will be edited
//   let meal = await Meal.findById(req.params.id);

//   // check if meal does not exist in database
//   if (meal === null) {
//     return res.status(404).json({ detail: "Meal not found" });
//   }

//   // check if all meal item properties present - return 422 with detail of missing info
//   const requiredFields = [
//     "name",
//     "servingSize",
//     "servingUnit",
//     "calories",
//     "fats",
//     "carbs",
//     "proteins",
//   ];

//   let missingFields = [];
//   for (const field of requiredFields) {
//     if (req.body[field] === undefined) {
//       missingFields.push(field);
//     }
//   }

//   if (missingFields.length > 0) {
//     return res.status(422).json({
//       detail: `Missing required meal item information - ${missingFields.join(
//         ", "
//       )}`,
//     });
//   }

//   // if changing name, make sure name doesn't exist in database - no duplicate names allowed
//   if (meal.name !== req.body.name) {
//     const mealInDb = await Meal.findOne({ name: req.body.name });
//     if (mealInDb !== null) {
//       return res.status(409).json({ detail: "Meal name is taken" });
//     }
//   }

//   //edit, save and return meal
//   meal.name = req.body.name;
//   meal.servingSize = req.body.servingSize;
//   meal.servingUnit = req.body.servingUnit;
//   meal.calories = req.body.calories;
//   meal.fats = req.body.fats;
//   meal.carbs = req.body.carbs;
//   meal.proteins = req.body.proteins;
//   meal._id = req.params.id;

//   await meal.save();

//   return res.status(200).json(meal);
// };

// exports.deleteExistingMeal = async (req, res, next) => {
//   // auth check
//   if (!req.userId) {
//     return res.status(401).json({ detail: "Not Authorized" });
//   }

//   // get meal to delete
//   const meal = await Meal.findById(req.params.id);

//   // check if meal does not exist in database
//   if (meal === null) {
//     return res.status(404).json({ detail: "Meal not found" });
//   }

//   //delete and return confirmation
//   await meal.delete();

//   return res.status(200).json({ detail: "Meal deleted" });
// };
