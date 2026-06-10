import MainPage from '../features/main/MainPage';
import BusinessMyPage from '../features/mypage/BusinessMyPage';
import LoginPage from '../features/member/LoginPage';

/**
 * @file mainRoutes.jsx
 * @description 메인 페이지 및 랜딩 페이지 도메인의 라우트 설정 파일입니다.
 */
const mainRoutes = [
  {
    path: '/', // 루트 경로 (메인화면)
    element: <MainPage />,
  },
  {
    path: '/business-mypage',
    element: <BusinessMyPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
];

export default mainRoutes;
