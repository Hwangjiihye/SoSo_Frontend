import { useState, useCallback } from 'react';
import { getGroupBuyHistory } from '../../../apis/groupBuyApi.js';
import authStore from '../../../store/authStore.js';

/**
 * @file useGroupBuyLookup.js
 * @description 공동구매 이력 조회 비즈니스 로직 훅
 */
export const useGroupBuyLookup = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedStoreSeq } = authStore();

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getGroupBuyHistory(selectedStoreSeq);
      setHistory(data);
    } catch (error) {
      console.error('공동구매 이력을 불러오는데 실패했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreSeq]);

  return {
    history,
    isLoading,
    fetchHistory,
  };
};
