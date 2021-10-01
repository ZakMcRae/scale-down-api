require("dotenv").config({ path: "/home/zak/js/TOP/scale-down/test/test.env" });

const { test, expect, describe } = require("@jest/globals");
const userRouter = require("../../routes/user-routes");

const setUserFromToken = require("../../utils/setUserFromToken");
const request = require("supertest");
const express = require("express");
const User = require("../../models/user");
const app = express();

app.use(setUserFromToken);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter);

require("../test-db-setup");

describe("tests of get /user - getUserInfo", () => {
  test("unauthorized test of /user", async () => {
    // no auth sent - should fail
    const res = await request(app).get("/user");
    expect(res.status).toBe(401);
    expect(res.body.detail).toBe("Not Authorized");
  });

  test("authorized test of /user", async () => {
    // insert user into database to return info from - has id to match test token
    const user = new User({
      userName: "matt",
      hashedPassword: process.env.TEST_HASHED_PASSWORD,
      _id: "61547b22c7c5959e24db1b8e",
    });
    await user.save();

    // request uses specifically created test token to match user id above
    const res = await request(app)
      .get("/user")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      });
    expect(res.status).toBe(200);
    expect(res.body.userName).toBe("matt");
  });
});

describe("tests of post /user - createNewUser", () => {
  test("create new user - success", async () => {
    const res = await request(app)
      .post("/user")
      .send({ userName: "matt", password: "123" });
    expect(res.status).toBe(200);
    expect(res.body.userName).toBe("matt");
  });

  test("create new user - username taken", async () => {
    // add user to database
    const user = new User({
      userName: "matt",
      hashedPassword: process.env.TEST_HASHED_PASSWORD,
    });
    await user.save();

    // make request using same username
    const res = await request(app)
      .post("/user")
      .send({ userName: "matt", password: "123" });
    expect(res.status).toBe(409);
    expect(res.body.detail).toBe("Username is taken");
  });
});

describe("tests of post /user/token - createAuthToken", () => {
  test("create auth token for user", async () => {
    // insert user into database to make token for
    const user = new User({
      userName: "matt",
      hashedPassword: process.env.TEST_HASHED_PASSWORD,
      _id: "61547b22c7c5959e24db1b8e",
    });
    await user.save();

    const res = await request(app)
      .post("/user/token")
      .send({ userName: "matt", password: "123" });
    expect(res.status).toBe(200);
    expect(res.body.token_type).toBe("Bearer");
  });

  test("username not in database", async () => {
    const res = await request(app)
      .post("/user/token")
      .send({ userName: "matt" });
    expect(res.status).toBe(404);
    expect(res.body.detail).toBe("User not found");
  });

  test("incorrect password", async () => {
    // insert user into database - want username check to pass
    const user = new User({
      userName: "matt",
      hashedPassword: process.env.TEST_HASHED_PASSWORD,
      _id: "61547b22c7c5959e24db1b8e",
    });
    await user.save();

    // send request with an incorrect password
    const res = await request(app)
      .post("/user/token")
      .send({ userName: "matt", password: "abc" });
    expect(res.status).toBe(401);
    expect(res.body.detail).toBe("Incorrect Password");
  });
});
