import React from 'react';

/**
 * @file InfoItem.jsx
 * @description 마이페이지 정보 표시용 개별 필드 컴포넌트 (Read-Only)
 */
export const InfoItem = ({ label, value }) => (
  <div className="flex flex-col space-y-1.5">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{label}</span>
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 font-medium break-all">
      {value || '-'}
    </div>
  </div>
);

/**
 * @file SectionTitle.jsx
 * @description 마이페이지 섹션 구분 타이틀
 */
export const SectionTitle = ({ title, colorClass = "border-blue-500" }) => (
  <div className={`border-l-4 ${colorClass} pl-3 mb-6`}>
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
  </div>
);

/**
 * @file StoreImage.jsx
 * @description 가게 사진 표시 컴포넌트
 */
export const StoreImage = ({ exteriorImg, interiorImg }) => (
  <div className="w-full space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">가게 사진 확인</span>
      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full">📡 실시간 연동 중</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 가게 외관 */}
      <div className="flex flex-col gap-2">
        <div className="aspect-video md:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner flex items-center justify-center relative group">
          {exteriorImg ? (
            <>
              <img 
                src={exteriorImg} 
                alt="가게 외관" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-2 backdrop-blur-[2px]">
                <p className="text-[11px] text-white font-bold text-center tracking-tight">가게 외관</p>
              </div>
            </>
          ) : (
            <NoImagePlaceholder label="가게 외관" />
          )}
        </div>
      </div>

      {/* 가게 내부 */}
      <div className="flex flex-col gap-2">
        <div className="aspect-video md:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner flex items-center justify-center relative group">
          {interiorImg ? (
            <>
              <img 
                src={interiorImg} 
                alt="가게 내부" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-2 backdrop-blur-[2px]">
                <p className="text-[11px] text-white font-bold text-center tracking-tight">가게 내부</p>
              </div>
            </>
          ) : (
            <NoImagePlaceholder label="가게 내부" />
          )}
        </div>
      </div>
    </div>
  </div>
);

const NoImagePlaceholder = ({ label }) => (
  <div className="flex flex-col items-center text-gray-300">
    <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <span className="text-[11px] font-bold">{label} 사진 없음</span>
  </div>
);
