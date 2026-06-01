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
export const StoreImage = ({ exteriorImg }) => (
  <div className="w-full space-y-2">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">가게 사진 확인</span>
    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center">
      {exteriorImg ? (
        <img 
          src={`/api/images/${exteriorImg}`} 
          alt="가게 전경" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">등록된 사진이 없습니다.</span>
        </div>
      )}
    </div>
  </div>
);
