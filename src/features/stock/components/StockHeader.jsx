import React from 'react';

/**
 * @file StockHeader.jsx
 * @description 재고 관리 페이지 헤더 컴포넌트
 */
const StockHeader = ({ onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">재고 관리</h1>
        <p className="text-[15px] text-gray-400 mt-2 font-medium">실시간 재고 현황을 파악하고 스마트하게 관리하세요.</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onAddClick}
          className="group relative flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] text-sm font-black hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200 hover:shadow-emerald-200 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10">+ 새 품목 등록</span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
};

export default StockHeader;
