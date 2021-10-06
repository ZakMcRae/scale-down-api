var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Welcome! This is a temporary landing page");
});

module.exports = router;
