require("dotenv").config({ path: "/home/zak/js/TOP/scale-down/test/test.env" });

const { test, expect, describe } = require("@jest/globals");
const foodRouter = require("../../routes/food-routes");

const setUserFromToken = require("../../utils/setUserFromToken");
const request = require("supertest");
const express = require("express");
const sampleData = require("../utils/sample-data");
const app = express();

app.use(setUserFromToken);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/food", foodRouter);

require("../utils/test-db-setup");

describe("tests of get /food:id - getFoodItemInfo", () => {
  test("success - return info", async () => {
    await sampleData.addFakeFoods();

    const res = await request(app)
      .get("/food/61546e2e75b78614c8ff7de4")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Tomato");
  });

  test("invalid food id", async () => {
    // no fake data added to db - should fail
    const res = await request(app)
      .get("/food/61546e2e75b78614c8ff7de4")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      });
    expect(res.status).toBe(404);
    expect(res.body.detail).toBe("Food not found");
  });
});

describe("tests of post /food - createNewFoodItem", () => {
  test("successful creation of a food item", async () => {
    // proper request with all required info
    const res = await request(app)
      .post("/food")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        name: "Tomato",
        servingSize: 100,
        servingUnit: "g",
        calories: 18,
        fats: 0.2,
        carbs: 3.9,
        proteins: 0.9,
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Tomato");
    expect(res.body.calories).toBe(18);
  });

  test("missing required food item properties", async () => {
    // improper request missing the required calories and carbs properties
    const res = await request(app)
      .post("/food")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        name: "Tomato",
        servingSize: 100,
        servingUnit: "g",
        fats: 0.2,
        proteins: 0.9,
      });
    expect(res.status).toBe(422);
    expect(res.body.detail).toBe(
      "Missing required food item information - calories, carbs"
    );
  });
});

describe("tests of put /food:id - editFoodItemInfo", () => {
  test("success - edit item", async () => {
    await sampleData.addFakeFoods();

    const res = await request(app)
      .put("/food/61546e2e75b78614c8ff7de4")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        name: "Tomato",
        servingSize: 50,
        servingUnit: "g",
        calories: 9,
        fats: 0.1,
        carbs: 1.9,
        proteins: 0.4,
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Tomato");
    expect(res.body.servingSize).toBe(50);
  });

  test("food not in database", async () => {
    const res = await request(app)
      .put("/food/61546e2e75b78614c8ff7de4")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        name: "Tomato",
        servingSize: 50,
        servingUnit: "g",
        calories: 9,
        fats: 0.1,
        carbs: 1.9,
        proteins: 0.4,
      });
    expect(res.status).toBe(404);
    expect(res.body.detail).toBe("Food not found");
  });

  test("missing required fields", async () => {
    await sampleData.addFakeFoods();

    const res = await request(app)
      .put("/food/61546e2e75b78614c8ff7de4")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        name: "Tomato",
        servingUnit: "g",
        calories: 9,
        fats: 0.1,
        carbs: 1.9,
      });
    expect(res.status).toBe(422);
    expect(res.body.detail).toBe(
      "Missing required food item information - servingSize, proteins"
    );
  });

  test("name already taken", async () => {
    // trying to change Ground Beef to Tomato when Tomato already in database
    await sampleData.addFakeFoods();

    const res = await request(app)
      .put("/food/61546e2e75b78614c8ff7de3")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        name: "Tomato",
        servingSize: 50,
        servingUnit: "g",
        calories: 9,
        fats: 0.1,
        carbs: 1.9,
        proteins: 0.4,
      });
    expect(res.status).toBe(409);
    expect(res.body.detail).toBe("Food name is taken");
  });
});
