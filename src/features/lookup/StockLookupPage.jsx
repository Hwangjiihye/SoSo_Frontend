import React, { useState, useEffect } from 'react';
import { useStockLookup } from './hooks/useStockLookup';

/**
 * @file StockLookupPage.jsx
 * @description 재고 변동 이력 조회 페이지 (입출고이력.png 기반)
 */
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-';
  try {
    let isoStr = dateTimeStr.replace(' ', 'T');
    if (!isoStr.endsWith('Z') && !isoStr.includes('+') && !isoStr.includes('-')) {
      isoStr += 'Z';
    }
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) {
      return dateTimeStr.replace('T', ' ');
    }
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  } catch (e) {
    return dateTimeStr.replace('T', ' ');
  }
};

const StockLookupPage = () => {
  const [params, setParams] = useState({
    page: 1,
    size: 10,
    transactionType: 'ALL',
    startDate: '',
    endDate: '',
    keyword: ''
  });

  const { historyData, isLoading, fetchHistory } = useStockLookup();

  useEffect(() => {
    fetchHistory(params);
  }, [fetchHistory, params]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm">📦</span>
            <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest">History</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">재고 변동 이력 조회</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">입고, 출고 및 모든 재고 조정 내역을 통합 조회합니다.</p>
        </div>
      </header>

      {/* 필터 섹션 */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">조회 기간</label>
          <div className="flex items-center gap-3">
            <input 
              type="date" 
              name="startDate"
              value={params.startDate}
              onChange={handleFilterChange}
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 min-w-[130px]"
            />
            <span className="text-gray-300 shrink-0 font-bold">~</span>
            <input 
              type="date" 
              name="endDate"
              value={params.endDate}
              onChange={handleFilterChange}
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 min-w-[130px]"
            />
          </div>
        </div>
        <div className="md:col-span-1">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">변동 구분</label>
          <select 
            name="transactionType"
            value={params.transactionType}
            onChange={handleFilterChange}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="ALL">전체 보기</option>
            <option value="INCOMING">입고 (+)</option>
            <option value="OUTBOUND">출고 (-)</option>
            <option value="ADJUST">재고 조정</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">검색어 (품목명/사유)</label>
          <input 
            type="text" 
            name="keyword"
            placeholder="검색어를 입력하세요..."
            value={params.keyword}
            onChange={handleFilterChange}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 테이블 섹션 */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">일시</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">구분</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">상세 품목명</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">변동 수량</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">최종 재고</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">사유</th>
              <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">메모</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold animate-pulse">데이터를 불러오는 중...</td></tr>
            ) : historyData.historyList?.length > 0 ? (
              historyData.historyList.map((hist) => (
                <tr key={hist.historySeq} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-[11px] font-bold text-gray-400 text-center uppercase tracking-tighter">
                    {formatDateTime(hist.createdAt)}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      hist.transactionType === 'INCOMING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      hist.transactionType === 'OUTBOUND' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {hist.transactionType === 'INCOMING' ? '입고': 
                       hist.transactionType === 'OUTBOUND' ? '출고': '조정'} 
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[14px] font-black text-gray-900 text-center">
                    {hist.detailStockName || '-'}
                  </td>
                  <td className={`px-6 py-5 text-[15px] font-black text-center ${
                    hist.transactionType === 'INCOMING' ? 'text-blue-600' : 'text-rose-500'
                  }`}>
                    {hist.transactionType === 'INCOMING' ? `+${hist.changeQuantity}` : hist.changeQuantity}
                  </td>
                  <td className="px-6 py-5 text-[15px] font-black text-gray-900 text-center">
                    {hist.currentTotalStock.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-[13px] font-medium text-gray-500 text-center">
                    {hist.reason || '-'}
                  </td>
                  <td className="px-6 py-5 text-[13px] font-medium text-gray-400 text-center italic">
                    {hist.memo || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-32 text-center">
                  <div className="text-5xl mb-6 opacity-20">📂</div>
                  <p className="text-gray-400 font-bold">조회된 이력이 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center items-center gap-2">
        <button 
          onClick={() => handlePageChange(params.page - 1)}
          disabled={params.page === 1}
          className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
        >
          ←
        </button>
        {(() => {
          const startPage = Math.floor((params.page - 1) / 10) * 10 + 1;
          const endPage = Math.min(startPage + 9, historyData.totalPages);
          const pageButtons = [];
          for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                  params.page === i 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100'
                }`}
              >
                {i}
              </button>
            );
          }
          return pageButtons;
        })()}
        <button 
          onClick={() => handlePageChange(params.page + 1)}
          disabled={params.page === historyData.totalPages}
          className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default StockLookupPage;
