const router = require("express").Router();
const userController = require("../controllers/user-controller");
const asyncWrapper = require("../utils/async-wrapper");

// create a new user
router.post("/", asyncWrapper(userController.createNewUser));

// generate a 30day auth token for existing user
router.post("/token", asyncWrapper(userController.createAuthToken));

// get user info
router.get("/", asyncWrapper(userController.getUserInfo));

module.exports = router;
