import React from 'react';
import GroupBuyPage from '../features/groupbuy/GroupBuyPage';
import GroupBuyDeliveryPage from '../features/groupbuy/GroupBuyDeliveryPage';

/**
 * @file groupBuyRoutes.jsx
 * @description 공동구매 관련 라우트 설정 파일입니다.
 */
const groupBuyRoutes = [
  {
    path: '/group-buy',
    element: <GroupBuyPage />,
  },
  {
    path: '/group-buy/:seq/delivery',
    element: <GroupBuyDeliveryPage />,
  },
];

export default groupBuyRoutes;
