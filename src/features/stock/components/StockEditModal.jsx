import React, { useState, useEffect } from 'react';
import { getCategories } from '../../../apis/stockApi';

/**
 * @file StockEditModal.jsx
 * @description 재고 정보를 수정하는 모달 컴포넌트 (MySQL 스키마 반영)
 */
const StockEditModal = ({ isOpen, onClose, stock, onEdit }) => {
  const initialFormState = {
    stockName: '',
    category: '',
    unit: '',
    safetyStock: '',
    defaultExpiryDays: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState([]);

  // 모달 상태에 따른 데이터 관리
  useEffect(() => {
    if (isOpen && stock) {
      // 카테고리 목록 가져오기
      getCategories().then(response => {
        setCategories(response);
      }).catch(err => console.error('카테고리 로드 실패:', err));

      setFormData({
        stockName: stock.stockName || '',
        category: stock.categorySeq || '', // 시퀀스 번호 기반으로 변경
        unit: stock.unit || '',
        safetyStock: stock.safetyStock || 0,
        defaultExpiryDays: stock.defaultExpiryDays || 0,
      });
    } else if (!isOpen) {
      setFormData(initialFormState);
    }
  }, [isOpen, stock]);

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

  const labelStyle = "block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1";
  const inputStyle = "w-full h-12 px-5 bg-gray-50 border-2 border-transparent rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all placeholder:text-gray-300";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border border-white/20">
        {/* 헤더 */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div>
            
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">품목 정보 수정</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-5">
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
                <option value="">선택하세요</option>
                {categories.map((cat) => (
                  <option key={cat.categorySeq} value={cat.categorySeq}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyle}>관리 단위 <span className="text-rose-500">*</span></label>
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
              <label className={labelStyle}>안전 재고 수량</label>
              <input
                type="number"
                name="safetyStock"
                value={formData.safetyStock}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>기본 소비기한</label>
              <div className="relative">
                <input
                  type="number"
                  name="defaultExpiryDays"
                  value={formData.defaultExpiryDays}
                  onChange={handleChange}
                  className={`${inputStyle} pr-12`}
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">DAYS</span>
              </div>
            </div>
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
              className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-black rounded-2xl transition-all shadow-xl shadow-emerald-100 active:scale-95"
            >
              정보 수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockEditModal;
