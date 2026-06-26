/**
 * @file MainFooter.jsx
 * @description 모든 페이지 최하단에 표시되는 공통 푸터 컴포넌트입니다.
 * 저작권 정보 및 약관 링크를 포함합니다.
 */
import React from 'react';

function MainFooter() {
  return (
    <footer className="bg-white py-5 sm:py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-5">
        
        {/* 좌측: 로고 및 저작권 */}
        <div className="flex flex-col items-center md:items-start gap-0.5 sm:gap-1">
          <div className="text-xl sm:text-2xl font-black text-gray-300 tracking-tighter">SoSo.</div>
          <div className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest">
            © 2026 SMART STOCK ALL RIGHTS RESERVED.
          </div>
        </div>
        
        {/* 우측: 정책 및 고객지원 링크 */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5 text-[12px] sm:text-[13px] font-bold text-gray-400">
          <a href="#" className="hover:text-emerald-500 transition-colors">이용약관</a>
          <span className="text-gray-200 font-normal select-none">|</span>
          <a href="#" className="hover:text-emerald-500 transition-colors">개인정보처리방침</a>
          <span className="text-gray-200 font-normal select-none">|</span>
          <a href="#" className="hover:text-emerald-500 transition-colors">고객지원</a>
        </div>

      </div>
    </footer>
  );
}

export default MainFooter;
