import express from "express";
import getMatches from "../controllers/resultController.js";


const router = express.Router();

router.post("/:postid", getMatches);

export default router;