import axios from "axios";

const AI_API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000";

export const askRag = async (question) => {
  const response = await axios.get(`${AI_API_URL}/rag/ask`, {
    params: {
      question,
    },
  });

  return response.data;
};