import {
  getGroqApiKey,
  getGroqBaseUrl,
  getGroqModel,
} from "../config/groq.js";
import Chat from "../models/chat.model.js";
import Summary from "../models/summary.model.js";
import Quiz from "../models/quiz.model.js";

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

const buildRateLimitError = (retryAfter) => ({
  status: 429,
  code: "quota_exceeded",
  message: retryAfter
    ? `Rate limit exceeded. Please retry in ${retryAfter} seconds.`
    : "Rate limit exceeded. Please retry shortly.",
  retryAfter,
});

const mapRateLimitError = (status, message, retryAfterHeader) => {
  const retryAfter = retryAfterHeader
    ? Number(retryAfterHeader)
    : parseRetryAfterSeconds(message);

  if (status === 429 || /429|quota\s+exceeded|too\s+many\s+requests/i.test(message)) {
    return buildRateLimitError(Number.isFinite(retryAfter) ? retryAfter : null);
  }

  return null;
};

const mapGroqError = (err) => {
  const status = err?.status || err?.statusCode || err?.response?.status;
  const message = err?.message || String(err);
  const retryAfterHeader = err?.retryAfterHeader;

  return mapRateLimitError(status, message, retryAfterHeader);
};

const readResponseBody = async (response) => {
  try {
    return await response.text();
  } catch (err) {
    return "";
  }
};

const parseGroqContent = (payload) => {
  const message = payload?.choices?.[0]?.message?.content;
  if (typeof message === "string") {
    return message;
  }
  return "";
};

const saveRecord = async (Model, user, request, response) => {
  try {
    await Model.create({
      userId: user.id,
      username: user.username,
      request,
      response,
    });
  } catch (err) {
    console.warn("Failed to save record:", err?.message || err);
  }
};

const groqGenerate = async (prompt) => {
  const apiKey = getGroqApiKey();
  const baseUrl = getGroqBaseUrl();
  const model = getGroqModel();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const bodyText = await readResponseBody(response);
    const error = new Error(
      bodyText || `Groq request failed: ${response.status} ${response.statusText}`
    );
    error.status = response.status;
    error.retryAfterHeader = response.headers.get("Retry-After");
    throw error;
  }

  const payload = await response.json();
  return parseGroqContent(payload);
};

export const chatService = async (message, user) => {
  const prompt = `Answer the user's question clearly and concisely.\nUser: ${message}`;
  try {
    const response = await groqGenerate(prompt);
    await saveRecord(Chat, user, message, response);
    return response;
  } catch (err) {
    const mapped = mapGroqError(err);
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

export const summarizeService = async (text, user) => {
  const prompt = `Summarize the following text in 3-5 sentences:\n${text}`;
  try {
    const summary = await groqGenerate(prompt);
    const trimmedSummary = summary.trim();
    await saveRecord(Summary, user, text, trimmedSummary);
    return { summary: trimmedSummary };
  } catch (err) {
    const mapped = mapGroqError(err);
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

export const quizService = async (text, user) => {
  const prompt = `Create 5 quiz questions with short answers based on this text. Return JSON with "questions":[{"question":"...","answer":"..."}].\nText:\n${text}`;
  let rawText = "";
  try {
    rawText = await groqGenerate(prompt);
  } catch (err) {
    const mapped = mapGroqError(err);
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
    const response = { questions: parsed.questions };
    await saveRecord(Quiz, user, text, response);
    return response;
  }

  const fallback = {
    questions: [
      {
        question: "What is the main idea?",
        answer: "Could not parse AI output",
      },
    ],
  };
  await saveRecord(Quiz, user, text, fallback);
  return fallback;
};

export const listModelsService = async () => {
  const apiKey = getGroqApiKey();
  const baseUrl = getGroqBaseUrl();
  const response = await fetch(`${baseUrl}/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Model list failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  const models = Array.isArray(data?.data) ? data.data : data?.models || [];

  return models.map((model) => ({
    name: model.id || model.name,
    supportedGenerationMethods: model.supportedGenerationMethods || ["chat"],
  }));
};