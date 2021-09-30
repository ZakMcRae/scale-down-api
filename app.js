require("dotenv").config({ path: "./production.env" });

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

var app = express();

// db config
const mongoDb = process.env.DB_URL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// extracts userId and sets on req.userId if token sent in header
//
// can be used to check if authorized on routes
// i.e. if !(req.userId) return res.status(401).send('Unauthorized')
const setUserFromToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader === undefined) {
      return next();
    }

    const tokenPayload = await jwt.verify(
      authHeader.slice(7),
      process.env.JWT_SECRET
    );
    req.userId = tokenPayload.user;

    next();
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
};

app.use(logger("dev"));
app.use(setUserFromToken);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user/", userRouter);

// default error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.json({ status: err.status, detail: err.message });
});

module.exports = app;
