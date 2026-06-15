import React from 'react';

/**
 * @file StockFilter.jsx
 * @description 재고 관리 필터 및 검색 컴포넌트
 */
const StockFilter = ({ filters, onFilterChange, onSearch }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* 검색어 */}
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="품목명 검색"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        {/* 카테고리 필터 */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors cursor-pointer"
        >
          <option value="ALL">전체 카테고리</option>
          <option value="육류">육류</option>
          <option value="채소">채소</option>
          <option value="소스/오일">소스/오일</option>
          <option value="유제품">유제품</option>
          <option value="냉동식품">냉동식품</option>
        </select>

        {/* 상태 필터 */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors cursor-pointer"
        >
          <option value="ALL">전체 상태</option>
          <option value="NORMAL">정상</option>
          <option value="LACK">재고 부족</option>
          <option value="OUT_OF_STOCK">품절</option>
          <option value="EXPIRING_SOON">유통기한 임박</option>
        </select>

        {/* 검색 버튼 */}
        <button
          onClick={onSearch}
          className="h-11 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-colors"
        >
          조회하기
        </button>
      </div>
    </div>
  );
};

export default StockFilter;
