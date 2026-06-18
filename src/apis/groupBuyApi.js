import axiosInstance from './axiosConfig.js';

/**
 * @file groupBuyApi.js
 * @description 공동구매 이력 관련 API
 */

// 1. 공동구매 참여 이력 조회
export const getGroupBuyHistory = async (storeSeq) => {
  const response = await axiosInstance.get('/api/group-buy/history', {
    params: { storeSeq }
  });
  return response.data;
};
