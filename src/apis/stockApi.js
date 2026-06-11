import axiosInstance from './axiosConfig';

/**
 * @file stockApi.js
 * @description 재고 관리 관련 API 통신 함수 정의 (MySQL 스키마 및 REST API 명세 반영)
 */

// 1. 메인 재고 현황 목록 조회
// GET /api/stocks
export const getStockList = async (params) => {
  const response = await axiosInstance.get('/api/stocks', { params });
  return response.data; // Expected: [{ stockSeq, stockName, category, safetyStock, currentStock, expirationDays }, ...]
};

// 2. 품목 마스터 등록 (수량 제외)
// POST /api/stocks
export const createStockMaster = async (stockData) => {
  // stockData: { stockName, category, unit, safetyStock, defaultExpiryDays }
  const response = await axiosInstance.post('/api/stocks', stockData);
  return response.data;
};

// 3. 재고 상세 - 보유 배치 리스트 조회
// GET /api/stocks/{stockSeq}/batches
export const getStockBatches = async (stockSeq) => {
  const response = await axiosInstance.get(`/api/stocks/${stockSeq}/batches`);
  return response.data; // Expected: [{ incomingDate, detailStockName, quantity, incomingPrice, expirationDate, lotNumber }, ...]
};

// 4. 재고 상세 - 변동 이력(타임라인) 조회
// GET /api/stocks/{stockSeq}/histories
export const getStockHistories = async (stockSeq) => {
  const response = await axiosInstance.get(`/api/stocks/${stockSeq}/histories`);
  return response.data; // Expected: [{ createdAt, transactionType, changeQuantity, currentTotalStock, detailStockName, price, expirationDate, reason }, ...]
};

// 5. 입고 등록
// POST /api/stocks/incoming
export const createIncomingStock = async (data) => {
  // data: { stockSeq, detailStockName, quantity, incomingPrice, expirationDate, manager, memo }
  const response = await axiosInstance.post('/api/stocks/incoming', data);
  return response.data;
};

// 6. 출고 등록 (FIFO 자동 차감)
// POST /api/stocks/outbound
export const createOutboundStock = async (data) => {
  // data: { stockSeq, quantity, reason, manager, memo }
  const response = await axiosInstance.post('/api/stocks/outbound', data);
  return response.data;
};

// 7. 재고 조정 등록
// POST /api/stocks/adjust
export const createAdjustStock = async (data) => {
  // data: { stockSeq, batchSeq(optional), quantity, reason, manager, memo }
  const response = await axiosInstance.post('/api/stocks/adjust', data);
  return response.data;
};

// 기존 함수들 유지 (필요 시 수정/삭제 가능하나 안정성을 위해 일단 보존)
export const getStockDetail = async (stockId) => {
  const response = await axiosInstance.get(`/api/stocks/${stockId}`);
  return response.data;
};

export const updateStock = async (stockId, stockData) => {
  const response = await axiosInstance.put(`/api/stocks/${stockId}`, stockData);
  return response.data;
};

export const deleteStock = async (stockId) => {
  const response = await axiosInstance.delete(`/api/stocks/${stockId}`);
  return response.data;
};
