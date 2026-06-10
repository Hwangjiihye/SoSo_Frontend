import React from 'react';

/**
 * @file StockHistoryModal.jsx
 * @description 재고 변동 이력을 보여주는 모달 컴포넌트 (a5.png 기반)
 */
const StockHistoryModal = ({ isOpen, onClose, stockName, historyData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">재고 변동 이력</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">{stockName}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* 컨텐츠 (테이블) */}
        <div className="p-0 max-h-[60vh] overflow-y-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">일시</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-center">구분</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-right">변동수량</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-right">최종재고</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">사유/담당자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historyData && historyData.length > 0 ? (
                historyData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-900 font-medium">{item.date}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{item.time}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.type === '입고' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : item.type === '출고'
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-bold text-right ${
                      item.changeQuantity > 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {item.changeQuantity > 0 ? `+${item.changeQuantity}` : item.changeQuantity}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-900 text-right">
                      {item.finalStock.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">{item.reason}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{item.user}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm">
                    변동 이력이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockHistoryModal;
