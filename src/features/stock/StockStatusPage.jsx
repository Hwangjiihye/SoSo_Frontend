import React from 'react';
import { useStockStatus } from './hooks/useStockStatus';
import StockAutoRules from './components/StockAutoRules';
import StockTimeline from './components/StockTimeline';
import StockAutoHistory from './components/StockAutoHistory';
import { Link, useLocation } from 'react-router-dom';

/**
 * @file StockStatusPage.jsx
 * @description 재고 상태 관리 신규 페이지 (stock1.png 기반)
 */
const StockStatusPage = () => {
  const { autoRules, timeline, history, toggleRule } = useStockStatus();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 서브 헤더/내비게이션 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 h-20">
            <Link 
              to="/stock" 
              className={`text-[15px] font-black transition-colors ${
                location.pathname === '/stock' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              재고 관리
            </Link>
            <Link 
              to="/stock-status" 
              className={`text-[15px] font-black transition-colors relative h-full flex items-center ${
                location.pathname === '/stock-status' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              자동 재고 제어 관리
              {location.pathname === '/stock-status' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-t-full" />
              )}
            </Link>
          </div>
        </div>
      </div>

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
            <StockTimeline timeline={timeline} />
          </section>
        </div>

        {/* 최근 자동 처리 이력 - 하단 와이드 섹션 */}
        <section>
          <div className="flex items-center gap-2 mb-4 ml-2">
            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">최근 자동 처리 이력</span>
          </div>
          <StockAutoHistory history={history} />
        </section>
      </div>
    </div>
  );
};

export default StockStatusPage;
