import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainPage from '../features/main/MainPage';
import { memberRoutes } from './memberRoutes';

/**
 * @file AppRoutes.jsx
 * @description 도메인별 라우트 장부를 전개(Spread)하여 최상위 라우터에 조립합니다.
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
      ...memberRoutes, // /member, /signup 등의 경로가 루트 하위에 조립됨
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
