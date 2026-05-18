import { getGeminiApiKey, getGeminiModel } from "../config/gemini.js";

const extractJson = (rawText) => {
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch (err) {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerErr) {
        return null;
      }
    }
    return null;
  }
};

const parseRetryAfterSeconds = (message) => {
  if (!message || typeof message !== "string") {
    return null;
  }

  const match = message.match(/retry\s+(?:in|after)\s+([\d.]+)s/i);
  if (match?.[1]) {
    const seconds = Number(match[1]);
    return Number.isFinite(seconds) ? Math.ceil(seconds) : null;
  }

  const retryInfoMatch = message.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
  if (retryInfoMatch?.[1]) {
    const seconds = Number(retryInfoMatch[1]);
    return Number.isFinite(seconds) ? seconds : null;
  }

  return null;
};

const mapGeminiError = (err) => {
  const status = err?.status || err?.statusCode || err?.response?.status;
  const message = err?.message || String(err);

  if (status === 429 || /429|quota\s+exceeded|too\s+many\s+requests/i.test(message)) {
    const retryAfter = parseRetryAfterSeconds(message);

    return {
      status: 429,
      code: "quota_exceeded",
      message: retryAfter
        ? `Rate limit exceeded. Please retry in ${retryAfter} seconds.`
        : "Rate limit exceeded. Please retry shortly.",
      retryAfter,
    };
  }

  return null;
};

export const chatService = async (message) => {
  const prompt = `Answer the user's question clearly and concisely.\nUser: ${message}`;
  const model = getGeminiModel();
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    const mapped = mapGeminiError(err);
    if (mapped) {
      const error = new Error(mapped.message);
      error.status = mapped.status;
      error.code = mapped.code;
      error.retryAfter = mapped.retryAfter;
      throw error;
    }
    throw err;
  }
};

export const summarizeService = async (text) => {
  const prompt = `Summarize the following text in 3-5 sentences:\n${text}`;
  const model = getGeminiModel();
  try {
    const result = await model.generateContent(prompt);
    return { summary: result.response.text().trim() };
  } catch (err) {
    const mapped = mapGeminiError(err);
    if (mapped) {
      const error = new Error(mapped.message);
      error.status = mapped.status;
      error.code = mapped.code;
      error.retryAfter = mapped.retryAfter;
      throw error;
    }
    throw err;
  }
};

export const quizService = async (text) => {
  const prompt = `Create 5 quiz questions with short answers based on this text. Return JSON with "questions":[{"question":"...","answer":"..."}].\nText:\n${text}`;
  const model = getGeminiModel();
  let rawText = "";
  try {
    const result = await model.generateContent(prompt);
    rawText = result.response.text();
  } catch (err) {
    const mapped = mapGeminiError(err);
    if (mapped) {
      const error = new Error(mapped.message);
      error.status = mapped.status;
      error.code = mapped.code;
      error.retryAfter = mapped.retryAfter;
      throw error;
    }
    throw err;
  }

  const parsed = extractJson(rawText);

  if (parsed && Array.isArray(parsed.questions)) {
    return { questions: parsed.questions };
  }

  return {
    questions: [
      {
        question: "What is the main idea?",
        answer: "Could not parse AI output",
      },
    ],
  };
};

export const listModelsService = async () => {
  const apiKey = getGeminiApiKey();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Model list failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  const models = Array.isArray(data?.models) ? data.models : [];

  return models.map((model) => ({
    name: model.name,
    supportedGenerationMethods: model.supportedGenerationMethods || [],
  }));
};