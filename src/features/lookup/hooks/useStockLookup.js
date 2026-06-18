import { useState, useCallback } from 'react';
import { getStockHistoryModal } from '../../../apis/stockApi.js';
import authStore from '../../../store/authStore.js';

/**
 * @file useStockLookup.js
 * @description 재고 변동 이력 조회 비즈니스 로직 훅
 */
export const useStockLookup = () => {
  const [historyData, setHistoryData] = useState({
    historyList: [],
    totalPages: 0,
    totalCount: 0,
    currentPage: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const { selectedStoreSeq } = authStore();

  const fetchHistory = useCallback(async (params) => {
    setIsLoading(true);
    try {
      // getStockHistoryModal(page, size, stockSeq, transactionType, startDate, endDate, keyword)
      const data = await getStockHistoryModal(
        params.page || 1,
        params.size || 15,
        selectedStoreSeq, // storeSeq 추가
        params.stockSeq,
        params.transactionType,
        params.startDate,
        params.endDate,
        params.keyword
      );
      setHistoryData(data);
    } catch (error) {
      console.error('재고 이력을 불러오는데 실패했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreSeq]);

  return {
    historyData,
    isLoading,
    fetchHistory,
  };
};
