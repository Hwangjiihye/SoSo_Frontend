import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * @file LookupLayout.jsx
 * @description 조회/기록 센터 전용 사이드바 제거 레이아웃
 */
const LookupLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 콘텐츠 영역 */}
      <main className="overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default LookupLayout;
