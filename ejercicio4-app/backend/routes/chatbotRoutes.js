import express from "express";
import { responderChatbot } from "../controllers/chatbotController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();
router.post("/", optionalAuth, responderChatbot);

export default router;
