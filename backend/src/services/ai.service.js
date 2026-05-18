export const chatService = async (message) => {
  return `AI Reply: ${message}`;
};

export const summarizeService = async (text) => {
  return {
    summary: text.slice(0, 120) + "...",
  };
};

export const quizService = async (text) => {
  return {
    questions: [
      {
        question: "What is the main idea?",
        answer: "Based on given text",
      },
      {
        question: "Explain briefly?",
        answer: "Understanding key points",
      },
    ],
  };
};