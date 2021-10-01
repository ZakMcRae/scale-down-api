const { test, expect, describe } = require("@jest/globals");
const userRouter = require("../../routes/user-routes");

const request = require("supertest");
const express = require("express");
const User = require("../../models/user");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter);

require("../test-db-setup");

describe("tests of get /user - getUserInfo", () => {
  test("unauthorized test of /user", async () => {
    const res = await request(app).get("/user");
    expect(res.body.detail).toBe("Not Authorized");
  });
});

describe("test of post /user - createNewUser", () => {
  test("create new user - success", async () => {
    const res = await request(app)
      .post("/user")
      .send({ userName: "matt", password: "123" });
    expect(res.status).toBe(200);
    expect(res.body.userName).toBe("matt");
  });

  test("create new user - username taken", async () => {
    // add user to database to test a taken username
    const user = new User({ userName: "matt", hashedPassword: "123" });
    await user.save();

    // test for taken name
    const res = await request(app)
      .post("/user")
      .send({ userName: "matt", password: "123" });
    expect(res.status).toBe(409);
    expect(res.text).toBe("Username is taken");
  });
});

// test("retrieve user data", async () => {
//   const user = new User({ userName: "zak", hashedPassword: "123" });
//   await user.save();

//   const res = await request(app).get("/user/a");
//   expect(res.body.userName).toBe("zak");
//   expect(res.body.hashedPassword).toBe("123");
// });
