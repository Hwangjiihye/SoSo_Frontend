import { useState, useCallback } from 'react';
import { getFinanceList, getDailySummary } from '../../../apis/financeApi.js';
import authStore from '../../../store/authStore.js';

/**
 * @file useFinance.js
 * @description 정산 및 영업 일지 비즈니스 로직 훅
 */
export const useFinance = () => {
  const [financeList, setFinanceList] = useState([]);
  const [dailySummary, setDailySummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedStoreSeq } = authStore();

  const fetchFinanceList = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const data = await getFinanceList({ ...params, storeSeq: selectedStoreSeq });
      setFinanceList(data);
    } catch (error) {
      console.error('장부 목록을 불러오는데 실패했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreSeq]);

  const fetchDailySummary = useCallback(async (yearMonth) => {
    setIsLoading(true);
    try {
      const data = await getDailySummary(yearMonth, selectedStoreSeq);
      setDailySummary(data);
    } catch (error) {
      console.error('일별 요약을 불러오는데 실패했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreSeq]);

  return {
    financeList,
    dailySummary,
    isLoading,
    fetchFinanceList,
    fetchDailySummary,
  };
};
