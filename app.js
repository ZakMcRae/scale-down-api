require("dotenv").config({ path: "./production.env" });

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const setUserFromToken = require("./utils/setUserFromToken");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Scale Down API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user-routes");
var foodRouter = require("./routes/food-routes");
var mealRouter = require("./routes/meal-routes");

var app = express();

// db config
const mongoDb = process.env.DB_URL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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

// routers
app.use("/", indexRouter);
app.use("/user/", userRouter);
app.use("/food/", foodRouter);
app.use("/meal/", mealRouter);

module.exports = app;
