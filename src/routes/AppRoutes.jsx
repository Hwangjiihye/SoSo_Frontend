import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainPage from '../features/main/MainPage';
import { memberRoutes } from './memberRoutes';
import BusinessMyPage from '../features/member/mypage/BusinessMyPage';
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
      // 추후 로그인, 마이페이지 등 새로운 페이지가 생기면 여기에 객체를 추가합니다.
      ...memberRoutes, // /member, /signup 등의 경로가 루트 하위에 조립됨
    ],
  },



]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
