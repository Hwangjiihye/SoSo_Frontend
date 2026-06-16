import React from 'react';

/**
 * @file StockAutoHistory.jsx
 * @description 최근 자동 처리 이력 섹션 (stock4.png 기반)
 */
const StockAutoHistory = ({ history }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">최근 자동 처리 이력</h3>
        <button className="text-[11px] font-bold text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest">
          전체 기록 조회 →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">일시</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">구분</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">품목명</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">변동수량</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">최종재고</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">사유</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">메모</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((hist) => (
              <tr key={hist.id} className="group hover:bg-emerald-50/10 transition-colors">
                <td className="px-6 py-5 text-[11px] font-bold text-gray-400 text-center uppercase tracking-tighter">
                  {hist.createdAt?.replace('T', ' ')}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAutoHistory;
