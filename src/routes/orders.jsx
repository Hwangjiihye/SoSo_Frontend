import OrderRouteWrapper from '../features/order/OrderRouteWrapper';
import GroupOrderList from '../features/order/GroupOrderList';
import OrderApplyPage from '../features/order/OrderApplyPage';

/**
 * @file orders.jsx
 * @description 발주 관리 도메인의 라우트 설정 파일입니다.
 */
const orderRoutes = [
  {
    path: '/orders', // 일반 발주 현황
    element: <OrderRouteWrapper />,
  },
  {
    path: '/orders/new', // 신규 발주 신청
    element: <OrderApplyPage />,
  },
  /*
  {
    path: '/group-orders', // 공동 발주 현황
    element: <GroupOrderList />,
  },
  */
];

export default orderRoutes;
