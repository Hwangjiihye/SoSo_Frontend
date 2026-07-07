import axiosInstance from "./axiosConfig";

export const askRag = async ({ message, storeSeq }) => {
  const response = await axiosInstance.get("/ai/chat", {
    params: {
      message,
      storeSeq,
      userSeq,
      userType
    },
  });

  return response.data.answer;
};