const RecentFoods = require("../models/recentFoods");

// keeps track of a users most recently used foods in meals - up to 20
const updateRecentFoods = async (meal) => {
  // get users current recent foods
  let recentFoods = await RecentFoods.findOne({ user: meal.user });

  // if no recent foods yet, create new
  if (recentFoods === null) {
    recentFoods = new RecentFoods({ user: meal.user });
  }

  // combine any recent foods with the foods in the new meal
  let allFoods = [...recentFoods.foods];

  meal.foodList.map((food) => {
    return allFoods.push({ foodItem: food.foodItem, dateUsed: meal.date });
  });

  // sort the foods by FoodItem
  allFoods.sort((a, b) => (a.foodItem > b.foodItem ? 1 : -1));

  // filter out any duplicates
  allFoods = allFoods.filter(
    (v, i, a) => a.findIndex((t) => t.foodItem === v.foodItem) === i
  );

  // limit to a max length of 20 recent food items
  if (allFoods.length > 20) {
    allFoods = allFoods.slice(0, 20);
  }

  // update recent foods in database with new list
  recentFoods.foods = allFoods;
  await recentFoods.save();
};

module.exports = updateRecentFoods;
