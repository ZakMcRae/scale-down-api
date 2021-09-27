var mongoose = require("mongoose");

var MealSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Meal", MealSchema);
