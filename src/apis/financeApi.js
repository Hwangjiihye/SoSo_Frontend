import axiosInstance from './axiosConfig.js';

/**
 * @file financeApi.js
 * @description 정산 및 영업 일지 관련 API
 */

// 1. 장부 목록 조회 (필터링 포함)
export const getFinanceList = async (params) => {
  const response = await axiosInstance.get('/api/finance/list', { params });
  return response.data;
};

// 2. 일자별 요약 데이터 조회 (캘린더용)
export const getDailySummary = async (yearMonth, storeSeq) => {
  const response = await axiosInstance.get('/api/finance/daily-summary', {
    params: { yearMonth, storeSeq }
  });
  return response.data;
};
