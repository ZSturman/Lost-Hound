import express from "express";

const router = express.Router();

// Import Account Controller
import accountController from "../controllers/accountController.js";

// All the API routes below
// include get, post, put, delete (depending on which is applicable)
//router.get('/', account.getAllUsers)

/**
 * @swagger
 * /api/account/:
 *   get:
 *     summary: Get the current account
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: Returns the current account details
 *       400:
 *         description: Error retrieving current account
 *       401:
 *         description: User is not authenticated
 */
router.get("/", accountController.getCurrentAccount);

/**
 * @swagger
 * /api/account/{accountId}:
 *   get:
 *     summary: Get account by ID
 *     tags:
 *       - Accounts
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account
 *     responses:
 *       200:
 *         description: Account details
 *       400:
 *         description: Error retrieving account
 *       401:
 *         description: User is not authenticated
 */
router.get("/:accountId", accountController.getAccount);

/**
 * @swagger
 * /api/account/login:
 *   post:
 *     summary: Log in to the account
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Error logging in account
 *       401:
 *         description: Unauthorized
 */
router.post("/login", accountController.login);

/**
 * @swagger
 * /api/account/register:
 *   post:
 *     summary: Register a new account
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account created
 *       400:
 *         description: Error registration
 */
router.post("/register", accountController.signup);

/**
 * @swagger
 * /api/account/:
 *   put:
 *     summary: Edit account details
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated
 *       400:
 *         description: Error editing account
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.put("/", accountController.editAccount);

/**
 * @swagger
 * /api/account/:
 *   delete:
 *     summary: Delete the current account
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: Account deleted
 *       400:
 *         description: Error editing account
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.delete("/", accountController.deleteAccount);

/**
 * @swagger
 * /api/account/changePassword:
 *   post:
 *     summary: Change the account password
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Error editing account
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.post("/changePassword", accountController.changePassword);

/**
 * @swagger
 * /api/account/logout:
 *   post:
 *     summary: Log out of the account
 *     tags:
 *       - Accounts
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.post("/logout", accountController.logout);

export default router;
