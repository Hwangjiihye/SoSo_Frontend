import BusinessMyPage from '../features/mypage/BusinessMyPage';
import BusinessWithdrawalPage from '../features/mypage/BusinessWithdrawalPage';
import BusinessAttendancePage from '../features/mypage/BusinessAttendancePage';
import PartnerInfoPage from '../features/mypage/PartnerInfoPage';
import PartnerEditProfilePage from '../features/mypage/PartnerEditProfilePage';
import PartnerWithdrawalPage from '../features/mypage/PartnerWithdrawalPage';
import PartnerSmartNotificationPage from '../features/mypage/PartnerSmartNotificationPage';
import BusinessSmartNotificationPage from '../features/mypage/BusinessSmartNotificationPage';

/**
 * @file mypageRoutes.jsx
 * @description 마이페이지 도메인 전용 라우트 설정
 */
const mypageRoutes = [
  {
    path: 'business-mypage',
    element: <BusinessMyPage />,
  },
  {
    path: 'business-notification',
    element: <BusinessSmartNotificationPage />,
  },
  {
    path: 'business-withdrawal',
    element: <BusinessWithdrawalPage />,
  },
  {
    path: 'business-attendance',
    element: <BusinessAttendancePage />,
  },
  {
    path: 'partner-info',
    element: <PartnerInfoPage />,
  },
  {
    path: 'partner-edit',
    element: <PartnerEditProfilePage />,
  },
  {
    path: 'partner-withdrawal',
    element: <PartnerWithdrawalPage />,
  },
  {
    path: 'partner-notification',
    element: <PartnerSmartNotificationPage />,
  }
];

export default mypageRoutes;
