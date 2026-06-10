import axiosInstance from './axiosConfig';

/**
 * @file stockApi.js
 * @description 재고 관리 관련 API 통신 함수 정의
 */

// 재고 목록 조회
export const getStockList = async (params) => {
  const response = await axiosInstance.get('/api/stocks', { params });
  return response.data;
};

// 재고 상세 조회
export const getStockDetail = async (stockId) => {
  const response = await axiosInstance.get(`/api/stocks/${stockId}`);
  return response.data;
};

// 재고 등록
export const createStock = async (stockData) => {
  const response = await axiosInstance.post('/api/stocks', stockData);
  return response.data;
};

// 재고 수정
export const updateStock = async (stockId, stockData) => {
  const response = await axiosInstance.put(`/api/stocks/${stockId}`, stockData);
  return response.data;
};

// 재고 삭제
export const deleteStock = async (stockId) => {
  const response = await axiosInstance.delete(`/api/stocks/${stockId}`);
  return response.data;
};
