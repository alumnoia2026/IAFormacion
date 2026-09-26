import express from "express";
import { responderChat } from "../controllers/chatController.js";

const router = express.Router();
router.post("/", responderChat);

export default router;
