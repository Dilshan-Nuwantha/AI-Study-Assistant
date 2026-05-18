import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

type TextRequest = {
  text: string;
};

type MessageRequest = {
  message: string;
};

export const summarizeNotes = async (data: TextRequest) => {
  return API.post("/summarize", data);
};

export const askAI = async (data: MessageRequest) => {
  return API.post("/chat", data);
};

export const generateQuiz = async (data: TextRequest) => {
  return API.post("/quiz", data);
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.code === "quota_exceeded" && typeof data?.retryAfter === "number") {
      return `${data.error} (Retry in ${data.retryAfter}s)`;
    }
    if (typeof data?.error === "string") {
      return data.error;
    }
    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  return "Request failed. Please try again.";
};