import React, { useState, useEffect } from 'react';

/**
 * @file StockIncomingModal.jsx
 * @description 상세 입고 정보를 입력받는 모달 컴포넌트 (유통기한/담당자 필드 제거)
 */
const StockIncomingModal = ({ isOpen, onClose, stock, onIncoming, isLoading }) => {
  const [formData, setFormData] = useState({
    detailStockName: '',
    quantity: '',
    incomingPrice: '',
    memo: ''
  });

  useEffect(() => {
    if (isOpen && stock) {
      setFormData(prev => ({
        ...prev,
        detailStockName: stock.stockName || ''
      }));
    }
  }, [isOpen, stock]);

  if (!isOpen || !stock) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.quantity || !formData.incomingPrice) {
      alert('필수 입력 항목(수량, 단가)을 확인해주세요.');
      return;
    }
    onIncoming(formData);
  };

  const labelStyle = "block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1";
  const inputStyle = "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-black text-gray-900">재고 입고 등록</h2>
            <p className="text-xs text-gray-500 mt-0.5">{stock.stockName} ({stock.category})</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          <div className="bg-emerald-50 rounded-2xl p-4 flex justify-between items-center border border-emerald-100 mb-2">
            <span className="text-sm font-bold text-emerald-700">현재 총 재고</span>
            <span className="text-lg font-black text-emerald-700">
              {stock.currentStock?.toLocaleString()} {stock.unit || '개'}
            </span>
          </div>

          <div>
            <label className={labelStyle}>상세 품목명 <span className="text-rose-500">*</span></label>
            <input 
              name="detailStockName"
              value={formData.detailStockName}
              onChange={handleChange}
              placeholder="예: A유통 국내산 냉동 삼겹살"
              className={inputStyle}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>입고 수량 <span className="text-rose-500">*</span></label>
              <input 
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
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
                value={formData.incomingPrice}
                onChange={handleChange}
                placeholder="0"
                className={inputStyle}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>메모</label>
            <textarea 
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              placeholder="추가 전달 사항 입력"
              rows="3"
              className={`${inputStyle} resize-none`}
            />
          </div>
        </form>

        {/* 푸터 버튼 */}
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all text-sm"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all text-sm disabled:opacity-50"
          >
            {isLoading ? '처리 중...' : '입고 등록 완료'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockIncomingModal;
