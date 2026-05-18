export const getGroqApiKey = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY in environment");
    }

    return apiKey;
};

export const getGroqBaseUrl = () => {
    return process.env.GROQ_API_BASE || "https://api.groq.com/openai/v1";
};

export const getGroqModel = () => {
    return process.env.GROQ_MODEL || "llama-3.1-8b-instant";
};
