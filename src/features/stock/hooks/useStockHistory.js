import { useState, useEffect, useCallback } from 'react';
import { getStockHistoryDashboard, getStockHistoryModal } from '../../../apis/stockApi';

/**
 * @file useStockHistory.js
 * @description 재고 이력 대시보드 및 모달 전용 비즈니스 로직 훅
 */
export const useStockHistory = () => {
  // 대시보드 (최근 5건)
  const [dashboardHistory, setDashboardHistory] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // 모달 (페이징 데이터)
  const [modalHistoryData, setModalHistoryData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0, // current page
  });
  const [isModalLoading, setIsModalLoading] = useState(false);

  // 1. 대시보드 데이터 페치
  const fetchDashboardHistory = useCallback(async () => {
    setIsDashboardLoading(true);
    try {
      const data = await getStockHistoryDashboard();
      setDashboardHistory(data || []);
    } catch (error) {
      console.error('대시보드 이력을 불러오는데 실패했습니다.', error);
    } finally {
      setIsDashboardLoading(false);
    }
  }, []);

  // 2. 모달 페이징 데이터 페치
  const fetchModalHistory = useCallback(async (page = 0, size = 10) => {
    setIsModalLoading(true);
    try {
      const data = await getStockHistoryModal(page, size);
      // Spring Data JPA의 Page 객체 형태를 기준으로 상태 업데이트
      setModalHistoryData(data || { content: [], totalPages: 0, totalElements: 0, number: 0 });
    } catch (error) {
      console.error('모달 이력을 불러오는데 실패했습니다.', error);
    } finally {
      setIsModalLoading(false);
    }
  }, []);

  return {
    dashboardHistory,
    isDashboardLoading,
    fetchDashboardHistory,
    modalHistoryData,
    isModalLoading,
    fetchModalHistory,
  };
};
