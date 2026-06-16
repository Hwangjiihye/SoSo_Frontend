import { useState, useCallback } from 'react';
import { getStockHistoryDashboard, getStockHistoryModal } from '../../../apis/stockApi';

/**
 * @file useStockHistory.js
 * @description 재고 이력 대시보드 및 모달 전용 비즈니스 로직 훅
 */
export const useStockHistory = () => {
  // 대시보드 (최근 5건)
  const [dashboardHistory, setDashboardHistory] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  // 모달 (페이징 데이터) - 백엔드에서 주는 Key 이름에 정확히 맞춤!
  const [modalHistoryData, setModalHistoryData] = useState({
    historyList: [],   // 기존 content -> historyList 로 변경
    totalPages: 0,
    totalCount: 0,     // 기존 totalElements -> totalCount 로 변경
    currentPage: 1,    // 🚨 0이 아니라 1로 변경! (이게 0 에러의 핵심 원인)
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
  const fetchModalHistory = useCallback(async (page = 1, size = 10) => {
    setIsModalLoading(true);
    const safePage = Math.max(1, page);
    try {
      const data = await getStockHistoryModal(safePage, size);
      console.log(data)
      
      // 백엔드 응답(data)이 없으면 안전하게 초기값(1페이지) 세팅
      setModalHistoryData(data || { 
        historyList: [], 
        totalPages: 0, 
        totalCount: 0, 
        currentPage: 1 
      });
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