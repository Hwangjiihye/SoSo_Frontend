import LookupLayout from '../components/layout/LookupLayout';
import LookupHubPage from '../features/lookup/LookupHubPage';
import StockLookupPage from '../features/lookup/StockLookupPage';
import OrderLookupPage from '../features/lookup/OrderLookupPage';
import GroupOrderLookupPage from '../features/lookup/GroupOrderLookupPage';
import BusinessLogPage from '../features/lookup/BusinessLogPage';

/**
 * @file lookupRoutes.jsx
 * @description 조회/기록 센터 도메인 전용 라우트 설정
 */
const lookupRoutes = [
  {
    path: '/lookup',
    element: <LookupLayout />,
    children: [
      {
        index: true,
        element: <LookupHubPage />,
      },
      {
        path: 'stock',
        element: <StockLookupPage />,
      },
      {
        path: 'orders',
        element: <OrderLookupPage />,
      },
      {
        path: 'group-orders',
        element: <GroupOrderLookupPage />,
      },
      {
        path: 'business-logs',
        element: <BusinessLogPage />,
      },
    ],
  },
];

export default lookupRoutes;
