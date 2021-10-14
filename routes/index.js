var express = require("express");
var router = express.Router();

// redirect 'home' to api docs page
router.get("/", function (req, res, next) {
  return res.redirect("/api-docs");
});

module.exports = router;
