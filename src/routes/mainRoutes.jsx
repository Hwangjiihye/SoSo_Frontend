import MainPage from '../features/main/MainPage';

/**
 * @file mainRoutes.jsx
 * @description 메인 페이지 및 랜딩 페이지 도메인의 라우트 설정 파일입니다.
 */
const mainRoutes = [
  {
    path: '/', // 루트 경로 (메인화면)
    element: <MainPage />,
  },
];

export default mainRoutes;
