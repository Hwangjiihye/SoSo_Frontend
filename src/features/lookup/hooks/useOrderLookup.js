import { useState, useCallback } from 'react';
import axiosInstance from '../../../apis/axiosConfig.js';
import authStore from '../../../store/authStore.js';

/**
 * @file useOrderLookup.js
 * @description 발주 이력 조회 비즈니스 로직 훅
 */
export const useOrderLookup = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const { selectedStoreSeq } = authStore();

  const fetchOrders = useCallback(async (params) => {
    setIsLoading(true);
    const { user_type, user_seq } = authStore.getState();
    const isPartner = user_type === 'PARTNER';

    try {
      let response;
      if (isPartner) {
        // Convert status 'ALL' to empty string for MyBatis mapper
        const apiStatus = params.status === 'ALL' ? '' : params.status;
        response = await axiosInstance.get('/api/partner/orders', {
          params: {
            sellerSeq: user_seq,
            keyword: params.keyword,
            status: apiStatus
          }
        });
        
        let data = response.data || [];
        // Apply date filtering client-side for partner since the endpoint doesn't support date queries
        if (params.startDate) {
          data = data.filter(o => o.createdAt && o.createdAt.split('T')[0] >= params.startDate);
        }
        if (params.endDate) {
          data = data.filter(o => o.createdAt && o.createdAt.split('T')[0] <= params.endDate);
        }
        setOrders(data);
      } else {
        response = await axiosInstance.get('/order/list', { 
          params: { ...params, storeSeq: selectedStoreSeq } 
        });
        setOrders(response.data);
      }
    } catch (error) {
      console.error('발주 이력을 불러오는데 실패했습니다.', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreSeq]);

  const fetchOrderDetail = useCallback(async (orderSeq) => {
    try {
      const response = await axiosInstance.get(`/order/list/${orderSeq}`);
      const detailData = response.data;

      // For partner logins, map the company name to show the buyer's store name
      const { user_type } = authStore.getState();
      if (user_type === 'PARTNER' && detailData && detailData.orderInfo) {
        setOrders((currentOrders) => {
          const matchingOrder = currentOrders.find(o => o.orderSeq === orderSeq);
          if (matchingOrder) {
            detailData.orderInfo.companyName = matchingOrder.companyName;
          }
          return currentOrders;
        });
      }

      setOrderDetail(detailData);
    } catch (error) {
      console.error('발주 상세 정보를 불러오는데 실패했습니다.', error);
    }
  }, []);

  return {
    orders,
    isLoading,
    orderDetail,
    setOrderDetail,
    fetchOrders,
    fetchOrderDetail,
  };
};
