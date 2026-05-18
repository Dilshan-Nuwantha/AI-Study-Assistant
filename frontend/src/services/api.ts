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