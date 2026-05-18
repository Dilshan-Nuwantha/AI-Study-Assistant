import { getGeminiModel } from "../config/gemini.js";

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

export const chatService = async (message) => {
  const prompt = `Answer the user's question clearly and concisely.\nUser: ${message}`;
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const summarizeService = async (text) => {
  const prompt = `Summarize the following text in 3-5 sentences:\n${text}`;
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return { summary: result.response.text().trim() };
};

export const quizService = async (text) => {
  const prompt = `Create 5 quiz questions with short answers based on this text. Return JSON with "questions":[{"question":"...","answer":"..."}].\nText:\n${text}`;
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
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