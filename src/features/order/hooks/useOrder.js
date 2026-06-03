import { useState, useCallback } from 'react';

/**
 * @file useOrder.js
 * @description 발주 관리 도메인의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useOrder = () => {
  // 발주 목록 데이터 (확장된 임시 데이터)
  const [orders, setOrders] = useState([
    {
      id: 'ORD-20240601-001',
      supplier: '한우 농장',
      items: '소고기 안심 외 3건',
      totalAmount: 1250000,
      status: '배송중',
      paymentStatus: '결제완료',
      paymentMethod: '카드결제',
      expectedDate: '2024-06-03',
    },
    {
      id: 'ORD-20240531-002',
      supplier: '청과 도매',
      items: '양파, 마늘 외 5건',
      totalAmount: 450000,
      status: '배송완료',
      paymentStatus: '결제완료',
      paymentMethod: '계좌이체',
      expectedDate: '2024-06-01',
    },
    {
      id: 'ORD-20240530-003',
      supplier: '식자재 마트',
      items: '식용유 18L x 5',
      totalAmount: 320000,
      status: '주문취소',
      paymentStatus: '환불완료',
      paymentMethod: '카드결제',
      expectedDate: '-',
    },
    {
      id: 'ORD-20240529-004',
      supplier: '대성 유통',
      items: '냉동 삼겹살 20kg',
      totalAmount: 850000,
      status: '배송완료',
      paymentStatus: '결제완료',
      paymentMethod: '외상매입',
      expectedDate: '2024-05-31',
    },
    {
      id: 'ORD-20240528-005',
      supplier: '수산물 직판',
      items: '고등어, 오징어 외 2건',
      totalAmount: 180000,
      status: '대기중',
      paymentStatus: '미결제',
      paymentMethod: '계좌이체',
      expectedDate: '2024-06-02',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('전체');
  const [dateRange, setDateRange] = useState('7일'); // 오늘, 7일, 1개월, 3개월

  // 필터링 로직
  const filteredOrders = orders.filter((order) => {
    const statusMatch = filterStatus === '전체' ? true : order.status === filterStatus;
    // 기간 필터링 로직은 실제 구현 시 날짜 계산 라이브러리(date-fns 등) 사용 권장
    return statusMatch;
  });

  const handleFilterChange = useCallback((status) => {
    setFilterStatus(status);
  }, []);

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  return {
    orders: filteredOrders,
    filterStatus,
    dateRange,
    handleFilterChange,
    handleDateRangeChange,
  };
};
