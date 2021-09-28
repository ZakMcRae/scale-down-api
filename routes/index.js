var express = require("express");
var router = express.Router();

const User = require("../models/user");
const Meal = require("../models/meal");
const FoodItem = require("../models/food-item");

router.get("/", function (req, res, next) {
  res.send("Welcome!");
});

// route to test adding a user
router.get("/add-user", async (req, res, next) => {
  try {
    const user = new User({
      userName: "zak",
      email: "z@z.com",
      hashedPassword: "123",
    });
    await user.save();
    res.send("added user");
  } catch (err) {
    res.send("Duplicate User");
  }
});

// route to test adding some foods
router.get("/add-food-items", async (req, res, next) => {
  try {
    const food1 = new FoodItem({
      name: "Ground Beef",
      servingSize: 100,
      servingUnit: "g",
      calories: 332,
      fats: 30,
      carbs: 0,
      proteins: 14,
    });
    const food2 = new FoodItem({
      name: "Tomato",
      servingSize: 100,
      servingUnit: "g",
      calories: 18,
      fats: 0.2,
      carbs: 3.9,
      proteins: 0.9,
    });
    await food1.save();
    await food2.save();
    res.send("Added foods");
  } catch (err) {
    res.send("Duplicate Foods");
  }
});

// route to test adding a meal
router.get("/add-meal", async (req, res, next) => {
  try {
    const meal = new Meal({
      user: await User.findOne(),
      name: "Dinner",
      date: new Date(),
      foodList: [
        {
          foodItem: await FoodItem.findOne({ name: "Ground Beef" }).exec(),
          servingSize: 454,
          servingUnit: "g",
        },
        {
          foodItem: await FoodItem.findOne({ name: "Tomato" }).exec(),
          servingSize: 36,
          servingUnit: "g",
        },
      ],
    });
    await meal.save();
    res.send("Added Meal");
  } catch (err) {
    console.log(err);
    res.send("Something Went Wrong");
  }
});

// route to test added meal - populated query
router.get("/test", async (req, res, next) => {
  const meal = await Meal.findOne().populate({
    path: "foodList",
    populate: { path: "foodItem", model: "FoodItem" },
  });
  res.send(meal);
});

module.exports = router;
