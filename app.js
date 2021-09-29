require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// db config
const mongoDb = process.env.DB_URL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

var app = express();

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

module.exports = app;
