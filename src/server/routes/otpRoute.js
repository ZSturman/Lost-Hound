import express from "express";

const router = express.Router();

// Import OTP Verification Controller
import otpVerification from "../controllers/otpVerificationController.js";

// All the API routes below

/**
 * @swagger
 * /api/account/register/sendOTP:
 *   post:
 *     summary: Send an OTP via email
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post("/sendOTP", otpVerification.sendEmail);

/**
 * @swagger
 * /api/account/register/verifyOTP:
 *   post:
 *     summary: Verify an OTP
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otpCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       400:
 *         description: Invalid OTP
 */
router.post("/verifyOTP", otpVerification.verifyOTP);

export default router;
