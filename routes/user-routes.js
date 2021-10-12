const router = require("express").Router();
const userController = require("../controllers/user-controller");
const asyncWrapper = require("../utils/async-wrapper");

// Generate bearer auth token for user
/**
 * @openapi
 * /user/token:
 *   post:
 *     summary: Generate bearer auth token for user
 *     description: Generate a bearer authorization token for existing user. Expires after 30 days.
 *     tags: [User]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserIn'
 *     responses:
 *       200:
 *         description: Returns bearer auth token
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: Bearer auth token
 *                token_type:
 *                  type: string
 *                  description: Type of auth token (Bearer)
 *                expires_in:
 *                  type: number
 *                  description: Time in seconds until token expires
 *            example:
 *              token: f4k3t0k3n
 *              token_type: Bearer
 *              expires_in: 2592000
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
 *                    msg: "userName is required"
 *                    param: "userName"
 *                    location: "body"
 *       404:
 *         description: Username not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Username not found
 *       403:
 *         description: Incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Incorrect password
 */
router.post(
  "/token",
  userController.userValidationChain,
  asyncWrapper(userController.createAuthToken)
);

// Create a new user
/**
 * @openapi
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Create an account for a new user
 *     tags: [User]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserIn'
 *     responses:
 *       200:
 *         description: Returns new user's info
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserOut'
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
 *                    msg: "userName is required"
 *                    param: "userName"
 *                    location: "body"
 *       409:
 *         description: Username is taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Username is taken
 */
router.post(
  "/",
  userController.userValidationChain,
  asyncWrapper(userController.createNewUser)
);

// Get current users info
/**
 * @openapi
 * /user:
 *   get:
 *     security:
 *      - bearerToken: []
 *     summary: Get current users info
 *     description: Retrieves the current authorized user's information based off of Auth token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Returns a users info
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserOut'
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: User not found
 */
router.get("/", asyncWrapper(userController.getUserInfo));

//Change the current user's username
/**
 * @openapi
 * /user:
 *   put:
 *     security:
 *      - bearerToken: []
 *     summary: Change the current user's username
 *     description: Change the current user's username
 *     tags: [User]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserIn'
 *     responses:
 *       200:
 *         description: Returns a users info
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserOut'
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
 *                    msg: "userName is required"
 *                    param: "userName"
 *                    location: "body"
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       403:
 *         description: Incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Incorrect Password
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: User not found
 *       409:
 *         description: Username is taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Username is taken
 */
router.put(
  "/",
  userController.userValidationChain,
  asyncWrapper(userController.editUserInfo)
);

// Delete the current user
/**
 * @openapi
 * /user:
 *   delete:
 *     security:
 *      - bearerToken: []
 *     summary: Delete the current user
 *     description: Delete the current user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successful delete of user
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                detail:
 *                  type: string
 *                  description: Detail of response
 *            example:
 *              detail: User deleted
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: User not found
 */
router.delete("/", asyncWrapper(userController.deleteExistingUser));

// Get nutrition info totals for specified date range
/**
 * @openapi
 * /user/totals:
 *   get:
 *     parameters:
 *      - in: query
 *        name: date
 *        description: Specific date. This parameter can only be used alone.
 *        schema:
 *          type: string
 *      - in: query
 *        name: startDate
 *        description: Start of date range. This paramter can only be used when sent with endDate.
 *        schema:
 *          type: string
 *      - in: query
 *        name: endDate
 *        description: End of date range. This paramter can only be used when sent with startDate.
 *        schema:
 *          type: string
 *     security:
 *      - bearerToken: []
 *     summary: Get nutrition info totals for user by specified date or range
 *     description: Date format should be YYYY-MM-DD. <br/>If no query params passed defaults to current date.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Return user's nutrition info totals
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  type: string
 *                  description: User id
 *                totals:
 *                  type: object
 *                  properties:
 *                    calories:
 *                      type: number
 *                    fats:
 *                      type: number
 *                    carbs:
 *                      type: number
 *                    proteins:
 *                      type: number
 *            example:
 *              user: 6165a978a579134ccc0a6206
 *              totals:
 *                calories: 167.8
 *                fats: 15.02
 *                carbs: 0.39
 *                proteins: 7.09
 *       400:
 *         description: Bad request, parameter error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              - detail: Invalid date format, too many parameters, or wrong mix of parameters. More specific details provided from real response.
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 */
router.get("/totals", asyncWrapper(userController.getUserTotals));

// Get the user's most recently used food items
/**
 * @openapi
 * /user/recent-foods:
 *   get:
 *     security:
 *      - bearerToken: []
 *     summary: Get the user's most recently used food items
 *     description: Get the user's most recently used food items
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Return user's most recent used food items
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  type: string
 *                  description: User id
 *                foods:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      foodItem:
 *                        type: object
 *                        properties:
 *                          _id:
 *                           type: string
 *                          name:
 *                            type: string
 *                          servingSize:
 *                            type: number
 *                          servingUnit:
 *                            type: string
 *                          calories:
 *                            type: number
 *                          fats:
 *                            type: number
 *                          carbs:
 *                             type: number
 *                          proteins:
 *                             type: number
 *                      dateUsed:
 *                        type: string
 *            example:
 *              user: 6165a978a579134ccc0a6206
 *              foods:
 *                - foodItem:
 *                    _id: 6165a98fa579134ccc0a6209
 *                    name: Tomato
 *                    servingSize: 100
 *                    servingUnit: g
 *                    calories: 18
 *                    fats: 0.2
 *                    carbs: 3.9
 *                    proteins: 0.9
 *                  dateUsed: 2021-10-12T15:28:43.302Z
 *                - foodItem:
 *                    _id: 6165a99ca579134ccc0a620c
 *                    name: Ground Beef
 *                    servingSize: 100
 *                    servingUnit: g
 *                    calories: 332
 *                    fats: 30
 *                    carbs: 0
 *                    proteins: 14
 *                  dateUsed: 2021-10-12T15:28:43.302Z
 *
 *       401:
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Not Authorized
 *       404:
 *         description: User's recent foods list is empty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Recent Foods not found, user has never created a meal. They are automatically tracked when users create/edit meals
 */
router.get("/recent-foods", asyncWrapper(userController.getRecentFoods));

// Openapi User schemas
/**
 * @openapi
 * components:
 *  schemas:
 *    UserIn:
 *      type: object
 *      required:
 *        -userName
 *        -password
 *      properties:
 *        userName:
 *          type: string
 *          description: Username that user will use to access account
 *        password:
 *          type: sting
 *          description: Password that user will use to access account
 *      example:
 *        userName: matt
 *        password: 123456
 *
 *    UserOut:
 *      type: object
 *      required:
 *        -userName
 *      properties:
 *        id:
 *          type: string
 *          description: Autogenerated id
 *        userName:
 *          type: string
 *          description: Username that user will use to access account
 *      example:
 *        id: 61547b22c7c5959e24db1b8e
 *        username: matt
 *
 *    ValidationError:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: Error message
 *        detail:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              value:
 *                type: string
 *                description: Current value of parameter
 *              msg:
 *                type: string
 *                description: Current error with parameter
 *              param:
 *                type: string
 *                description: Parameter that caused validation error
 *              location:
 *                type: string
 *                description: Location of parameter in request object
 *
 *    Error:
 *      type: object
 *      properties:
 *        detail:
 *          type: string
 *          description: Error message
 */

module.exports = router;
