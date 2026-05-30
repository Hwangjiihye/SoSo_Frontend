
/**
 * @file AppRoutes.jsx
 * @description 애플리케이션의 최상위 라우팅 프로바이더 설정입니다.
 * src/routes/index.jsx에서 정의된 라우터 객체를 앱 전체에 주입합니다.
 */
import React from 'react';
import MainPage from '../features/main/MainPage';
import BusinessMyPage from '../features/member/mypage/BusinessMyPage';
import LoginPage from '../features/member/LoginPage';
import PartnerMain from '../features/main/PartnerMain';
import BusinessMain from '../features/main/BusinessMain';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { memberRoutes } from './memberRoutes';
/**
 * @file AppRoutes.jsx
 * @description 도메인별 라우트 장부를 전개(Spread)하여 최상위 라우터에 조립합니다.
 */

// 라우터 객체 생성
// 배열 안의 각 객체는 특정 URL 경로(path)와 해당 경로에서 보여줄 컴포넌트(element)를 매핑합니다.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/business-mypage",
        element: <BusinessMyPage />,
      },
      {
    path: "/BusinessMain",
    element: <BusinessMain/>,
  },
  {
    path: "/PartnerMain",
    element: <PartnerMain/>,
  },
  {
    path: "/login", // 로그인 경로도 안전하게 등록
    element: <LoginPage />,
  },
      // 추후 로그인, 마이페이지 등 새로운 페이지가 생기면 여기에 객체를 추가합니다.
      ...memberRoutes, // /member, /signup 등의 경로가 루트 하위에 조립됨
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
