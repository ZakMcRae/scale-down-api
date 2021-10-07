const router = require("express").Router();
const userController = require("../controllers/user-controller");
const asyncWrapper = require("../utils/async-wrapper");

// create a new user
router.post(
  "/",
  userController.userValidationChain,
  asyncWrapper(userController.createNewUser)
);

// generate a 30day auth token for existing user
router.post(
  "/token",
  userController.userValidationChain,
  asyncWrapper(userController.createAuthToken)
);

// get user info
router.get("/", asyncWrapper(userController.getUserInfo));

// edit user info - (change userName)
router.put(
  "/",
  userController.userValidationChain,
  asyncWrapper(userController.editUserInfo)
);

// delete an existing user
router.delete("/", asyncWrapper(userController.deleteExistingUser));

// get nutrition info totals for specified date range
router.get("/totals", asyncWrapper(userController.getUserTotals));

// get recently used food items
router.get("/recent-foods", asyncWrapper(userController.getRecentFoods));

module.exports = router;
