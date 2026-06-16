import CommunityPage from '../features/community/CommunityPage';

/**
 * @file communityRoutes.jsx
 * @description 커뮤니티 도메인의 라우트 설정 파일입니다.
 */
const communityRoutes = [
  {
    path: '/community', // 커뮤니티 메인 화면
    element: <CommunityPage />,
  },
];

export default communityRoutes;
