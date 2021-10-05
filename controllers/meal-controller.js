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

exports.createNewMeal = async (req, res, next) => {
  // check user auth
  if (!req.userId) {
    return res.status(401).json({ detail: "Not Authorized" });
  }

  // check if all meal properties present - return 422 with detail of missing info
  let missingFields = [];

  if (req.body.name === undefined) missingFields.push("name");
  if (req.body.user === undefined) missingFields.push("user");
  if (req.body.foodList === undefined) missingFields.push("foodList");
  if (req.body.foodList !== undefined) {
    req.body.foodList.map((food, index) => {
      if (food.foodItem === undefined) {
        missingFields.push(`foodItem of foodList ${index}`);
      }
      if (food.servingSize === undefined) {
        missingFields.push(`servingSize of foodList ${index}`);
      }
      if (food.servingUnit === undefined) {
        missingFields.push(`servingUnit of foodList ${index}`);
      }
    });
  }

  if (missingFields.length > 0) {
    return res.status(422).json({
      detail: `Missing required meal item information - ${missingFields.join(
        ", "
      )}`,
    });
  }

  // create new meal
  const newMeal = new Meal({
    user: req.body.user,
    name: req.body.name,
    foodList: req.body.foodList.map((food) => {
      return {
        foodItem: food.foodItem,
        servingSize: food.servingSize,
        servingUnit: food.servingUnit,
      };
    }),
  });

  await newMeal.save();

  // query from database to get virtual props to return
  const returnMeal = await Meal.findById(newMeal.id).populate({
    path: "foodList",
    populate: { path: "foodItem", model: "FoodItem" },
  });

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

  // check if all meal properties present - return 422 with detail of missing info
  let missingFields = [];

  if (req.body.name === undefined) missingFields.push("name");
  if (req.body.user === undefined) missingFields.push("user");
  if (req.body.foodList === undefined) missingFields.push("foodList");
  if (req.body.foodList !== undefined) {
    req.body.foodList.map((food, index) => {
      if (food.foodItem === undefined) {
        missingFields.push(`foodItem of foodList[${index}]`);
      }
      if (food.servingSize === undefined) {
        missingFields.push(`servingSize of foodList[${index}]`);
      }
      if (food.servingUnit === undefined) {
        missingFields.push(`servingUnit of foodList[${index}]`);
      }
    });
  }

  if (missingFields.length > 0) {
    return res.status(422).json({
      detail: `Missing required meal item information - ${missingFields.join(
        ", "
      )}`,
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
