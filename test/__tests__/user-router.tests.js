const { test, expect } = require("@jest/globals");
const userRouter = require("../../routes/user");

const request = require("supertest");
const express = require("express");
const User = require("../../models/user");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter);

require("../test-db-setup");

test("basic test of /user", async () => {
  const res = await request(app).get("/user");
  expect(res.text).toBe("Welcome Guest");
});

test("retrieve user data", async () => {
  const user = new User({ userName: "zak", hashedPassword: "123" });
  await user.save();

  const res = await request(app).get("/user/a");
  expect(res.body.userName).toBe("zak");
  expect(res.body.hashedPassword).toBe("123");
});
