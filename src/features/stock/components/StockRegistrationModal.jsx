import React, { useState } from 'react';

/**
 * @file StockRegistrationModal.jsx
 * @description 새로운 재고 품목을 등록하는 모달 컴포넌트 (a6.png 기반)
 */
const StockRegistrationModal = ({ isOpen, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    productName: '',
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
    if (!formData.productName || !formData.category || !formData.unit) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    onRegister(formData);
    setFormData({
      productName: '',
      category: '',
      unit: '',
      safetyStock: '',
      defaultExpiryDays: '',
    });
    onClose();
  };

  const labelStyle = "block text-xs font-bold text-gray-500 mb-1.5 ml-1";
  const inputStyle = "w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">새 품목 등록</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelStyle}>품목명 <span className="text-rose-500">*</span></label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="예: 냉동 삼겹살"
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
                <option value="">선택</option>
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
                placeholder="예: 팩, 병, kg"
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
                placeholder="0"
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
                  placeholder="0"
                  className={`${inputStyle} pr-10`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">일</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-2 italic px-1">
            * 표시는 필수 입력 항목입니다.
          </p>

          {/* 버튼 */}
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
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockRegistrationModal;
