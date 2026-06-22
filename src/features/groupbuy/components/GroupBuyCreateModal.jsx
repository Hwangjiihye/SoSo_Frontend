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
  const [formData, setFormData] = useState({
    groupName: '',          // 공동구매명
    description: '',        // 상세설명
    partnerName: '',        // 거래처명 (직접 입력)
    itemName: '',           // 품목명 (직접 입력)
    category: '',           // 카테고리
    quantity: 1,            // 수량
    unitPrice: 0,           // 단가
    targetParticipants: 1,  // 모집인원
    endDate: '',            // 마감기한
    pickupZipCode: '',      // 픽업 우편번호
    pickupAddress: '',      // 픽업 기본주소
    pickupDetailAddress: '',// 픽업 상세주소
    pickupTime: '',         // 픽업가능시간
    notice: '',             // 유의사항
  });

  // 주소 검색 (Daum Postcode)
  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData(prev => ({ 
          ...prev, 
          pickupZipCode: data.zonecode, 
          pickupAddress: data.roadAddress 
        }));
      }
    }).open();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['quantity', 'unitPrice', 'targetParticipants'].includes(name) 
        ? (value === '' ? '' : Number(value)) 
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 마감 기한 과거 체크
    const selectedDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 자정으로 초기화

    if (selectedDate < today) {
      alert("마감 기한은 이미 지났습니다. 오늘 혹은 미래 날짜로 설정해주세요.");
      return; // 통신 차단
    }

    // 주소 정보 조합: (우편번호) 기본주소 상세주소
    const combinedPickupLocation = `(${formData.pickupZipCode}) ${formData.pickupAddress} ${formData.pickupDetailAddress}`.trim();

    // formData에 DTO의 totalAmount 필드로 총 결제금액 전달
    const submitData = {
      ...formData,
      pickupLocation: combinedPickupLocation,
      totalAmount: formData.quantity * formData.unitPrice,
    };
    
    // LocalDateTime 파싱을 위해 'T23:59:59'를 붙여 전송 (백엔드가 'yyyy-MM-dd'를 파싱하지 못할 경우 대비)
    if (submitData.endDate && !submitData.endDate.includes('T')) {
      submitData.endDate = `${submitData.endDate}T23:59:59`;
    }

    onSubmit(submitData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl mx-auto rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* 헤더 */}
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-900">
              {isPartner ? '거래처 공동그룹 생성' : '사업자 공동그룹 생성'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors group">
            <svg className="w-6 h-6 text-gray-300 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* 기본 정보 섹션 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-3 bg-purple-500 rounded-full"></span>
              <h4 className="text-sm font-black text-gray-900 uppercase">기본 정보</h4>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">공동구매그룹명</label>
              <input
                required
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                placeholder="공동구매그룹명을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">상세설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-[28px] px-6 py-5 text-sm focus:border-emerald-500 focus:bg-white outline-none font-bold h-24 resize-none transition-all"
                placeholder="공동구매에 대한 상세 설명을 입력하세요"
              />
            </div>
          </section>

          {/* 상품 및 거래처 정보 섹션 */}
          <section className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
              <h4 className="text-sm font-black text-gray-900 uppercase">상품 및 모집 정보</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">거래처명</label>
                <input
                  required
                  name="partnerName"
                  value={formData.partnerName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                  placeholder="예: 상생 농장"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">품목명</label>
                <input
                  required
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                  placeholder="예: 한우 등심 (1+ 등급)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">카테고리</label>
                <input
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                  placeholder="예: 육류, 채소류"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">수량</label>
                <input
                  required
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">단가 (₩)</label>
                <input
                  required
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                  placeholder="단가 입력"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">모집인원 (명)</label>
                <input
                  required
                  type="number"
                  name="targetParticipants"
                  value={formData.targetParticipants}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">마감 기한</label>
                <input
                  required
                  type="date"
                  name="endDate"
                  min={new Date().toISOString().split('T')[0]} // 오늘 날짜 이전 선택 방지
                  value={formData.endDate.split('T')[0]} // 화면 표시용
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">총 결제 금액 (₩)</label>
              <div className="relative">
                <input
                  readOnly
                  type="number"
                  value={formData.quantity * formData.unitPrice}
                  className="w-full bg-gray-100 border-2 border-gray-50 rounded-[20px] px-6 py-5 text-xl outline-none font-black text-gray-500 pl-12"
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xl">₩</span>
              </div>
            </div>
          </section>

          {/* 픽업 정보 섹션 */}
          <section className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-3 bg-blue-500 rounded-full"></span>
              <h4 className="text-sm font-black text-gray-900 uppercase">픽업 및 유의사항 정보</h4>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">픽업 장소</label>
              <div className="flex gap-2">
                <input
                  required
                  name="pickupZipCode"
                  value={formData.pickupZipCode}
                  readOnly
                  className="w-1/3 bg-gray-100 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-500 outline-none"
                  placeholder="우편번호"
                />
                <button
                  type="button"
                  onClick={searchAddress}
                  className="w-1/3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                >
                  주소검색
                </button>
              </div>
              <input
                required
                name="pickupAddress"
                value={formData.pickupAddress}
                readOnly
                className="w-full bg-gray-100 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm font-bold text-gray-500 outline-none"
                placeholder="도로명 주소"
              />
              <input
                required
                name="pickupDetailAddress"
                value={formData.pickupDetailAddress}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-bold transition-all"
                placeholder="상세주소를 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">픽업 가능 시간</label>
              <div className="relative">
                <input
                  required
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm focus:border-emerald-500 focus:bg-white outline-none font-bold transition-all pl-12"
                  placeholder="예: 매일 14:00 ~ 18:00"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">⏰</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">유의사항</label>
              <textarea
                name="notice"
                value={formData.notice}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-[28px] px-6 py-5 text-sm focus:border-emerald-500 focus:bg-white outline-none font-bold h-32 resize-none transition-all"
                placeholder="참여자들에게 전달할 유의사항을 입력해 주세요."
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
