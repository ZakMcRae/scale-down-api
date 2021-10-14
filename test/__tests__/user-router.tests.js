require("dotenv").config({
  path: "/home/zak/js/TOP/scale-down-api/test/test.env",
});

const { test, expect, describe } = require("@jest/globals");
const userRouter = require("../../routes/user-routes");
const mealRouter = require("../../routes/meal-routes");

const setUserFromToken = require("../../utils/setUserFromToken");
const request = require("supertest");
const express = require("express");
const sampleData = require("../utils/sample-data");
const app = express();

app.use(setUserFromToken);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", userRouter);
app.use("/meal", mealRouter);

require("../utils/test-db-setup");

describe("tests of get /user - getUserInfo", () => {
  test("unauthorized test of /user", async () => {
    // no auth sent - should fail
    const res = await request(app).get("/user");
    expect(res.status).toBe(401);
    expect(res.body.detail).toBe("Not Authorized");
  });

  test("authorized test of /user", async () => {
    // insert user into database to return info from - has id to match test token
    sampleData.addFakeUser();

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
      .send({ userName: "matt", password: "123456" });
    expect(res.status).toBe(200);
    expect(res.body.userName).toBe("matt");
  });

  test("create new user - username taken", async () => {
    // add user to database
    sampleData.addFakeUser();

    // make request using same username
    const res = await request(app)
      .post("/user")
      .send({ userName: "matt", password: "123456" });
    expect(res.status).toBe(409);
    expect(res.body.detail).toBe("Username is taken");
  });

  test("password too short", async () => {
    const res = await request(app)
      .post("/user")
      .send({ userName: "matt", password: "123" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Request body parameter(s) invalid");
  });
});

describe("tests of post /user/token - createAuthToken", () => {
  test("create auth token for user", async () => {
    // insert user into database to make token for
    sampleData.addFakeUser();

    const res = await request(app)
      .post("/user/token")
      .send({ userName: "matt", password: "123456" });
    expect(res.status).toBe(200);
    expect(res.body.token_type).toBe("Bearer");
  });

  test("username not in database", async () => {
    const res = await request(app)
      .post("/user/token")
      .send({ userName: "matt", password: "abcdef" });
    expect(res.status).toBe(404);
    expect(res.body.detail).toBe("User not found");
  });

  test("incorrect password", async () => {
    // insert user into database - want username check to pass
    sampleData.addFakeUser();

    // send request with an incorrect password
    const res = await request(app)
      .post("/user/token")
      .send({ userName: "matt", password: "abcdef" });
    expect(res.status).toBe(403);
    expect(res.body.detail).toBe("Incorrect password");
  });
});

describe("tests of put /user - editUserInfo", () => {
  test("successful edit of user info", async () => {
    // insert user into database - want username check to pass
    sampleData.addFakeUser();

    // edit user info
    const res = await request(app)
      .put("/user")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({ userName: "jim", password: 123456 });
    expect(res.status).toBe(200);
    expect(res.body.userName).toBe("jim");
  });

  test("username is taken", async () => {
    // insert user into database - want username check to pass
    sampleData.addFakeUser();

    // edit user info
    const res = await request(app)
      .put("/user")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({ userName: "matt", password: 123456 });
    expect(res.status).toBe(409);
    expect(res.body.detail).toBe("Username is taken");
  });

  test("incorrect password", async () => {
    // insert user into database - want username check to pass
    sampleData.addFakeUser();

    // edit user info
    const res = await request(app)
      .put("/user")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({ userName: "jim", password: "abcdef" });
    expect(res.status).toBe(403);
    expect(res.body.detail).toBe("Incorrect Password");
  });
});

describe("tests of delete /user - deleteExistingUser", () => {
  test("successful delete of user", async () => {
    // insert user to delete
    sampleData.addFakeUser();

    // delete user
    const res = await request(app)
      .delete("/user")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      });
    expect(res.status).toBe(200);
    expect(res.body.detail).toBe("User deleted");
  });
});

describe("test of get /user/recent-foods - getRecentFoods", () => {
  test("successful retrieval of recent foods", async () => {
    // do a request to add a meal - should automatically create recent foods
    await sampleData.addFakeUser();
    await sampleData.addFakeFoods();

    await request(app)
      .post("/meal")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        user: "61547b22c7c5959e24db1b8e",
        name: "Dinner",
        date: Date.now(),
        foodList: [
          {
            foodItem: "61546e2e75b78614c8ff7de3",
            servingSize: 50,
            servingUnit: "g",
          },
        ],
      });

    // do a 2nd request to add a new food/meal - should automatically update recent foods
    await request(app)
      .post("/meal")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        user: "61547b22c7c5959e24db1b8e",
        name: "Dinner",
        date: Date.now(),
        foodList: [
          {
            foodItem: "61546e2e75b78614c8ff7de4",
            servingSize: 10,
            servingUnit: "g",
          },
        ],
      });

    // now test the recent foods database retrieval
    const res = await request(app)
      .get("/user/recent-foods")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      });
    expect(res.status).toBe(200);
    expect(res.body.foods.length).toBe(2);
  });
});

describe("tests of get /user/totals - getUserTotals", () => {
  test("successful - no parameters passed, uses default today", async () => {
    // add a fake meal to get totals of
    await sampleData.addFakeUser();
    await sampleData.addFakeFoods();
    await sampleData.addFakeMeal();

    const res = await request(app)
      .get("/user/totals")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.totals.calories).toBe(1513.76);
  });

  test("successful - date passed in", async () => {
    // add a fake meal to get totals of
    await sampleData.addFakeUser();
    await sampleData.addFakeFoods();
    await sampleData.addFakeMeal();

    // search date of today since addFakeMeal added just prior
    // Date() does months 0-11 - add 1 to month to get typical representation
    const today = new Date();
    const [year, month, day] = [
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    ];
    const searchDate = `${year}-${month}-${day}`;

    const res = await request(app)
      .get("/user/totals")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .query({ date: searchDate });

    expect(res.status).toBe(200);
    expect(res.body.totals.calories).toBe(1513.76);
  });

  test("successful - date range passed in", async () => {
    // add a fake meal to get totals of
    await sampleData.addFakeUser();
    await sampleData.addFakeFoods();
    await sampleData.addFakeMeal();

    // very wide search range since only using test db - test valid until 2099
    const startDate = "2021-01-01";
    const endDate = "2099-01-01";

    const res = await request(app)
      .get("/user/totals")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .query({ startDate: startDate, endDate: endDate });

    expect(res.status).toBe(200);
    expect(res.body.totals.calories).toBe(1513.76);
  });

  test("failure - too many parameters", async () => {
    const res = await request(app)
      .get("/user/totals")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .query({
        date: "2020-10-10",
        startDate: "2020-10-10",
        endDate: "2020-10-10",
      });

    expect(res.status).toBe(400);
    expect(res.body.detail).toBe(
      "Too many options specified at once. Can only send just 'date' or both 'startDate' and 'endDate'"
    );
  });

  test("failure - too few range parameters", async () => {
    const res = await request(app)
      .get("/user/totals")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .query({
        startDate: "2020-10-10",
      });

    expect(res.status).toBe(400);
    expect(res.body.detail).toBe(
      "You only specified either startDate or endDate. You must send both. For 1 date use 'date' instead"
    );
  });

  test("incorrect date paramter format - 1 correct (YYYY-MM-DD), 1 incorrect", async () => {
    // start date format is very wrong
    const startDate = "a";
    const endDate = "2099-01-01";

    const res = await request(app)
      .get("/user/totals")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .query({ startDate: startDate, endDate: endDate });

    expect(res.status).toBe(400);
    expect(res.body.detail).toBe(
      "Date parameter error - typically invalid date format. Should be YYYY-MM-DD"
    );
  });
});
