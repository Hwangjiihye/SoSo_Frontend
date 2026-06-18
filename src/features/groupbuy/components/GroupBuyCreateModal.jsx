import React, { useState } from 'react';

/**
 * @file GroupBuyCreateModal.jsx
 * @description 공동구매 개설 모달 (요구사항 반영: 모집인원 추가, 최소/최대 인원 삭제, 총금액 중심)
 */
const GroupBuyCreateModal = ({ onClose, onSubmit, isPartner }) => {
  const [formData, setFormData] = useState({
    title: '', // 품목명
    category: '',
    target_participants: 1, // 모집인원
    total_amount: 0, // 총 금액
    deadline: '',
    delivery_note: '', // 배송 유의사항
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'target_participants' || name === 'total_amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-900">공동그룹 생성</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* 품목명 (기존 명칭) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase">품목명</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              placeholder="예: 한우 등심 1+ 등급 10kg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase">카테고리</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              >
                <option value="">선택</option>
                <option value="육류">육류</option>
                <option value="채소류">채소류</option>
                <option value="가공식품">가공식품</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase">모집인원 (명)</label>
              <input
                required
                type="number"
                name="target_participants"
                value={formData.target_participants}
                onChange={handleChange}
                min="1"
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              />
            </div>
          </div>

          {/* 총 금액 (기존 1인당 금액 삭제 및 품목 선택 시 총 금액 개념 반영) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase">총 금액 (₩)</label>
            <input
              required
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              placeholder="전체 모집 달성 시 총 결제 금액"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase">마감 기한</label>
            <input
              required
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase">배송 유의사항</label>
            <textarea
              name="delivery_note"
              value={formData.delivery_note}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold h-24 resize-none"
              placeholder="참여자들에게 전달할 배송/픽업 정보를 입력하세요."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
            >
              그룹 생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupBuyCreateModal;
