const router = require("express").Router();
const userController = require("../controllers/user-controller");
const asyncWrapper = require("../utils/async-wrapper");

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

// generate a 30day auth token for existing user
router.post(
  "/token",
  userController.userValidationChain,
  asyncWrapper(userController.createAuthToken)
);

/**
 * @openapi
 * /user:
 *   get:
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

/**
 * @openapi
 * /user:
 *   put:
 *     summary: Edit current users info
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
 *       409:
 *         description: Username is taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: Username is taken
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: User not found
 *       403:
 *         description: Incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              detail: User Incorrect password
 */
router.put(
  "/",
  userController.userValidationChain,
  asyncWrapper(userController.editUserInfo)
);

// delete an existing user
router.delete("/", asyncWrapper(userController.deleteExistingUser));

// get nutrition info totals for specified date range
router.get("/totals", asyncWrapper(userController.getUserTotals));

// get recently used food items
router.get("/recent-foods", asyncWrapper(userController.getRecentFoods));

// Openapi schemas
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

// Openapi tags
/**
 * @openapi
 * tags:
 *  name: User
 */

module.exports = router;
