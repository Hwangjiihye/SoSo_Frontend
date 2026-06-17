import React, { useState, useEffect } from 'react';

/**
 * @file StockFilter.jsx
 * @description 재고 관리 필터 및 검색 컴포넌트
 */
const StockFilter = ({ filters, categories = [], onFilterChange, onSearch }) => {
  // 검색어 로컬 상태 관리 (실시간 API 요청 방지)
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // 외부에서 filters.search가 변경될 경우(예: 초기화) 동기화
  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  const handleSearchTrigger = () => {
    // 실제 검색 시점에만 부모 상태 업데이트
    onFilterChange('search', searchTerm);
    // 조회 함수 호출 (최신 검색어 전달)
    onSearch(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchTrigger();
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 검색어 */}
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder="품목명 또는 코드로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-transparent rounded-[1.25rem] text-[15px] font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale group-focus-within:grayscale-0 transition-all">🔍</span>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4">
          {/* 카테고리 필터 - 동적 렌더링 (이모지 제거) */}
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="h-14 px-6 bg-gray-50 border-2 border-transparent rounded-[1.25rem] text-[14px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all cursor-pointer appearance-none"
          >
            <option value="ALL">전체 카테고리</option>
            {categories.map((cat) => (
              <option key={cat.categorySeq} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          {/* 상태 필터 - 상태 이모지 제거 및 즉시 반영 유지 */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="h-14 px-6 bg-gray-50 border-2 border-transparent rounded-[1.25rem] text-[14px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all cursor-pointer appearance-none"
          >
            <option value="ALL">전체 상태</option>
            <option value="NORMAL">정상 재고</option>
            <option value="LACK">재고 부족</option>
            <option value="OUT_OF_STOCK">품절 항목</option>
            <option value="EXPIRING_SOON">유통기한 임박</option>
          </select>

          {/* 검색 버튼 */}
          <button
            onClick={handleSearchTrigger}
            className="h-14 px-8 bg-emerald-600 text-white font-black rounded-[1.25rem] text-[14px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            조회하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockFilter;
