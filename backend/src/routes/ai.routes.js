import express from "express";
import {
  chatController,
  summarizeController,
  quizController,
  modelsController,
} from "../controllers/ai.Controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", authMiddleware, chatController);
router.post("/summarize", authMiddleware, summarizeController);
router.post("/quiz", authMiddleware, quizController);
router.get("/models", modelsController);

export default router;