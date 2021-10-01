require("dotenv").config({ path: "./production.env" });

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const setUserFromToken = require("./utils/setUserFromToken");

var indexRouter = require("./routes");
var userRouter = require("./routes/user-routes");

var app = express();

// db config
const mongoDb = process.env.DB_URL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

app.use("/", indexRouter);
app.use("/user/", userRouter);

app.use(logger("dev"));
app.use(setUserFromToken);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// default error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.json({ status: err.status, detail: err.message });
});

module.exports = app;
