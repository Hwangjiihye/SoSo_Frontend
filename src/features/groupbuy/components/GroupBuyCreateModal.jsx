import React, { useState, useEffect } from 'react';

/**
 * @file GroupBuyCreateModal.jsx
 * @description 사업자용 공동구매 생성 모달
 * 요구사항: 
 * 1. 최소/최대 인원 삭제 -> 모집인원 추가
 * 2. 1인당 금액 -> 품목명 선택 시 총 금액
 * 3. 결제방식 & 구매단위 삭제
 * 4. 픽업 장소 주소 -> 배송 유의사항
 * 5. 수량 & 품목명 항목 추가
 */
const GroupBuyCreateModal = ({ onClose, onSubmit, isPartner }) => {
  // 예시 품목 데이터 (요구사항: 품목명 선택 시 총 금액 반영)
  const itemTemplates = [
    { name: '한우 등심 (1+ 등급)', quantity: '10kg', price: 380000, category: '육류' },
    { name: '친환경 양파', quantity: '20kg 망', price: 28000, category: '채소류' },
    { name: '무농약 쌀', quantity: '20kg', price: 65000, category: '가공식품' },
    { name: '수입산 삼겹살', quantity: '5kg', price: 120000, category: '육류' },
  ];

  const [formData, setFormData] = useState({
    title: '', 
    quantity: '',
    category: '',
    target_participants: 1,
    total_amount: 0,
    deadline: '',
    pickup_location: '', // 픽업 장소 추가
    pickup_time: '',     // 픽업 가능 시간 추가
    delivery_note: '',
  });

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState('');

  // 품목 선택 시 자동 입력 로직
  useEffect(() => {
    if (selectedTemplateIndex !== '') {
      const template = itemTemplates[selectedTemplateIndex];
      setFormData(prev => ({
        ...prev,
        title: template.name,
        quantity: template.quantity,
        total_amount: template.price, // 1인당이 아닌 선택 시의 기준 총 금액
        category: template.category
      }));
    }
  }, [selectedTemplateIndex]);

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
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* 헤더 */}
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-900">
              {isPartner ? '거래처 공동그룹 생성' : '사업자 공동그룹 생성'}
            </h3>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Create New Group Buy</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors group">
            <svg className="w-6 h-6 text-gray-300 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* 상품 정보 섹션 */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
              <h4 className="text-sm font-black text-gray-900 uppercase">상품 및 모집 정보</h4>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] ml-1">품목 템플릿 선택</label>
              <select
                value={selectedTemplateIndex}
                onChange={(e) => setSelectedTemplateIndex(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-bold transition-all appearance-none"
              >
                <option value="">직접 입력 또는 템플릿 선택</option>
                {itemTemplates.map((item, idx) => (
                  <option key={idx} value={idx}>{item.name} ({item.quantity})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">품목명</label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                  placeholder="품목명 입력"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">수량</label>
                <input
                  required
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                  placeholder="예: 10kg, 5박스"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">카테고리</label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all appearance-none"
                >
                  <option value="">선택</option>
                  <option value="육류">육류</option>
                  <option value="채소류">채소류</option>
                  <option value="가공식품">가공식품</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">모집인원 (명)</label>
                <input
                  required
                  type="number"
                  name="target_participants"
                  value={formData.target_participants}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">총 결제 금액 (₩)</label>
              <div className="relative">
                <input
                  required
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-[20px] px-6 py-5 text-xl focus:border-emerald-500 focus:bg-white outline-none font-black transition-all pl-12"
                  placeholder="0"
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xl">₩</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">마감 기한</label>
              <input
                required
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
              />
            </div>
          </section>

          {/* 픽업 정보 섹션 (c1.png 반영) */}
          <section className="space-y-6 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-3 bg-blue-500 rounded-full"></span>
              <h4 className="text-sm font-black text-gray-900 uppercase">픽업 및 배송 정보</h4>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">픽업 장소</label>
              <div className="relative">
                <input
                  required
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-bold transition-all pl-12"
                  placeholder="픽업할 정확한 주소 또는 장소를 입력하세요."
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📍</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">픽업 가능 시간</label>
              <div className="relative">
                <input
                  required
                  name="pickup_time"
                  value={formData.pickup_time}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-bold transition-all pl-12"
                  placeholder="예: 매일 14:00 ~ 18:00"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">⏰</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">배송 유의사항</label>
              <textarea
                name="delivery_note"
                value={formData.delivery_note}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-[28px] px-6 py-5 text-sm focus:border-emerald-500 focus:bg-white outline-none font-bold h-32 resize-none transition-all"
                placeholder="참여자들에게 전달할 추가 안내사항을 입력해 주세요."
              />
            </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-6 rounded-[30px] font-black text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 active:scale-[0.98] hover:-translate-y-1"
            >
              공동그룹 생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupBuyCreateModal;
