import React, { useState } from 'react';

/**
 * @file StockRegistrationModal.jsx
 * @description 새로운 재고 품목을 등록하는 모달 컴포넌트 (a6.png 기반)
 */
const StockRegistrationModal = ({ isOpen, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    stockName: '',
    category: '',
    unit: '',
    safetyStock: '',
    defaultExpiryDays: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.stockName || !formData.category || !formData.unit) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    onRegister(formData);
    setFormData({
      stockName: '',
      category: '',
      unit: '',
      safetyStock: '',
      defaultExpiryDays: '',
    });
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
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">New Item</span>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">새 품목 등록</h3>
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
              placeholder="예: 신선한 냉동 삼겹살"
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
                <option value="육류">🍖 육류</option>
                <option value="채소">🥬 채소</option>
                <option value="소스/오일">🍯 소스/오일</option>
                <option value="가공식품">🍱 가공식품</option>
                <option value="유제품">🥛 유제품</option>
                <option value="기타">📦 기타</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>관리 단위 <span className="text-rose-500">*</span></label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="예: kg, 팩, 병"
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
                placeholder="0"
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
                  placeholder="0"
                  className={`${inputStyle} pr-12`}
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">DAYS</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-300 font-medium px-1">
            * 모든 정보는 나중에 상세 페이지에서 수정할 수 있습니다.
          </p>

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
              품목 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockRegistrationModal;
