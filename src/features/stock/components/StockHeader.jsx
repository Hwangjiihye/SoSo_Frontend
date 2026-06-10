import React from 'react';

/**
 * @file StockHeader.jsx
 * @description 재고 관리 페이지 헤더 컴포넌트
 */
const StockHeader = ({ onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">재고 관리</h1>
        <p className="text-sm text-gray-500 mt-1">실시간 재고 현황을 파악하고 관리합니다.</p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onAddClick}
          className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          + 재고 등록
        </button>
      </div>
    </div>
  );
};

export default StockHeader;
