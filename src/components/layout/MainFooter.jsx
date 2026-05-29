/**
 * @file MainFooter.jsx
 * @description 모든 페이지 최하단에 표시되는 공통 푸터 컴포넌트입니다.
 * 저작권 정보 및 약관 링크를 포함합니다.
 */
import React from 'react';

function MainFooter() {
  return (
    <footer className="bg-white py-12 border-t border-gray-50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* 로고 텍스트 */}
        <div className="text-lg font-black text-gray-200">SoSo.</div>
        
        {/* 정책 및 고객지원 링크 */}
        <div className="flex gap-8 text-xs font-bold text-gray-300">
          <a href="#" className="hover:text-emerald-500 transition-colors">이용약관</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">개인정보처리방침</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">고객지원</a>
        </div>
        
        {/* 저작권 표시 */}
        <div className="text-[10px] text-gray-200 uppercase tracking-wider">
          © 2026 SMART STOCK ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
