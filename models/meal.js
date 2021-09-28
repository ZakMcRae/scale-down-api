var mongoose = require("mongoose");

var MealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    //   foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodCount" }],
    foodList: [
      {
        foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
        servingSize: { type: Number, required: true },
        servingUnit: { type: String, required: true },
      },
    ],
  },
  // want totals virtual property to be returned always when sent as JSON
  { toJSON: { virtuals: true } }
);

// calculates the totals of the meals nutirional info (calories, carbs,...)
MealSchema.virtual("totals").get(function () {
  const totals = {
    calories: 0,
    fats: 0,
    carbs: 0,
    proteins: 0,
  };
  this.foodList.forEach((food) => {
    // amount used in meal / amount used in nutrition info
    const multiplier = food.servingSize / food.foodItem.servingSize;

    totals.calories += multiplier * food.foodItem.calories;
    totals.fats += multiplier * food.foodItem.fats;
    totals.carbs += multiplier * food.foodItem.carbs;
    totals.proteins += multiplier * food.foodItem.proteins;
  });
  return totals;
});

module.exports = mongoose.model("Meal", MealSchema);
