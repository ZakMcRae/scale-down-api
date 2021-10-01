const router = require("express").Router();
const foodController = require("../controllers/food-controller");
const asyncWrapper = require("../utils/async-wrapper");

// create a new food
router.post("/", asyncWrapper(foodController.createNewFood));

// get food info
router.get("/:id", asyncWrapper(foodController.getFoodItemInfo));

// edit food info
router.put("/:id", asyncWrapper(foodController.editFoodItemInfo));

// delete an existing food
router.delete("/:id", asyncWrapper(foodController.deleteExistingFood));

module.exports = router;
