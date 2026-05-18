import express from "express";
import {
  chatController,
  summarizeController,
  quizController,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", chatController);
router.post("/summarize", summarizeController);
router.post("/quiz", quizController);

export default router;