const router = require("express").Router();
const userController = require("../controllers/user-controller");
const asyncWrapper = require("../utils/async-wrapper");

// create a new user
router.post("/", asyncWrapper(userController.createNewUser));

// generate a 30day auth token for existing user
router.post("/token", asyncWrapper(userController.createAuthToken));

// get user info
router.get("/", asyncWrapper(userController.getUserInfo));

// edit user info
router.put("/", asyncWrapper(userController.editUserInfo));

// delete an existing user
router.delete("/", asyncWrapper(userController.deleteExistingUser));

// get nutrition info totals for specified date
router.get("/user/:date/total", asyncWrapper(userController.getDateTotals));

// get nutrition info totals for specified week
router.get("/user/:week/total", asyncWrapper(userController.getWeekTotals));

module.exports = router;
