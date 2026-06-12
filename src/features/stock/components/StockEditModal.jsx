import React, { useState, useEffect } from 'react';

/**
 * @file StockEditModal.jsx
 * @description 재고 정보를 수정하는 모달 컴포넌트 (MySQL 스키마 반영)
 */
const StockEditModal = ({ isOpen, onClose, stock, onEdit }) => {
  const [formData, setFormData] = useState({
    stockName: '',
    category: '',
    unit: '',
    safetyStock: '',
    defaultExpiryDays: '',
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        stockName: stock.stockName || '',
        category: stock.category || '',
        unit: stock.unit || '',
        safetyStock: stock.safetyStock || 0,
        defaultExpiryDays: stock.defaultExpiryDays || 0,
      });
    }
  }, [stock]);

  if (!isOpen || !stock) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // stock.stockSeq를 식별자로 사용하여 수정 요청
    onEdit(stock.stockSeq, formData);
    onClose();
  };

  const labelStyle = "block text-xs font-bold text-gray-500 mb-1.5 ml-1";
  const inputStyle = "w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">품목 정보 수정</h3>
            <p className="text-xs text-gray-400 mt-0.5">#{stock.stockSeq} 항목을 수정합니다.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelStyle}>품목명 <span className="text-rose-500">*</span></label>
            <input 
              type="text" 
              name="stockName" 
              value={formData.stockName} 
              onChange={handleChange} 
              className={inputStyle} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>카테고리 <span className="text-rose-500">*</span></label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className={inputStyle} 
                required
              >
                <option value="육류">육류</option>
                <option value="채소">채소</option>
                <option value="소스/오일">소스/오일</option>
                <option value="가공식품">가공식품</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>단위 <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="unit" 
                value={formData.unit} 
                onChange={handleChange} 
                className={inputStyle} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>안전재고수량</label>
              <input 
                type="number" 
                name="safetyStock" 
                value={formData.safetyStock} 
                onChange={handleChange} 
                className={inputStyle} 
              />
            </div>
            <div>
              <label className={labelStyle}>기본 소비기한 일수</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="defaultExpiryDays" 
                  value={formData.defaultExpiryDays} 
                  onChange={handleChange} 
                  className={`${inputStyle} pr-10`} 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">일</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-colors"
            >
              취소
            </button>
            <button 
              type="submit" 
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-emerald-600/20"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockEditModal;
