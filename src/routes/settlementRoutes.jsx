import SettlementPage from '../features/payment/SettlementPage';
import TransferManagementPage from '../features/payment/TransferManagementPage';
import ExpenseCategoryPage from '../features/payment/ExpenseCategoryPage';
import ExportPage from '../features/payment/ExportPage';

/**
 * @file settlementRoutes.jsx
 * @description 정산 관리 도메인의 라우트 설정 파일입니다.
 */
const settlementRoutes = [
  {
    path: '/settlement',
    element: <SettlementPage />,
  },
  {
    path: '/transfer-management',
    element: <TransferManagementPage />,
  },
  {
    path: '/expense-category',
    element: <ExpenseCategoryPage />,
  },
  {
    path: '/export',
    element: <ExportPage />,
  },
];

export default settlementRoutes;
