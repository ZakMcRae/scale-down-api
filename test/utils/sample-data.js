const User = require("../../models/user");
const FoodItem = require("../../models/food-item");
const Meal = require("../../models/meal");

const addFakeUser = async () => {
  const user = new User({
    userName: "matt",
    hashedPassword: process.env.TEST_HASHED_PASSWORD,
    _id: "61547b22c7c5959e24db1b8e",
  });
  await user.save();

  return User;
};

const addFakeFoods = async () => {
  const food1 = new FoodItem({
    name: "Ground Beef",
    servingSize: 100,
    servingUnit: "g",
    calories: 332,
    fats: 30,
    carbs: 0,
    proteins: 14,
    _id: "61546e2e75b78614c8ff7de3",
  });
  await food1.save();

  const food2 = new FoodItem({
    name: "Tomato",
    servingSize: 100,
    servingUnit: "g",
    calories: 18,
    fats: 0.2,
    carbs: 3.9,
    proteins: 0.9,
    _id: "61546e2e75b78614c8ff7de4",
  });
  await food2.save();
  return;
};

const addFakeMeal = async () => {
  const meal = new Meal({
    user: await User.findOne({ userName: "matt" }),
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
    _id: "61546e4775b78614c8ff7dea",
  });
  await meal.save();
};

module.exports = { addFakeUser, addFakeFoods, addFakeMeal };
