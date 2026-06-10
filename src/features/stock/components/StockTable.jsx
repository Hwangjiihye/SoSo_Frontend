import React from 'react';

/**
 * @file StockTable.jsx
 * @description 재고 현황을 보여주는 테이블 컴포넌트
 */
const StockTable = ({ stocks, isLoading, selectedIds, onSelectChange, onSelectAll, onViewHistory, onIncoming }) => {
  // 날짜 차이 계산 함수 (D-Day 형식)
  const getRemainingDays = (expiryDate) => {
    if (!expiryDate || expiryDate === '-') return '-';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(expiryDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `만료 (${Math.abs(diffDays)}일 경과)`;
    if (diffDays === 0) return '오늘 만료';
    return `${diffDays}일`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'NORMAL':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'LACK':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'OUT_OF_STOCK':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'NORMAL': return '정상';
      case 'LACK': return '재고부족';
      case 'OUT_OF_STOCK': return '품절';
      default: return '미상';
    }
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
              <th className="px-6 py-4 w-10">
                <input 
                  type="checkbox" 
                  checked={stocks.length > 0 && selectedIds.length === stocks.length}
                  onChange={onSelectAll}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">품목명</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">카테고리</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">현재 수량</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">단위</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">안전재고</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">소비기한</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">재고상태</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">입/출고</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">이력/상세</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <tr key={stock.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(stock.id) ? 'bg-emerald-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(stock.id)}
                      onChange={() => onSelectChange(stock.id)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{stock.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{stock.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    {stock.currentStock.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{stock.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">{stock.safetyStock.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${
                      getRemainingDays(stock.expiryDate).includes('만료') 
                      ? 'text-rose-600 animate-pulse' 
                      : getRemainingDays(stock.expiryDate).includes('오늘')
                      ? 'text-amber-600'
                      : 'text-gray-600'
                    }`}>
                      {getRemainingDays(stock.expiryDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(stock.status)}`}>
                      {getStatusLabel(stock.status)}
                    </span>
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
                    <button className="text-gray-400 hover:text-emerald-600 text-sm font-bold transition-colors">
                      수정
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-20 text-center">
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
