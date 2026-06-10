import React from 'react';
import { useStock } from './hooks/useStock';
import StockHeader from './components/StockHeader';
import StockFilter from './components/StockFilter';
import StockTable from './components/StockTable';

/**
 * @file StockPage.jsx
 * @description 재고 관리 메인 페이지
 * 와이어프레임(a3.png)을 기반으로 반응형 레이아웃 구현
 */
const StockPage = () => {
  const {
    stocks,
    isLoading,
    filters,
    handleFilterChange,
    handleSearch,
  } = useStock();

  const handleAddStock = () => {
    alert('재고 등록 기능은 준비 중입니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 컨테이너 - 반응형 폭 조절 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 페이지 헤더 */}
        <StockHeader onAddClick={handleAddStock} />

        {/* 요약 카드 섹션 (추가 레이아웃 요소) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-gray-400 uppercase mb-1">전체 품목</div>
            <div className="text-xl font-black text-gray-900">{stocks.length}건</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-amber-500 uppercase mb-1">재고 부족</div>
            <div className="text-xl font-black text-amber-500">
              {stocks.filter(s => s.status === 'LACK').length}건
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-rose-500 uppercase mb-1">품절</div>
            <div className="text-xl font-black text-rose-500">
              {stocks.filter(s => s.status === 'OUT_OF_STOCK').length}건
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-emerald-500 uppercase mb-1">입고 예정</div>
            <div className="text-xl font-black text-emerald-500">
              {stocks.reduce((acc, curr) => acc + (curr.incoming > 0 ? 1 : 0), 0)}건
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <StockFilter 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onSearch={handleSearch} 
        />

        {/* 재고 목록 테이블 */}
        <StockTable stocks={stocks} isLoading={isLoading} />
        
        {/* 모바일 하단 안내 (선택사항) */}
        <div className="mt-4 md:hidden text-center">
          <p className="text-[11px] text-gray-400">좌우로 스크롤하여 상세 정보를 확인할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default StockPage;
