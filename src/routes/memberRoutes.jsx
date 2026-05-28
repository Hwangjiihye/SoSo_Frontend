import LoginPage from '../features/member/LoginPage';

/**
 * @file memberRoutes.jsx
 * @description 회원 관련(로그인, 회원가입, 프로필 등) 도메인의 라우트 설정 파일입니다.
 */
const memberRoutes = [
  {
    path: '/login', // 로그인 페이지 경로
    element: <LoginPage />,
  },
];

export default memberRoutes;
