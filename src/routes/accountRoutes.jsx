import AccountManagementPage from '../features/account/AccountManagementPage';
import AccountRegistrationPage from '../features/account/AccountRegistrationPage';
import AccountListPage from '../features/account/AccountListPage';

/**
 * @file accountRoutes.jsx
 * @description 거래처 관리 도메인의 라우트 설정 파일입니다.
 */
const accountRoutes = [
  {
    path: '/account/management', // 품목 관리 (메인)
    element: <AccountManagementPage />,
  },
  {
    path: '/account/register', // 거래처 등록
    element: <AccountRegistrationPage />,
  },
  {
    path: '/account/list', // 거래처 목록
    element: <AccountListPage />,
  },
];

export default accountRoutes;