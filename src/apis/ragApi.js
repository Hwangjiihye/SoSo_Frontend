import axios from "axios";
import axiosInstance from "./axiosConfig";

const AI_API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000";

export const askRag = async ({message, storeSeq, userSeq, userType}) => {
  const response = await axiosInstance.get(`/ai/chat`, {
    params: {
      message,
      storeSeq,
      userSeq,
      userType,
    },
  });

  return response.data;
};