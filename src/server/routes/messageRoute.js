import express from "express";

const router = express.Router();

import messageController from "../controllers/messageController.js";

router.get("/all", messageController.getAllChats)
router.get("/user/:userID", messageController.getChatByUser)
router.get("/between", messageController.getChatByBothUsers) 
router.post("/new", messageController.createNewChat)
router.get("/:threadID", messageController.getChatByThreadId)
router.post("/:threadID/messages", messageController.saveNewMessage)
router.patch("/:threadID/messages/read", messageController.updateReadStatus)
router.patch("/:threadID/messages/:messageID/received", messageController.updateReceivedStatus)

export default router;