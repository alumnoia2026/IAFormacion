import express from "express";
import { responderChatbot } from "../controllers/chatbotController.js";

const router = express.Router();
router.post("/", responderChatbot);

export default router;
