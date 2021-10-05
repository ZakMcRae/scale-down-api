var mongoose = require("mongoose");

var RecentFoodsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foods: [
    {
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
      dateUsed: { type: Date, required: true },
    },
  ],
});

module.exports = mongoose.model("RecentFoods", RecentFoodsSchema);
