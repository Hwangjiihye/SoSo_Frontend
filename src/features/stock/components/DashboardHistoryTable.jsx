import React from 'react';

/**
 * @file DashboardHistoryTable.jsx
 * @description 대시보드 하단에 표시되는 최근 재고 이력 5건 테이블
 */
const DashboardHistoryTable = ({ history, isLoading }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-gray-50/50 border-b border-gray-100 whitespace-nowrap">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">일시</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">구분</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">품목명</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">변동수량</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">최종재고</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">사유</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">메모</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-400 font-medium">데이터를 불러오는 중...</td>
              </tr>
            ) : history && history.length > 0 ? (
              history.map((hist) => (
                <tr key={hist.historySeq} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-[11px] text-gray-400 text-center font-bold uppercase whitespace-nowrap">
                    {hist.createdAt?.replace('T', ' ')}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      hist.transactionType === 'INCOMING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      hist.transactionType === 'OUTBOUND' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {hist.transactionType === 'INCOMING' ? '입고' : 
                       hist.transactionType === 'OUTBOUND' ? '출고' : '조정'} 
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center font-bold whitespace-nowrap">
                    {hist.detailStockName || '-'}
                  </td>
                  <td className={`px-6 py-4 text-center font-black whitespace-nowrap ${
                    hist.transactionType === 'INCOMING' ? 'text-blue-600' : 
                    hist.transactionType === 'OUTBOUND' ? 'text-rose-500' : 'text-amber-500'
                  }`}>
                    <span className="text-[16px]">
                      {hist.transactionType === 'INCOMING' ? `+${hist.changeQuantity}` : hist.changeQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[16px] font-black text-gray-900 text-center whitespace-nowrap">
                    {hist.currentTotalStock?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center font-medium whitespace-nowrap">
                    {hist.reason || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center font-medium truncate max-w-[150px]" title={hist.memo}>
                    {hist.memo || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <div className="text-4xl mb-4 opacity-20">📊</div>
                  <p className="text-gray-400 font-medium">최근 변동 이력이 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHistoryTable;
