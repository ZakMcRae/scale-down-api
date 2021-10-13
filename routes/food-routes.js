const router = require("express").Router();
const foodController = require("../controllers/food-controller");
const asyncWrapper = require("../utils/async-wrapper");

// create a new food
/**
 * @openapi
 * /food:
 *   post:
 *     security:
 *      - bearerToken: []
 *     summary: Create a new food item
 *     description: Create a new food item
 *     tags: [Food]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/FoodIn'
 *     responses:
 *       200:
 *         description: Returns new food item's info
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/FoodOut'
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
 *                    msg: "calories is required"
 *                    param: "calories"
 *                    location: "body"
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       409:
 *         description: Food name is taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Food name is taken
 */
router.post(
  "/",
  foodController.foodItemValidationChain,
  asyncWrapper(foodController.createNewFoodItem)
);

// get food info
/**
 * @openapi
 * /food/{id}:
 *   get:
 *     security:
 *      - bearerToken: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Food item id
 *     summary: Get nutrition info of food
 *     description: Retrieves the nutrition info of the specified food
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Returns a food item's info
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/FoodOut'
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       404:
 *         description: Food not found in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Food not found
 */
router.get("/:id", asyncWrapper(foodController.getFoodItemInfo));

// edit food info
/**
 * @openapi
 * /food/{id}:
 *   put:
 *     security:
 *      - bearerToken: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Food item id
 *     summary: Edit food item's info
 *     description: Edit food item's info
 *     tags: [Food]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/FoodIn'
 *     responses:
 *       200:
 *         description: Returns edited food item's info
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/FoodOut'
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
 *                    msg: "calories is required"
 *                    param: "calories"
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
 *         description: Food not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Food not found
 *       409:
 *         description: Food name is taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Food name is taken
 */
router.put(
  "/:id",
  foodController.foodItemValidationChain,
  asyncWrapper(foodController.editFoodItemInfo)
);

// delete an existing food
/**
 * @openapi
 * /food/{id}:
 *   delete:
 *     security:
 *      - bearerToken: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Food item id
 *     summary: Delete the specified food item
 *     description: Delete the specified food item
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Successful delete of food item
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                detail:
 *                  type: string
 *                  description: Detail of response
 *            example:
 *              detail: Food deleted
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       404:
 *         description: Food not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Food not found
 */
router.delete("/:id", asyncWrapper(foodController.deleteExistingFoodItem));

// Openapi Food schemas
/**
 * @openapi
 * components:
 *  schemas:
 *    FoodIn:
 *      type: object
 *      required:
 *        -name
 *        -servingSize
 *        -servingUnit
 *        -calories
 *        -fats
 *        -carbs
 *        -proteins
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the food item
 *        servingSize:
 *          type: sting
 *          description: Amount of food used
 *        servingUnit:
 *          type: string
 *          description: Unit of measurement for food used
 *        calories:
 *          type: sting
 *          description: Amount of calories per servingSize
 *        fats:
 *          type: string
 *          description: Amount of fats per servingSize
 *        carbs:
 *          type: sting
 *          description: Amount of carbs per servingSize
 *        proteins:
 *          type: string
 *          description: Amount of proteins per servingSize
 *      example:
 *        name: Tomato
 *        servingSize: 100
 *        servingUnit: g
 *        calories: 18
 *        fats: 0.2
 *        carbs: 3.9
 *        proteins: 0.9
 *
 *    FoodOut:
 *      type: object
 *      required:
 *        -name
 *        -servingSize
 *        -servingUnit
 *        -calories
 *        -fats
 *        -carbs
 *        -proteins
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the food item
 *        servingSize:
 *          type: sting
 *          description: Amount of food used
 *        servingUnit:
 *          type: string
 *          description: Unit of measurement for food used
 *        calories:
 *          type: sting
 *          description: Amount of calories per servingSize
 *        fats:
 *          type: string
 *          description: Amount of fats per servingSize
 *        carbs:
 *          type: sting
 *          description: Amount of carbs per servingSize
 *        proteins:
 *          type: string
 *          description: Amount of proteins per servingSize
 *        _id:
 *          type: string
 *          description: FoodItem id
 *      example:
 *        name: Tomato
 *        servingSize: 100
 *        servingUnit: g
 *        calories: 18
 *        fats: 0.2
 *        carbs: 3.9
 *        proteins: 0.9
 *        _id: 61546e2e75b78614c8ff7de4
 */

module.exports = router;
