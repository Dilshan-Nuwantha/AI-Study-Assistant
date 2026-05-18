import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiApiKey = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY in environment");
    }

    return apiKey;
};

export const getGeminiClient = () => {
    const apiKey = getGeminiApiKey();
    return new GoogleGenerativeAI(apiKey);
};

export const getGeminiModel = () => {
    const genAI = getGeminiClient();
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

    return genAI.getGenerativeModel({ model: modelName });
};