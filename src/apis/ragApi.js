// import axiosInstance from "./axiosConfig";

// export const askRag = async ({ message, storeSeq }) => {
//   const response = await axiosInstance.get("/ai/chat", {
//     params: {
//       message,
//       storeSeq,
//       userSeq,
//       userType
//     },
//   });

//   return response.data.answer;
// };

import axiosInstance from "./axiosConfig";

// message, storeSeq뿐만 아니라 userSeq, userType도 같이 받아야 함
export const askRag = async ({ message, storeSeq, userSeq, userType }) => {
  const response = await axiosInstance.get("/ai/chat", {
    params: {
      message,
      storeSeq,
      userSeq,
      userType,
    },
  });

  return response.data.answer;
};