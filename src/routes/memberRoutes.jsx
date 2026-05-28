import SignUpPage from '../features/member/SignUpPage';

/**
 * @file memberRoutes.jsx
 * @description 회원(Member) 도메인 관련 라우트 정의
 */
export const memberRoutes = [
  
  {
    path: 'signup',
    element: <SignUpPage />,
  },
];
