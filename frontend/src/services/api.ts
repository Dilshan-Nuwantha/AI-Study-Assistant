import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

const getStoredToken = () => {
  return localStorage.getItem("auth_token");
};

API.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

type AuthResponse = {
  token: string;
  user: { id: string; username: string; email: string };
};

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  return API.post<AuthResponse>("/auth/register", data);
};

export const loginUser = async (data: { identifier: string; password: string }) => {
  return API.post<AuthResponse>("/auth/login", data);
};

export const logoutUser = async () => {
  return API.post("/auth/logout");
};

export const getProfile = async () => {
  return API.get<{ user: { id: string; username: string; email: string }; stats: { chats: number; summaries: number; quizzes: number } }>(
    "/auth/me"
  );
};

export const getChatHistory = async (limit = 10, query = "") => {
  return API.get<{ items: Array<{ _id: string; request: string; response: string; createdAt: string }> }>(
    "/history/chat",
    { params: { limit, q: query || undefined } }
  );
};

export const getSummaryHistory = async (limit = 10, query = "") => {
  return API.get<{ items: Array<{ _id: string; request: string; response: string; createdAt: string }> }>(
    "/history/summaries",
    { params: { limit, q: query || undefined } }
  );
};

export const getQuizHistory = async (limit = 10, query = "") => {
  return API.get<{ items: Array<{ _id: string; request: string; response: { questions?: Array<{ question: string; answer: string }> }; createdAt: string }> }>(
    "/history/quizzes",
    { params: { limit, q: query || undefined } }
  );
};

export const deleteChatHistory = async (id: string) => {
  return API.delete(`/history/chat/${id}`);
};

export const deleteSummaryHistory = async (id: string) => {
  return API.delete(`/history/summaries/${id}`);
};

export const deleteQuizHistory = async (id: string) => {
  return API.delete(`/history/quizzes/${id}`);
};

export const setAuthState = (token: string, user: { id: string; username: string; email: string }) => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
};

export const clearAuthState = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};

export const getStoredUser = () => {
  const raw = localStorage.getItem("auth_user");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as { id: string; username: string; email: string };
  } catch (err) {
    return null;
  }
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