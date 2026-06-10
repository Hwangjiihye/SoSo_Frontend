import React, { useState } from 'react';

/**
 * @file StockIncomingModal.jsx
 * @description 재고 입고 수량을 입력받는 모달 컴포넌트
 */
const StockIncomingModal = ({ isOpen, onClose, stock, onIncoming }) => {
  const [quantity, setQuantity] = useState('');

  if (!isOpen || !stock) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      alert('올바른 입고 수량을 입력해주세요.');
      return;
    }
    onIncoming(stock.id, quantity);
    setQuantity('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">재고 입고</h2>
              <p className="text-sm text-gray-500 mt-1">{stock.name} 품목의 재고를 추가합니다.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl text-gray-400">&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-emerald-50 rounded-2xl p-4 flex justify-between items-center border border-emerald-100">
              <span className="text-sm font-bold text-emerald-700">현재 재고</span>
              <span className="text-lg font-black text-emerald-700">
                {stock.currentStock.toLocaleString()} {stock.unit}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                입고 수량 ({stock.unit})
              </label>
              <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xl"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-[2] px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
              >
                입고 처리 완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockIncomingModal;
