import LoginPage from '../features/member/LoginPage';
import FindIdPage from '../features/member/FindIdPage';

/**
 * @file memberRoutes.jsx
 * @description 회원 관련 도메인의 라우트 설정입니다.
 */
const memberRoutes = [
  {
    path: '/login', // 로그인 페이지 명시적 경로 설정
    element: <LoginPage />,
  },
  {
    path: '/find-id', // 아이디 찾기 페이지 경로
    element: <FindIdPage />,
  },
];

export default memberRoutes;
