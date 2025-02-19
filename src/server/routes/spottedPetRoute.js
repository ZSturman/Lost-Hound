import express from 'express';

// import methods from controller
import { submitForm } from '../controllers/spottedPetController.js'

const router = express.Router()

// Handle POST request from front end containing form data

/**
 * @swagger
 * /api/spottedPet/submitForm:
 *   post:
 *     summary: Submit a Spotted Pet form
 *     tags:
 *       - Forms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Form submitted successfully
 *       400:
 *         description: Empty required fields or user is not logged in
 */
router.post("/submitForm", submitForm);



export default router;