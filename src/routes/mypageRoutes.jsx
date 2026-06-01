import BusinessMyPage from '../features/mypage/BusinessMyPage';
import PartnerInfoPage from '../features/mypage/PartnerInfoPage';
import PartnerEditProfilePage from '../features/mypage/PartnerEditProfilePage';

/**
 * @file mypageRoutes.jsx
 * @description 마이페이지 도메인 전용 라우트 설정 (아키텍처 규칙 2번 준수)
 */
const mypageRoutes = [
  {
    path: 'business-mypage',
    element: <BusinessMyPage />,
  },
  {
    path: 'partner-info',
    element: <PartnerInfoPage />,
  },
  {
    path: 'partner-edit',
    element: <PartnerEditProfilePage />,
  }
];

export default mypageRoutes;
