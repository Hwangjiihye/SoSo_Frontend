/**
 * @file AppRoutes.jsx
 * @description 애플리케이션의 최상위 라우팅 프로바이더 설정입니다.
 * src/routes/index.jsx에서 정의된 라우터 객체를 앱 전체에 주입합니다.
 */
import React from 'react';
import MainPage from '../features/main/MainPage';
import BusinessMyPage from '../features/mypage/BusinessMyPage';
import BusinessUpdateMyPage from '../features/mypage/BusinessUpdateMyPage';
import BusinessMultiProfile from '../features/mypage/BusinessMultiProfile';
import LoginPage from '../features/member/LoginPage';
import PartnerMain from '../features/main/PartnerMain';
import BusinessMain from '../features/main/BusinessMain';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import memberRoutes from './memberRoutes';
import mypageRoutes from './mypageRoutes';
import orderRoutes from './orders';
import communityRoutes from './communityRoutes';
import accountRoutes from './accountRoutes';

/**
 * @file AppRoutes.jsx
 * @description 최상위 라우터 조립소 (아키텍처 규칙 1, 2번 준수)
 */

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
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
        path: "/business-update-mypage",
        element: <BusinessUpdateMyPage />,
      },
      {
        path: "/business-multiprofile",
        element: <BusinessMultiProfile />,
      },
      {
        path: "/login",
 // 로그인 경로도 안전하게 등록
        element: <LoginPage />,
      },
      // 추후 로그인, 마이페이지 등 새로운 페이지가 생기면 여기에 객체를 추가합니다.
      ...memberRoutes, // /member, /signup 등의 경로가 루트 하위에 조립됨
      // 도메인별 라우트 장부 조립
      ...memberRoutes,
      ...mypageRoutes,
      ...orderRoutes,
      ...communityRoutes,
      ...accountRoutes,
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
