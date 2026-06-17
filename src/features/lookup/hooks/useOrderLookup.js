import { useState, useCallback } from 'react';
import axiosInstance from '../../../apis/axiosConfig.js';
import authStore from '../../../store/authStore.js';

/**
 * @file useOrderLookup.js
 * @description 발주 이력 조회 비즈니스 로직 훅
 */
export const useOrderLookup = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedStoreSeq } = authStore();

  const fetchOrders = useCallback(async (params) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/order/list', { 
        params: { ...params, storeSeq: selectedStoreSeq } 
      });
      setOrders(response.data);
    } catch (error) {
      console.error('발주 이력을 불러오는데 실패했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreSeq]);

  return {
    orders,
    isLoading,
    fetchOrders,
  };
};
