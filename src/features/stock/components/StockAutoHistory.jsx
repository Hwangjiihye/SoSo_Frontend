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
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">품목</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">처리유형</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">변동 수량</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">처리 후 재고</th>
              <th className="px-6 py-4 text-[11px] font-black text-gray-300 uppercase tracking-wider text-center">원인</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((item) => (
              <tr key={item.id} className="group hover:bg-emerald-50/10 transition-colors">
                <td className="px-6 py-5 text-[13px] font-bold text-gray-400 text-center">{item.date}</td>
                <td className="px-6 py-5 text-[14px] font-black text-gray-900 text-center">{item.item}</td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                    item.isNegative 
                      ? 'bg-rose-50 text-rose-500 border-rose-100' 
                      : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className={`px-6 py-5 text-[14px] font-black text-center ${item.isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {item.change}
                </td>
                <td className="px-6 py-5 text-[14px] font-black text-gray-900 text-center">{item.finalStock}</td>
                <td className="px-6 py-5 text-[13px] font-medium text-gray-500 text-center">{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAutoHistory;
