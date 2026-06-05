/**
 * @file AppRoutes.jsx
 * @description 애플리케이션의 최상위 라우팅 프로바이더 설정입니다.
 * src/routes/index.jsx에서 정의된 라우터 객체를 앱 전체에 주입합니다.
 */
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainPage from '../features/main/MainPage';
import memberRoutes from './memberRoutes';
import mypageRoutes from './mypageRoutes';
import orderRoutes from './orders';

/**
 * @file AppRoutes.jsx
 * @description 최상위 라우터 조립소 (아키텍처 규칙 1, 2번 준수)
 */

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      // 도메인별 라우트 장부 조립
      ...memberRoutes,
      ...mypageRoutes,
      ...orderRoutes,
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
