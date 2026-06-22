import React from 'react';
import GroupBuyPage from '../features/groupbuy/GroupBuyPage';
import GroupBuyDeliveryPage from '../features/groupbuy/GroupBuyDeliveryPage';
import GroupBuyDetailPage from '../features/groupbuy/GroupBuyDetailPage';
import GroupBuyInfoPage from '../features/groupbuy/GroupBuyInfoPage';

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
    path: '/group-buy/:seq',
    element: <GroupBuyDetailPage />,
  },
  {
    path: '/group-buy/:seq/info',
    element: <GroupBuyInfoPage />,
  },
  {
    path: '/group-buy/:seq/delivery',
    element: <GroupBuyDeliveryPage />,
  },
];

export default groupBuyRoutes;
