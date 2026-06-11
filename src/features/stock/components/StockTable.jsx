import React from 'react';

/**
 * @file StockTable.jsx
 * @description 재고 현황을 보여주는 테이블 컴포넌트
 */
const StockTable = ({ stocks, isLoading, selectedIds, onSelectChange, onSelectAll, onViewHistory, onIncoming, onEdit }) => {
  // 소비기한 D-Day 텍스트 반환 및 스타일링 (요구사항 반영)
  const getExpiryDisplay = (days) => {
    if (days === null || days === undefined) return '-';
    if (days <= 0) return <span className="text-rose-600 font-black animate-pulse">기간 만료</span>;
    if (days <= 7) return <span className="text-rose-500 font-bold underline decoration-rose-200 decoration-2 underline-offset-4">D-{days} (임박)</span>;
    return <span className="text-gray-600">{days}일</span>;
  };

  const getStatusBadge = (currentQuantity, safetyStock, expirationDays) => {
    // 1. 품절 (currentQuantity == 0)
    if (currentQuantity === 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-red-50 text-red-600 border-red-100">
          품절
        </span>
      );
    }

    // 2. 재고부족 (0 < currentQuantity <= safetyStock)
    const isLowStock = currentQuantity > 0 && currentQuantity <= safetyStock;
    // 3. 기한임박 (expirationDays <= 7)
    const isNearExpiry = expirationDays !== null && expirationDays <= 7;

    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {isLowStock && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-600 border-amber-100">
            재고부족
          </span>
        )}
        {isNearExpiry && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-600 border-rose-100">
            기한임박
          </span>
        )}
        {!isLowStock && !isNearExpiry && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
            정상
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-gray-500 text-sm font-medium">재고 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 w-10 text-center">
                <input 
                  type="checkbox" 
                  checked={stocks.length > 0 && selectedIds.length === stocks.length}
                  onChange={onSelectAll}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">품목번호</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">품목명</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">카테고리</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">현재 수량</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">안전재고</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">소비기한</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">상태</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">입/출고</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">이력/상세</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {console.log(stocks)}
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                
                <tr key={stock.productCode} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(stock.productCode) ? 'bg-emerald-50/30' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(stock.productCode)}
                      onChange={() => onSelectChange(stock.productCode)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">#{stock.productCode}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{stock.stockName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">{stock.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-center">
                    {stock.currentStock}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">{stock.safetyStock}</td>
                  <td className="px-6 py-4 text-center text-sm">
                    {getExpiryDisplay(stock.defaultExpiryDays)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(stock.currentQuantity, stock.safetyStock, stock.expirationDays)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onIncoming(stock)}
                      className="text-[11px] font-bold text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-200 px-3 py-1 rounded-md transition-all shadow-sm"
                    >
                      입/출고
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onViewHistory(stock)}
                      className="text-[11px] font-bold text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded-md transition-colors"
                    >
                      보기
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onEdit(stock)}
                      className="text-[11px] font-bold text-gray-500 hover:text-emerald-600 border border-gray-200 hover:border-emerald-200 px-3 py-1 rounded-md transition-all"
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="px-6 py-20 text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-gray-500 font-medium">등록된 재고가 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
