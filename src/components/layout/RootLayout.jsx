import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';

/**
 * @file RootLayout.jsx
 * @description 애플리케이션의 공통 레이아웃 컴포넌트입니다.
 * 모든 페이지에 공통적으로 적용되는 Header와 Footer를 포함합니다.
 */
const RootLayout = () => {
  const location = useLocation();

  // 현재 경로에 따라 헤더의 활성 메뉴를 결정합니다.
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.startsWith('/orders') || path.startsWith('/group-orders')) return '발주 관리';
    if (path.startsWith('/account')) return '거래처 관리';
    if (path.startsWith('/community')) return '커뮤니티';
    if (path.startsWith('/lookup')) return '조회/기록';
    if (path.startsWith('/support')) return '고객지원';
    // 추가적인 경로에 따른 매칭 로직을 여기에 작성합니다.
    return '홈';
  };

  // 특정 페이지(예: 로그인, 회원가입 등)에서 헤더나 푸터를 숨기고 싶을 경우의 로직
  const hideLayout = ['/login', '/signup'].includes(location.pathname);

  if (hideLayout) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader activeMenu={getActiveMenu()} />
      <main className="flex-1">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
};

export default RootLayout;
