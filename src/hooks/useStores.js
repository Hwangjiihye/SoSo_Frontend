import { useState, useEffect } from 'react';
import { getAllStoresApi } from '../apis/memberApi';
import authStore from '../store/authStore';

/**
 * @file useStores.js
 * @description 사장님이 소유한 모든 매장 목록을 가져오는 커스텀 훅입니다.
 */
export const useStores = () => {
  const { user_type } = authStore();
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 사업자 회원인 경우에만 매장 목록을 가져옵니다.
    if (user_type === 'BUSINESS') {
      const fetchStores = async () => {
        try {
          setIsLoading(true);
          const data = await getAllStoresApi();
          setStores(data);
        } catch (error) {
          console.error("매장 목록 로드 실패:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStores();
    }
  }, [user_type]);

  return { stores, isLoading };
};