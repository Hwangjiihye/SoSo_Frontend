import React, { useState, useEffect } from 'react';
import { useStockStatus } from './hooks/useStockStatus';
import { useStockHistory } from './hooks/useStockHistory';
import StockAutoRules from './components/StockAutoRules';
import DashboardTimelineFeed from './components/DashboardTimelineFeed';
import DashboardHistoryTable from './components/DashboardHistoryTable';
import HistoryModal from './components/HistoryModal';
import { Link, useLocation } from 'react-router-dom';

/**
 * @file StockStatusPage.jsx
 * @description 재고 상태 관리 신규 페이지 (stock1.png 기반)
 */
const StockStatusPage = () => {
  const { autoRules, toggleRule } = useStockStatus();
  const { 
    dashboardHistory, 
    isDashboardLoading, 
    fetchDashboardHistory,
    modalHistoryData,
    isModalLoading,
    fetchModalHistory
  } = useStockHistory();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 컴포넌트 마운트 시 대시보드 데이터 로드
  useEffect(() => {
    fetchDashboardHistory();
  }, [fetchDashboardHistory]);

  // 모달 열기/닫기 핸들러
  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchModalHistory(0, 10); // 모달 오픈 시 0페이지(1페이지) 데이터 페치
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 모달 페이지 변경 핸들러
  const handlePageChange = (pageIndex) => {
    fetchModalHistory(pageIndex, 10);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 헤더 섹션 */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">자동 재고 제어 관리</h1>
          <p className="text-[15px] text-gray-400 font-medium">자동 차감, 자동 발주 연동, 실시간 변동 타임라인</p>
        </div>

        {/* 상단 2컬럼 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 자동 재고 관리 규칙 */}
          <section>
            <div className="flex items-center gap-2 mb-4 ml-2">
              <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">자동 재고 관리 규칙</span>
            </div>
            <StockAutoRules rules={autoRules} onToggle={toggleRule} />
          </section>

          {/* 재고 타임라인 피드 */}
          <section>
            <div className="flex items-center gap-2 mb-4 ml-2">
              <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">재고 타임라인 피드</span>
            </div>
            <DashboardTimelineFeed 
              history={dashboardHistory} 
              isLoading={isDashboardLoading} 
              onOpenModal={handleOpenModal} 
            />
          </section>
        </div>

        {/* 최근 자동 처리 이력 - 하단 와이드 섹션 */}
        <section>
          <div className="flex items-center gap-2 mb-4 ml-2">
            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">최근 재고 이력</span>
          </div>
          <DashboardHistoryTable 
            history={dashboardHistory} 
            isLoading={isDashboardLoading} 
          />
        </section>
      </div>

      {/* 전체 이력 팝업 모달 */}
      <HistoryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        data={modalHistoryData} 
        isLoading={isModalLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StockStatusPage;
