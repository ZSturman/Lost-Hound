import express from 'express';
// import multer from 'multer'

// import methods from controller
import { submitForm } from '../controllers/lostPetController.js'

const router = express.Router()
// const upload = multer({ storage: multer.memoryStorage() });

// Handle POST request from front end containing form data

/**
 * @swagger
 * /api/lostPet/submitForm:
 *   post:
 *     summary: Submit a Lost Pet form
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

//router.post('/uploadImage', upload.single('image'), uploadImage); //Ignore, subject to change

/* // Handle POST request from front end requesting validation of form data
router.post('/validateForm', async (req, res, next) => {
    const formData = req.body;
    const validationErrors = await validateFormData(formData);
    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors: validationErrors });
    }
    res.json({ message: 'Form data successfully validated' });
})

router.post('/uploadImage', async (req, res, next) => {
    const image = req.body.image;
    // upload image to firebase storage
    res.json({ message: 'Image successfully uploaded' });
})

router.get('/getSpeciesList', getSpeciesList)
router.post('/postForm ', submitForm)
router.post('/upload', uploadImage) */

export default router;