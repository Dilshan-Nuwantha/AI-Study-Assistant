import {
  chatService,
  summarizeService,
  quizService,
} from "../services/ai.service.js";

// CHAT
export const chatController = async (req, res) => {
  try {
    const { message } = req.body;

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

    const result = await quizService(text);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};