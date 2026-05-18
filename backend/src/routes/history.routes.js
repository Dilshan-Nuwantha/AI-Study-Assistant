import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    chatHistoryController,
    summaryHistoryController,
    quizHistoryController,
    deleteChatHistoryController,
    deleteSummaryHistoryController,
    deleteQuizHistoryController,
} from "../controllers/history.controller.js";

const router = express.Router();

router.get("/chat", authMiddleware, chatHistoryController);
router.get("/summaries", authMiddleware, summaryHistoryController);
router.get("/quizzes", authMiddleware, quizHistoryController);
router.delete("/chat/:id", authMiddleware, deleteChatHistoryController);
router.delete("/summaries/:id", authMiddleware, deleteSummaryHistoryController);
router.delete("/quizzes/:id", authMiddleware, deleteQuizHistoryController);

export default router;
