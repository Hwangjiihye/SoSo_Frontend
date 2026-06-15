import React, { useState, useEffect } from 'react';

/**
 * @file StockHistoryModal.jsx
 * @description 재고 상세 보유 현황 및 변동 이력을 보여주는 모달 컴포넌트 (b5.png 반영)
 */
const StockHistoryModal = ({ isOpen, onClose, stock, fetchDetailData }) => {
  const [data, setData] = useState({ batches: [], histories: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && stock?.stockSeq) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const result = await fetchDetailData(stock.stockSeq);
          setData(result);
        } catch (error) {
          alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, stock, fetchDetailData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh] border border-white/20">
        {/* 헤더 */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-50">
          <div>
            <div className="flex items-center gap-2 mb-2">
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">재고 상세 및 변동 이력</h3>
            <p className="text-[15px] text-gray-400 font-medium mt-1">
             <span className="text-emerald-600 font-black">{stock.stockName}</span> 품목의 실시간 보유 현황과 모든 변동 내역입니다.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-8 space-y-12 scrollbar-hide">
          {/* 상단 - 현재 보유 중인 상세 재고 리스트 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl">📦</div>
              <h4 className="text-xl font-black text-gray-900 tracking-tight">현재 보유 재고</h4>
            </div>
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">입고일</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">상세 품목명</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">남은 수량</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">입고 단가</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">유통기한</th>
                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">로트번호</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">데이터를 불러오는 중...</td></tr>
                  ) : data.batches.length > 0 ? (
                    data.batches.map((batch, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500 text-center font-medium">{batch.incomingDate}</td>
                        <td className="px-6 py-4 text-[15px] font-black text-gray-900 text-center">{batch.detailStockName}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-[16px] font-black text-emerald-600">{batch.currentQuantity.toLocaleString()}</span>
                          <span className="text-[11px] text-gray-400 ml-1 font-bold">{stock.unit || 'EA'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center font-bold">{batch.incomingPrice.toLocaleString()}원</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[12px] font-black rounded-lg border border-rose-100 italic">
                            {batch.expirationDate}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[11px] font-mono text-gray-300 text-center uppercase tracking-tighter">{batch.lotNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="px-6 py-20 text-center">
                      <div className="text-4xl mb-4 opacity-20">📦</div>
                      <p className="text-gray-400 font-medium">보유 중인 상세 재고가 없습니다.</p>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 하단 - 최근 재고 변동 타임라인 이력 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">📊</div>
              <h4 className="text-xl font-black text-gray-900 tracking-tight">최근 재고 변동 이력</h4>
            </div>
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
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
                    <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-400 font-medium">데이터를 불러오는 중...</td></tr>
                  ) : data.histories.length > 0 ? (
                    data.histories.map((hist, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-[11px] text-gray-400 text-center font-bold uppercase">{hist.createdAt}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            hist.transactionType === 'INCOMING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            hist.transactionType === 'OUTBOUND' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {hist.transactionType === 'INCOMING' ? '입고': 
                            hist.transactionType === 'OUTBOUND' ? '출고': '조정'} 
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center font-bold">{hist.detailStockName || '-'}</td>
                        <td className={`px-6 py-4 text-center font-black ${
                          hist.transactionType === 'INCOMING' ? 'text-blue-600' : 'text-rose-500'
                        }`}>
                          <span className="text-[16px]">{hist.transactionType === 'INCOMING' ? `+${hist.changeQuantity}` : hist.changeQuantity}</span>
                        </td>
                        <td className="px-6 py-4 text-[16px] font-black text-gray-900 text-center">{hist.currentTotalStock.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-center font-medium">{hist.reason || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-center font-medium">{hist.memo || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="px-6 py-20 text-center">
                      <div className="text-4xl mb-4 opacity-20">📊</div>
                      <p className="text-gray-400 font-medium">변동 이력이 존재하지 않습니다.</p>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 푸터 */}
        <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-gray-900 text-white text-[14px] font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            기록 창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockHistoryModal;
