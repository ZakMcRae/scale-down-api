const router = require("express").Router();
const mealController = require("../controllers/meal-controller");
const asyncWrapper = require("../utils/async-wrapper");

// create a new meal
router.post(
  "/",
  mealController.mealValidationChain,
  asyncWrapper(mealController.createNewMeal)
);

// get meal info
router.get("/:id", asyncWrapper(mealController.getMealInfo));

// edit meal info
router.put(
  "/:id",
  mealController.mealValidationChain,
  asyncWrapper(mealController.editMealInfo)
);

// delete an existing meal
router.delete("/:id", asyncWrapper(mealController.deleteExistingMeal));

module.exports = router;
