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
    handleInboundChange,
    handleOutboundChange,
    handleAdjustmentChange,
    handleSubmit,
    isLoading,
  } = useStockTransaction(selectedStock, onClose, onSuccess);

  if (!isOpen || !selectedStock) return null;

  const labelStyle = "block text-xs font-bold text-gray-500 mb-1.5 ml-1";
  const inputStyle = "w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all";
  const selectStyle = "w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <span className="text-xs font-bold text-emerald-600 mb-1 block">입/출고</span>
            <h3 className="text-lg font-bold text-gray-900">{selectedStock.stockName}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* 탭 스위치 */}
        <div className="flex p-1 bg-gray-100 mx-6 mt-6 rounded-2xl">
          <button
            onClick={() => handleTabChange('INBOUND')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'INBOUND' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            입고
          </button>
          <button
            onClick={() => handleTabChange('OUTBOUND')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'OUTBOUND' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            출고
          </button>
          <button
            onClick={() => handleTabChange('ADJUST')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'ADJUST' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            재고 조정
          </button>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'INBOUND' && (
            <div className="animate-fade-in">
              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>상세 품목명 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    name="detailStockName"
                    value={inboundForm.detailStockName}
                    onChange={handleInboundChange}
                    placeholder="예: 냉동 삼겹살 A유통 국내산"
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
                <div>
                  <label className={labelStyle}>메모</label>
                  <input
                    type="text"
                    name="memo"
                    value={inboundForm.memo}
                    onChange={handleInboundChange}
                    placeholder="입고 관련 특이사항"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OUTBOUND' && (
            <div className="animate-fade-in">
              <div className="space-y-4">
                <div>
                  <label className={labelStyle}>출고 수량 ({selectedStock.unit}) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={outboundForm.quantity}
                    onChange={handleOutboundChange}
                    placeholder="0"
                    className={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyle}>출고 사유 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select
                      name="reason"
                      value={outboundForm.reason}
                      onChange={handleOutboundChange}
                      className={selectStyle}
                      required
                    >
                      <option value="주방 소진">주방 소진</option>
                      <option value="밀키트 제작용">밀키트 제작용</option>
                      <option value="매장 간 이동">매장 간 이동</option>
                      <option value="기타">기타</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      ▼
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>메모</label>
                  <input
                    type="text"
                    name="memo"
                    value={outboundForm.memo}
                    onChange={handleOutboundChange}
                    placeholder="상세 내역 입력"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ADJUST' && (
            <div className="animate-fade-in">
              <div className="space-y-4">
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
                <div>
                  <label className={labelStyle}>조정 사유 <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select
                      name="reason"
                      value={adjustmentForm.reason}
                      onChange={handleAdjustmentChange}
                      className={selectStyle}
                      required
                    >
                      <option value="파손/분실">파손/분실</option>
                      <option value="유통기한 만료/부패">유통기한 만료/부패</option>
                      <option value="재고 실사 후 수정">재고 실사 후 수정</option>
                      <option value="입력 착오 보정">입력 착오 보정</option>
                      <option value="기타">기타</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      ▼
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>메모</label>
                  <input
                    type="text"
                    name="memo"
                    value={adjustmentForm.memo}
                    onChange={handleAdjustmentChange}
                    placeholder="조정 상세 사유 입력"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-6">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-colors"
            >
              취소
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockTransactionModal;
