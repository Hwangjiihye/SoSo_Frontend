import React, { useState, useEffect } from 'react';

/**
 * @file StockEditModal.jsx
 * @description 재고 정보를 수정하는 모달 컴포넌트
 */
const StockEditModal = ({ isOpen, onClose, stock, onEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    safetyStock: '',
    expiryDays: '',
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        name: stock.name || '',
        category: stock.category || '',
        unit: stock.unit || '',
        safetyStock: stock.safetyStock || '',
        expiryDays: stock.expiryDays || '',
      });
    }
  }, [stock]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(stock.id, formData);
    onClose();
  };

  const labelStyle = "block text-xs font-bold text-gray-500 mb-1.5 ml-1";
  const inputStyle = "w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">품목 정보 수정</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelStyle}>품목명</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>카테고리</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputStyle} required>
                <option value="육류">육류</option>
                <option value="채소">채소</option>
                <option value="소스/오일">소스/오일</option>
                <option value="가공식품">가공식품</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>단위</label>
              <input type="text" name="unit" value={formData.unit} onChange={handleChange} className={inputStyle} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>안전재고수량</label>
              <input type="number" name="safetyStock" value={formData.safetyStock} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>기본 소비기한 일수</label>
              <input type="number" name="expiryDays" value={formData.expiryDays} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 h-12 bg-gray-100 text-gray-600 font-bold rounded-2xl">취소</button>
            <button type="submit" className="flex-1 h-12 bg-emerald-600 text-white font-bold rounded-2xl">수정하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockEditModal;
