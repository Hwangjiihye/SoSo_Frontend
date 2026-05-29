

/**
 * @file AppRoutes.jsx
 * @description 애플리케이션의 최상위 라우팅 프로바이더 설정입니다.
 * src/routes/index.jsx에서 정의된 라우터 객체를 앱 전체에 주입합니다.
 */
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from '../features/main/MainPage';
import BusinessMyPage from '../features/member/mypage/BusinessMyPage';
import LoginPage from '../features/member/LoginPage';
import PartnerMain from '../features/main/PartnerMain';

// 라우터 객체 생성
// 배열 안의 각 객체는 특정 URL 경로(path)와 해당 경로에서 보여줄 컴포넌트(element)를 매핑합니다.
const router = createBrowserRouter([
  {
    path: "/", // 기본 도메인 주소 (예: localhost:5173/)
    element: <MainPage />, // 화면에 MainPage 컴포넌트를 렌더링
  },
  {
    path: "/businessMain",
    element: <BusinessMain/>,
  },
  {
    path: "/partherMain",
    element: <PartnerMain/>,
  },
  {
    path: "/login", // 로그인 경로도 안전하게 등록
    element: <LoginPage />,
  },
  {
    path: "/business-mypage",
    element: <BusinessMyPage />,
  }
  // 추후 로그인, 마이페이지 등 새로운 페이지가 생기면 여기에 객체를 추가합니다.
]);

// 앱 최상단에 주입될 라우터 프로바이더 컴포넌트
function AppRoutes() {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
