require("dotenv").config({ path: "/home/zak/js/TOP/scale-down/test/test.env" });

const { test, expect, describe } = require("@jest/globals");
const mealRouter = require("../../routes/meal-routes");

const setUserFromToken = require("../../utils/setUserFromToken");
const request = require("supertest");
const express = require("express");
const sampleData = require("../utils/sample-data");
const app = express();

app.use(setUserFromToken);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/meal", mealRouter);

require("../utils/test-db-setup");

describe("tests of get /meal:id - getMealInfo", () => {
  test("success - return info", async () => {
    // add fake database info
    await sampleData.addFakeUser();
    await sampleData.addFakeFoods();
    await sampleData.addFakeMeal();

    const res = await request(app)
      .get("/meal/61546e4775b78614c8ff7dea")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Dinner");
    expect(res.body.totals.calories).toBe(1513.76);
  });

  test("invalid meal id", async () => {
    // no fake data added to db - should fail
    const res = await request(app)
      .get("/meal/61546e2e75b78614c8ff7de4")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      });
    expect(res.status).toBe(404);
    expect(res.body.detail).toBe("Meal not found");
  });
});

describe("tests of post /meal - createNewMeal", () => {
  test("successful creation of a meal", async () => {
    await sampleData.addFakeUser();
    await sampleData.addFakeFoods();

    // proper request with all required info
    const res = await request(app)
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
          {
            foodItem: "61546e2e75b78614c8ff7de4",
            servingSize: 10,
            servingUnit: "g",
          },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Dinner");
    expect(res.body.totals.calories).toBe(167.8);
  });

  test("missing required meal properties", async () => {
    // improper request missing the required name and servingSize of item 2
    const res = await request(app)
      .post("/meal")
      .set({
        Authorization: `Bearer ${process.env.TEST_TOKEN}`,
      })
      .send({
        user: "61547b22c7c5959e24db1b8e",
        date: Date.now(),
        foodList: [
          {
            foodItem: "61546e2e75b78614c8ff7de3",
            servingSize: 50,
            servingUnit: "g",
          },
          {
            foodItem: "61546e2e75b78614c8ff7de4",
            servingUnit: "g",
          },
        ],
      });
    expect(res.status).toBe(422);
    expect(res.body.detail).toBe(
      "Missing required meal item information - name, servingSize of foodList 1"
    );
  });
});

// describe("tests of put /meal:id - editMealInfo", () => {
//   test("success - edit item", async () => {
//     await sampleData.addFakeMeal();

//     const res = await request(app)
//       .put("/meal/61546e2e75b78614c8ff7de4")
//       .set({
//         Authorization: `Bearer ${process.env.TEST_TOKEN}`,
//       })
//       .send({
//         name: "Tomato",
//         servingSize: 50,
//         servingUnit: "g",
//         calories: 9,
//         fats: 0.1,
//         carbs: 1.9,
//         proteins: 0.4,
//       });
//     expect(res.status).toBe(200);
//     expect(res.body.name).toBe("Tomato");
//     expect(res.body.servingSize).toBe(50);
//   });

//   test("meal not in database", async () => {
//     const res = await request(app)
//       .put("/meal/61546e2e75b78614c8ff7de4")
//       .set({
//         Authorization: `Bearer ${process.env.TEST_TOKEN}`,
//       })
//       .send({
//         name: "Tomato",
//         servingSize: 50,
//         servingUnit: "g",
//         calories: 9,
//         fats: 0.1,
//         carbs: 1.9,
//         proteins: 0.4,
//       });
//     expect(res.status).toBe(404);
//     expect(res.body.detail).toBe("Meal not found");
//   });

//   test("missing required fields", async () => {
//     await sampleData.addFakeMeal();

//     const res = await request(app)
//       .put("/meal/61546e2e75b78614c8ff7de4")
//       .set({
//         Authorization: `Bearer ${process.env.TEST_TOKEN}`,
//       })
//       .send({
//         name: "Tomato",
//         servingUnit: "g",
//         calories: 9,
//         fats: 0.1,
//         carbs: 1.9,
//       });
//     expect(res.status).toBe(422);
//     expect(res.body.detail).toBe(
//       "Missing required meal item information - servingSize, proteins"
//     );
//   });

//   test("name already taken", async () => {
//     // trying to change Ground Beef to Tomato when Tomato already in database
//     await sampleData.addFakeMeal();

//     const res = await request(app)
//       .put("/meal/61546e2e75b78614c8ff7de3")
//       .set({
//         Authorization: `Bearer ${process.env.TEST_TOKEN}`,
//       })
//       .send({
//         name: "Tomato",
//         servingSize: 50,
//         servingUnit: "g",
//         calories: 9,
//         fats: 0.1,
//         carbs: 1.9,
//         proteins: 0.4,
//       });
//     expect(res.status).toBe(409);
//     expect(res.body.detail).toBe("Meal name is taken");
//   });
// });

// describe("tests of delete /meal:id - deleteExistingMeal", () => {
//   test("success - delete item", async () => {
//     // add meal to delete
//     await sampleData.addFakeMeal();

//     const res = await request(app)
//       .delete("/meal/61546e2e75b78614c8ff7de4")
//       .set({
//         Authorization: `Bearer ${process.env.TEST_TOKEN}`,
//       });
//     expect(res.status).toBe(200);
//     expect(res.body.detail).toBe("Meal deleted");
//   });

//   test("item not in database", async () => {
//     // empty database - nothing to delete
//     const res = await request(app)
//       .delete("/meal/61546e2e75b78614c8ff7de4")
//       .set({
//         Authorization: `Bearer ${process.env.TEST_TOKEN}`,
//       });
//     expect(res.status).toBe(404);
//     expect(res.body.detail).toBe("Meal not found");
//   });
// });
