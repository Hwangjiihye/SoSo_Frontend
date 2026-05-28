import LoginPage from '../features/member/LoginPage';

/**
 * @file memberRoutes.jsx
 * @description 회원 관련 도메인의 라우트 설정입니다.
 */
const memberRoutes = [
  {
    path: '/login', // 로그인 페이지 명시적 경로 설정
    element: <LoginPage />,
  },
];

export default memberRoutes;
