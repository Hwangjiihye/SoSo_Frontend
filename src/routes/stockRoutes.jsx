import StockPage from '../features/stock/StockPage';
import StockStatusPage from '../features/stock/StockStatusPage';

/**
 * @file stockRoutes.jsx
 * @description 재고 관리 도메인 전용 라우트 설정
 */
const stockRoutes = [
  {
    path: '/stock',
    element: <StockPage />,
  },
  {
    path: '/stock-status',
    element: <StockStatusPage />,
  }
];

export default stockRoutes;
