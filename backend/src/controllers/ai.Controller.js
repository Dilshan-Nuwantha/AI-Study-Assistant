import {
  chatService,
  summarizeService,
  quizService,
} from "../services/ai.service.js";

// CHAT
export const chatController = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    const result = await chatService(message);

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SUMMARIZE
export const summarizeController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const result = await summarizeService(text);

    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// QUIZ
export const quizController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const result = await quizService(text);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};