import React from 'react';
import OrderPage from './OrderPage';
import PartnerOrderPage from './PartnerOrderPage';

const OrderRouteWrapper = () => {
  const userType = sessionStorage.getItem('user_type');

  if (userType === 'PARTNER' || userType === 'Partner') {
    return <PartnerOrderPage />;
  }

  return <OrderPage />;
};

export default OrderRouteWrapper;
