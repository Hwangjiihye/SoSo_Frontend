import StockPage from '../features/stock/StockPage';

/**
 * @file stockRoutes.jsx
 * @description 재고 관리 도메인 전용 라우트 설정
 */
const stockRoutes = [
  {
    path: '/stock',
    element: <StockPage />,
  }
];

export default stockRoutes;
