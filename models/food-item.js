var mongoose = require("mongoose");

var FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  servingSize: { type: Number, required: true },
  servingUnit: { type: String, required: true },
  calories: { type: Number, required: true },
  fats: { type: Number, required: true },
  carbs: { type: Number, required: true },
  proteins: { type: Number, required: true },
});

module.exports = mongoose.model("FoodItem", FoodItemSchema);
