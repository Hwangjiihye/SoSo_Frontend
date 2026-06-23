import React from 'react';
import { useStockTransaction } from '../hooks/useStockTransaction';

/**
 * @file StockTransactionModal.jsx
 * @description 재고 입고, 출고, 조정을 통합 처리하는 모달 컴포넌트 (필드 간소화 버전)
 */
const StockTransactionModal = ({ isOpen, onClose, selectedStock, onSuccess }) => {
  const {
    activeTab,
    handleTabChange,
    inboundForm,
    outboundForm,
    adjustmentForm,
    batches,
    handleInboundChange,
    handleOutboundChange,
    handleAdjustmentChange,
    handleSubmit,
    isLoading,
    resetForms,
  } = useStockTransaction(selectedStock, onClose, onSuccess);

  // 모달이 닫힐 때 데이터 초기화
  React.useEffect(() => {
    if (!isOpen) {
      resetForms();
    }
  }, [isOpen]);

  if (!isOpen || !selectedStock) return null;

  const labelStyle = "block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1";
  const inputStyle = "w-full h-12 px-5 bg-gray-50 border-2 border-transparent rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all placeholder:text-gray-300";
  const selectStyle = "w-full h-12 px-5 bg-gray-50 border-2 border-transparent rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all cursor-pointer appearance-none";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border border-white/20">
        {/* 헤더 */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedStock.stockName}</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">품목의 재고 수량을 변경합니다.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* 탭 스위치 */}
        <div className="flex p-1.5 bg-gray-100 mx-8 mt-6 rounded-[1.25rem]">
          {[
            { id: 'INBOUND', label: '📥 입고' },
            { id: 'OUTBOUND', label: '📤 출고' },
            { id: 'ADJUST', label: '⚖️ 조정' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-3 text-[13px] font-black rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 space-y-5">
          {activeTab === 'INBOUND' && (
            <div className="animate-fade-in space-y-5">
              <div>
                <label className={labelStyle}>상세 품목명 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="detailStockName"
                  value={inboundForm.detailStockName}
                  onChange={handleInboundChange}
                  placeholder="예: 국내산 목살 500g"
                  className={inputStyle}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>입고 수량 ({selectedStock.unit}) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={inboundForm.quantity}
                    onChange={handleInboundChange}
                    placeholder="0"
                    className={inputStyle}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className={labelStyle}>입고 단가 (원) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    name="incomingPrice"
                    value={inboundForm.incomingPrice}
                    onChange={handleInboundChange}
                    placeholder="0"
                    className={inputStyle}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OUTBOUND' && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>출고 수량 ({selectedStock.unit}) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={outboundForm.quantity}
                    onChange={handleOutboundChange}
                    placeholder="0"
                    className={inputStyle}
                    min="1"
                    required
                  />
                </div>
                <div className="relative">
                  <label className={labelStyle}>출고 사유 <span className="text-rose-500">*</span></label>
                  <select
                    name="reason"
                    value={outboundForm.reason}
                    onChange={handleOutboundChange}
                    className={selectStyle}
                    required
                  >
                    <option value="주방 소진">🍳 주방 소진</option>
                    <option value="밀키트 제작용">🍱 밀키트 제작</option>
                    <option value="매장 간 이동">🚚 매장 간 이동</option>
                    <option value="기타">ETC 기타</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ADJUST' && (
            <div className="animate-fade-in space-y-5">
              <div>
                <label className={labelStyle}>조정 대상 배치</label>
                <div className="relative">
                  <select
                    name="batchSeq"
                    value={adjustmentForm.batchSeq}
                    onChange={handleAdjustmentChange}
                    className={selectStyle}
                  >
                    <option value="">전체 재고 통합 조정</option>
                    {batches.map(batch => (
                      <option key={batch.batchSeq} value={batch.batchSeq}>
                        {batch.detailStockName} (남은 재고: {batch.currentQuantity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>조정 수량 (+/-) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={adjustmentForm.quantity}
                    onChange={handleAdjustmentChange}
                    placeholder="예: -5, +2"
                    className={inputStyle}
                    required
                  />
                </div>
                <div className="relative">
                  <label className={labelStyle}>조정 사유 <span className="text-rose-500">*</span></label>
                  <select
                    name="reason"
                    value={adjustmentForm.reason}
                    onChange={handleAdjustmentChange}
                    className={selectStyle}
                    required
                  >
                    <option value="파손/분실">💔 파손/분실</option>
                    <option value="유통기한 만료/부패">⏰ 만료/부패</option>
                    <option value="재고 실사 후 수정">📝 실사 결과</option>
                    <option value="기타">ETC 기타</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className={labelStyle}>추가 메모</label>
            <input
              type="text"
              name="memo"
              value={activeTab === 'INBOUND' ? inboundForm.memo : activeTab === 'OUTBOUND' ? outboundForm.memo : adjustmentForm.memo}
              onChange={activeTab === 'INBOUND' ? handleInboundChange : activeTab === 'OUTBOUND' ? handleOutboundChange : handleAdjustmentChange}
              placeholder="특이사항을 입력하세요 (선택)"
              className={inputStyle}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 h-14 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[14px] font-black rounded-2xl transition-all active:scale-95"
            >
              취소
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 h-14 bg-gray-900 hover:bg-emerald-600 text-white text-[14px] font-black rounded-2xl transition-all shadow-xl shadow-gray-100 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '데이터 저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockTransactionModal;
