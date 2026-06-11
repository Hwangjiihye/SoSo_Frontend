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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">재고 상세 및 변동 이력</h3>
            <p className="text-sm text-emerald-600 font-medium mt-0.5">
              [{stock.stockSeq}] {stock.stockName} ({stock.category})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* 상단 - 현재 보유 중인 상세 재고 리스트 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
              <h4 className="font-bold text-gray-900">현재 보유 재고 (배치 리스트)</h4>
            </div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">입고일</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">상세 품목명</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">남은 수량</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">입고 단가</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">유통기한</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">로트번호</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">데이터를 불러오는 중...</td></tr>
                  ) : data.batches.length > 0 ? (
                    data.batches.map((batch, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm text-gray-600">{batch.incomingDate}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{batch.detailStockName}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">{batch.quantity.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right">{batch.incomingPrice.toLocaleString()}원</td>
                        <td className="px-6 py-4 text-sm font-bold text-rose-500 text-center">{batch.expirationDate}</td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-400 text-center">{batch.lotNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">보유 중인 재고가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 하단 - 최근 재고 변동 타임라인 이력 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
              <h4 className="font-bold text-gray-900">최근 재고 변동 이력</h4>
            </div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">일시</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">구분</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">상세 품목명</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">변동수량</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">최종재고</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">단가</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">유통기한</th>
                    <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">사유</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr><td colSpan="8" className="px-6 py-10 text-center text-gray-400">데이터를 불러오는 중...</td></tr>
                  ) : data.histories.length > 0 ? (
                    data.histories.map((hist, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-xs text-gray-500">{hist.createdAt}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            hist.transactionType === 'INCOMING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            hist.transactionType === 'OUTBOUND' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {hist.transactionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{hist.detailStockName || '-'}</td>
                        <td className={`px-6 py-4 text-sm font-bold text-right ${
                          hist.transactionType === 'INCOMING' ? 'text-blue-600' : 'text-rose-500'
                        }`}>
                          {hist.transactionType === 'INCOMING' ? `+${hist.changeQuantity}` : hist.changeQuantity}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{hist.currentTotalStock.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-right">{hist.price > 0 ? `${hist.price.toLocaleString()}원` : '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{hist.expirationDate || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{hist.reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="px-6 py-10 text-center text-gray-400">변동 이력이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockHistoryModal;
