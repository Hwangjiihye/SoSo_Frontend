import React, { useEffect } from 'react';

/**
 * @file HistoryModal.jsx
 * @description 전체 이력을 페이징하여 보여주는 팝업 모달
 */
const HistoryModal = ({ isOpen, onClose, data, isLoading, onPageChange }) => {
  // 모달 오픈 시 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { historyList, totalPages, currentPage } = data;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-md animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-5xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh] border border-white/20">
        
        {/* 헤더 */}
        <div className="px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-between border-b border-gray-50">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">전체 재고 변동 이력</h3>
            <p className="text-[13px] sm:text-[15px] text-gray-400 font-medium mt-1">
              모든 품목의 재고 변동 타임라인 내역입니다.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-[1rem] sm:rounded-[1.25rem] bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
          >
            <span className="text-xl sm:text-2xl">✕</span>
          </button>
        </div>

        {/* 본문 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10 sm:py-8">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-gray-50/50 border-b border-gray-100 whitespace-nowrap">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">일시</th>
                    <th className="px-4 sm:px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">구분</th>
                    <th className="px-4 sm:px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">품목명</th>
                    <th className="px-4 sm:px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">변동수량</th>
                    <th className="px-4 sm:px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">최종재고</th>
                    <th className="px-4 sm:px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">사유</th>
                    <th className="px-4 sm:px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">메모</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-medium">데이터를 불러오는 중...</td>
                    </tr>
                  ) : historyList && historyList.length > 0 ? (
                    historyList.map((hist) => (
                      <tr key={hist.historySeq} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 text-[11px] text-gray-400 text-center font-bold uppercase whitespace-nowrap">
                          {hist.createdAt?.replace('T', ' ')}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            hist.transactionType === 'INCOMING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            hist.transactionType === 'OUTBOUND' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            hist.transactionType === 'ALERT' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {hist.transactionType === 'INCOMING' ? '입고' : 
                             hist.transactionType === 'OUTBOUND' ? '출고' : 
                             hist.transactionType === 'ALERT' ? '알림' : '조정'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[13px] sm:text-sm text-gray-900 text-center font-bold whitespace-nowrap">
                          {hist.detailStockName || '-'}
                        </td>
                        <td className={`px-4 sm:px-6 py-4 text-center font-black whitespace-nowrap ${
                          hist.transactionType === 'INCOMING' ? 'text-blue-600' : 
                          hist.transactionType === 'OUTBOUND' ? 'text-rose-500' : 
                          hist.transactionType === 'ALERT' ? 'text-gray-300' : 'text-amber-500'
                        }`}>
                          <span className="text-[14px] sm:text-[16px]">
                            {hist.transactionType === 'ALERT' ? '-' : (hist.transactionType === 'INCOMING' ? `+${hist.changeQuantity}` : hist.changeQuantity)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[14px] sm:text-[16px] font-black text-gray-900 text-center whitespace-nowrap">
                          {hist.currentTotalStock?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[13px] sm:text-sm text-gray-500 text-center font-medium whitespace-nowrap">
                          {hist.reason || '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-[13px] sm:text-sm text-gray-500 text-center font-medium truncate max-w-[150px]" title={hist.memo}>
                          {hist.memo || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center">
                        <div className="text-4xl mb-4 opacity-20">📂</div>
                        <p className="text-gray-400 font-medium">전체 변동 이력이 없습니다.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

       {/* 푸터 (페이지네이션) */}
        <div className="px-6 py-4 sm:px-10 sm:py-6 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            {[...Array(totalPages || 0)].map((_, i) => {
              const pageNum = i + 1; // 🚨 3. 무조건 1부터 시작하도록 계산!
              return (
                <button
                  key={i}
                  onClick={() => onPageChange(pageNum)} // 🚨 0이 아니라 1, 2, 3을 넘기도록 수정
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-[13px] sm:text-[14px] font-black transition-all ${
                    currentPage === pageNum // 🚨 현재 페이지 비교도 pageNum과 일치하는지 확인
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white text-[14px] font-black rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
