const router = require("express").Router();
const mealController = require("../controllers/meal-controller");
const asyncWrapper = require("../utils/async-wrapper");

// create a new meal
/**
 * @openapi
 * /meal:
 *   post:
 *     security:
 *      - bearerToken: []
 *     summary: Create a new meal
 *     description: Create a new meal
 *     tags: [Meal]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MealIn'
 *     responses:
 *       200:
 *         description: Returns new meal's info
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/MealOut'
 *       400:
 *        description: Bad request, invalid parameters
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/ValidationError'
 *            example:
 *              error: "Request body parameter(s) invalid"
 *              detail:
 *                  - value: ""
 *                    msg: "name is required"
 *                    param: "name"
 *                    location: "body"
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 */
router.post(
  "/",
  mealController.mealValidationChain,
  asyncWrapper(mealController.createNewMeal)
);

// get meal info
/**
 * @openapi
 * /meal/{id}:
 *   get:
 *     security:
 *      - bearerToken: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Meal id
 *     summary: Get meal info
 *     description: Retrieves the info of the specified meal
 *     tags: [Meal]
 *     responses:
 *       200:
 *         description: Returns the info of the specified meal
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/MealOut'
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       404:
 *         description: Meal not found in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Meal not found
 */
router.get("/:id", asyncWrapper(mealController.getMealInfo));

// edit meal info
/**
 * @openapi
 * /meal/{id}:
 *   put:
 *     security:
 *      - bearerToken: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Meal id
 *     summary: Edit meal's info
 *     description: Edit meal's info
 *     tags: [Meal]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MealIn'
 *     responses:
 *       200:
 *         description: Returns edited meal's info
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/MealOut'
 *       400:
 *        description: Bad request, invalid parameters
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/ValidationError'
 *            example:
 *              error: "Request body parameter(s) invalid"
 *              detail:
 *                  - value: ""
 *                    msg: "name is required"
 *                    param: "name"
 *                    location: "body"
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Meal not found
 */
router.put(
  "/:id",
  mealController.mealValidationChain,
  asyncWrapper(mealController.editMealInfo)
);

// delete an existing meal
/**
 * @openapi
 * /meal/{id}:
 *   delete:
 *     security:
 *      - bearerToken: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Meal id
 *     summary: Delete the specified meal
 *     description: Delete the specified meal
 *     tags: [Meal]
 *     responses:
 *       200:
 *         description: Successful delete of meal
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                detail:
 *                  type: string
 *                  description: Detail of response
 *            example:
 *              detail: Meal deleted
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Meal not found
 */
router.delete("/:id", asyncWrapper(mealController.deleteExistingMeal));

// Openapi Meal schemas
/**
 * @openapi
 * components:
 *  schemas:
 *    MealIn:
 *      type: object
 *      required:
 *        -user
 *        -name
 *        -foodlist
 *      properties:
 *        user:
 *          type: string
 *          description: Name of the food item
 *        name:
 *          type: string
 *          description: Amount of food used
 *        foodList:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              foodItem:
 *                type: string
 *              servingSize:
 *                type: number
 *              servingUnit:
 *                type: string
 *      example:
 *        user: 61547b22c7c5959e24db1b8e
 *        name: Lunch
 *        foodList:
 *          -foodItem: 6165a98fa579134ccc0a6209
 *          -servingSize: 50
 *          -servingUnit: g
 *
 *    MealOut:
 *      type: object
 *      required:
 *        -user
 *        -name
 *        -foodlist
 *      properties:
 *        user:
 *          type: string
 *          description: Name of the food item
 *        name:
 *          type: string
 *          description: Amount of food used
 *        foodList:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              foodItem:
 *                type: string
 *              servingSize:
 *                type: number
 *              servingUnit:
 *                type: string
 *        _id:
 *          type: string
 *          description: Meal id
 *      example:
 *        user: 61547b22c7c5959e24db1b8e
 *        name: Lunch
 *        foodList:
 *          -foodItem: 6165a98fa579134ccc0a6209
 *          -servingSize: 50
 *          -servingUnit: g
 *        _id: 6165a9aba579134ccc0a620e
 */

module.exports = router;
