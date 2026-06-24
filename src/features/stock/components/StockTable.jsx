import React from 'react';

/**
 * @file StockTable.jsx
 * @description 재고 현황을 보여주는 테이블 컴포넌트
 */
const StockTable = ({ stocks, isLoading, selectedIds, onSelectChange, onSelectAll, onViewHistory, onIncoming, onEdit }) => {
  // 소비기한 D-Day 텍스트 반환 및 스타일링 (요구사항 반영)
  const getExpiryDisplay = (daysUntilExpiry) => {
    if (daysUntilExpiry === null || daysUntilExpiry === undefined) return <span className="text-gray-400">-</span>;
    
    const isNearExpiry = daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
    return (
      <span className={`font-medium ${isNearExpiry ? 'text-[#ff4d4f] font-bold' : 'text-gray-600'}`}>
        {daysUntilExpiry}일
      </span>
    );
  };

  const getStatusBadge = (currentStock, safetyStock, daysUntilExpiry) => {
    // 1. 품절 (currentStock == 0)
    if (currentStock === 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-red-50 text-red-600 border-red-100">
          품절
        </span>
      );
    }

    // 2. 재고부족 (0 < currentStock <= safetyStock)
    const isLowStock = currentStock > 0 && currentStock <= safetyStock;
    // 3. 기한임박 (0 <= daysUntilExpiry <= 7)
    const isNearExpiry = daysUntilExpiry !== null && daysUntilExpiry !== undefined && daysUntilExpiry >= 0 && daysUntilExpiry <= 7;

    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {isLowStock && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-600 border-amber-100">
            재고부족
          </span>
        )}
        {isNearExpiry && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-red-50 text-[#ff4d4f] border-red-100">
            임박
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
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 w-14 text-center">
                <input 
                  type="checkbox" 
                  checked={stocks.length > 0 && selectedIds.length === stocks.length}
                  onChange={onSelectAll}
                  className="w-5 h-5 accent-emerald-600 rounded-lg cursor-pointer transition-all"
                />
              </th>
              <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">Code</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">품목 정보</th>
              <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] text-center">카테고리</th>
              <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] text-center">현재재고</th>
              <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] text-center">안전재고</th>
              <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] text-center">소비기한</th>
              <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] text-center">상태</th>
              <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] text-center">업무</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <tr key={stock.stockSeq} className={`group hover:bg-emerald-50/20 transition-all ${selectedIds.includes(stock.stockSeq) ? 'bg-emerald-50/40' : ''}`}>
                  <td className="px-6 py-5 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(stock.stockSeq)}
                      onChange={() => onSelectChange(stock.stockSeq)}
                      className="w-5 h-5 accent-emerald-600 rounded-lg cursor-pointer transition-all"
                    />
                  </td>
                  <td className="px-4 py-5 text-xs font-bold text-gray-300">#{stock.stockSeq}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-gray-900 group-hover:text-emerald-700 transition-colors">{stock.stockName}</span>
                      <span className="text-[11px] text-gray-400 mt-0.5 font-medium">{stock.unit || 'EA'} 기준</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-lg uppercase tracking-tight">
                      {stock.category}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="text-[16px] font-black text-gray-900 tabular-nums">
                      {stock.currentStock.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center text-[13px] font-bold text-gray-400 tabular-nums">
                    {stock.safetyStock.toLocaleString()}
                  </td>
                  <td className="px-4 py-5 text-center text-[13px] font-bold tabular-nums">
                    {getExpiryDisplay(stock.daysUntilExpiry)}
                  </td>
                  <td className="px-4 py-5 text-center">
                    {getStatusBadge(stock.currentStock, stock.safetyStock, stock.daysUntilExpiry)}
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onIncoming(stock)}
                        className="px-4 py-2 bg-white border-2 border-emerald-100 text-emerald-600 text-[11px] font-black rounded-2xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-95"
                      >
                        입/출고
                      </button>
                      <button 
                        onClick={() => onViewHistory(stock)}
                        className="px-4 py-2 bg-white border-2 border-emerald-100 text-emerald-600 text-[11px] font-black rounded-2xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-95"
                        title="이력 보기"
                      >
                        이력
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => onEdit(stock)}
                      className="px-4 py-2 bg-gray-900 text-white text-[11px] font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-gray-200 active:scale-95"
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
