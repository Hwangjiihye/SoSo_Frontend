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

// 재고 입고 등록
export const createInboundTransaction = async (data) => {
  const response = await axiosInstance.post('/api/stocks/inbound', data);
  return response.data;
};

// 재고 출고 등록
export const createOutboundTransaction = async (data) => {
  const response = await axiosInstance.post('/api/stocks/outbound', data);
  return response.data;
};

// 재고 조정 등록
export const createAdjustmentTransaction = async (data) => {
  const response = await axiosInstance.post('/api/stocks/adjustment', data);
  return response.data;
};
