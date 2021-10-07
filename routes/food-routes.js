const router = require("express").Router();
const foodController = require("../controllers/food-controller");
const asyncWrapper = require("../utils/async-wrapper");

// create a new food
router.post(
  "/",
  foodController.foodItemValidationChain,
  asyncWrapper(foodController.createNewFoodItem)
);

// get food info
router.get("/:id", asyncWrapper(foodController.getFoodItemInfo));

// edit food info
router.put(
  "/:id",
  foodController.foodItemValidationChain,
  asyncWrapper(foodController.editFoodItemInfo)
);

// delete an existing food
router.delete("/:id", asyncWrapper(foodController.deleteExistingFoodItem));

module.exports = router;
