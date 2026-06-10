import React from 'react';

/**
 * @file StockActionBar.jsx
 * @description 테이블 항목 선택 시 하단에 표시되는 액션 바 컴포넌트
 */
const StockActionBar = ({ selectedCount, onCancel, onDelete }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white px-7 py-4 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-10 border border-gray-200">
        
        {/* 선택 정보 섹션 */}
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-[12px] font-black text-emerald-600 leading-none">
              {selectedCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-900 tracking-tight">항목 선택됨</span>
          </div>
        </div>
        
        {/* 구분선 */}
        <div className="h-6 w-px bg-gray-200" />
        
        {/* 액션 버튼 섹션 */}
        <div className="flex items-center gap-5">
          <button
            onClick={onCancel}
            className="px-2 py-1 text-[13px] font-bold text-gray-500 hover:text-gray-800 transition-colors"
          >
            선택 해제
          </button>
          
          <button
            onClick={onDelete}
            className="px-6 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition-colors flex items-center gap-2"
          >
            <svg 
              className="w-3.5 h-3.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-[13px] font-bold tracking-tight">선택 삭제</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockActionBar;
