import {
  chatService,
  summarizeService,
  quizService,
  listModelsService,
} from "../services/ai.service.js";

// CHAT
export const chatController = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    const result = await chatService(message, req.user);

    res.json({ result });
  } catch (err) {
    const status = err?.status || 500;
    if (err?.retryAfter) {
      res.set("Retry-After", String(err.retryAfter));
    }
    res.status(status).json({
      error: err?.message || "Unexpected error",
      code: err?.code,
      retryAfter: err?.retryAfter,
    });
  }
};

// SUMMARIZE
export const summarizeController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const result = await summarizeService(text, req.user);

    res.json({ result });
  } catch (err) {
    const status = err?.status || 500;
    if (err?.retryAfter) {
      res.set("Retry-After", String(err.retryAfter));
    }
    res.status(status).json({
      error: err?.message || "Unexpected error",
      code: err?.code,
      retryAfter: err?.retryAfter,
    });
  }
};

// QUIZ
export const quizController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const result = await quizService(text, req.user);

    res.json(result);
  } catch (err) {
    const status = err?.status || 500;
    if (err?.retryAfter) {
      res.set("Retry-After", String(err.retryAfter));
    }
    res.status(status).json({
      error: err?.message || "Unexpected error",
      code: err?.code,
      retryAfter: err?.retryAfter,
    });
  }
};

// MODELS
export const modelsController = async (req, res) => {
  try {
    const models = await listModelsService();
    res.json({ models });
  } catch (err) {
    const status = err?.status || 500;
    if (err?.retryAfter) {
      res.set("Retry-After", String(err.retryAfter));
    }
    res.status(status).json({
      error: err?.message || "Unexpected error",
      code: err?.code,
      retryAfter: err?.retryAfter,
    });
  }
};