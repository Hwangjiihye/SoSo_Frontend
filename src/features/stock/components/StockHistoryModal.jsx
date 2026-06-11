import React from 'react';

/**
 * @file StockHistoryModal.jsx
 * @description 재고 변동 이력을 보여주는 모달 컴포넌트 (a5.png 기반)
 */
const StockHistoryModal = ({ isOpen, onClose, stockName, historyData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">이력/상세</h3>
            <p className="text-sm text-emerald-600 font-medium mt-0.5">{stockName}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* 컨텐츠 (테이블) - 메인 테이블과 간격(px-6 py-4) 통일 */}
        <div className="p-0 max-h-[65vh] overflow-y-auto scrollbar-hide">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
              <tr className="bg-gray-50/50">
                <th className="w-[12%] px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">일시</th>
                <th className="w-[8%] px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center tracking-wider">구분</th>
                <th className="w-[20%] px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center tracking-wider">상세 품목명</th>
                <th className="w-[10%] px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right tracking-wider">변동수량</th>
                <th className="w-[10%] px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right tracking-wider">단가</th>
                <th className="w-[12%] px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center tracking-wider">유통기한</th>
                <th className="w-[10%] px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right tracking-wider">최종재고</th>
                <th className="w-[18%] px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historyData && historyData.length > 0 ? (
                historyData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm text-gray-900 font-medium">{item.date}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{item.time}</div>
                    </td>
                    <td className="px-6 py-4 text-center align-top">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        item.type === '입고' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : item.type === '출고'
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm text-gray-900 font-bold break-all leading-tight" title={item.detailName}>
                        {item.detailName || '-'}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right align-top ${
                      item.changeQuantity > 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {item.changeQuantity > 0 ? `+${item.changeQuantity}` : item.changeQuantity}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 text-right align-top">
                      {item.unitPrice ? `${item.unitPrice.toLocaleString()}원` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center align-top">
                      <div className={`text-sm font-bold ${item.expiryDate !== '-' ? 'text-rose-500' : 'text-gray-400'}`}>
                        {item.expiryDate || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right align-top">
                      {item.finalStock.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm text-gray-600 leading-tight line-clamp-2">{item.reason}</div>
                      <div className="text-[11px] text-gray-400 mt-1 font-medium">{item.user}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400 text-sm">
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
