import express from "express";
import {
  chatController,
  summarizeController,
  quizController,
  modelsController,
} from "../controllers/ai.Controller.js";

const router = express.Router();

router.post("/chat", chatController);
router.post("/summarize", summarizeController);
router.post("/quiz", quizController);
router.get("/models", modelsController);

export default router;