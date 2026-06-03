import { useState, useCallback } from 'react';

/**
 * @file useGroupOrder.js
 * @description 공동 발주 도메인의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useGroupOrder = () => {
  // 공동 발주 목록 데이터 (임시 데이터)
  const [groupOrders, setGroupOrders] = useState([
    {
      id: 'GRP-20240601-001',
      title: '한우 등심 (1+ 등급, 10kg)',
      supplier: '상생 농장',
      deadline: '2024-06-05',
      dDay: 'D-4',
      progress: 75,
      currentCount: 15,
      minCount: 20,
      price: 450000,
      discountPrice: 380000,
      status: '모집중',
      category: '육류',
    },
    {
      id: 'GRP-20240531-002',
      title: '대용량 식용유 (18L x 10)',
      supplier: '글로벌 유통',
      deadline: '2024-06-02',
      dDay: 'D-1',
      progress: 92,
      currentCount: 23,
      minCount: 25,
      price: 250000,
      discountPrice: 210000,
      status: '모집중',
      category: '가공식품',
    },
    {
      id: 'GRP-20240530-003',
      title: '친환경 양파 (20kg 망)',
      supplier: '산지 직송',
      deadline: '2024-05-31',
      dDay: 'D-Day',
      progress: 100,
      currentCount: 30,
      minCount: 30,
      price: 35000,
      discountPrice: 28000,
      status: '모집완료',
      category: '채소류',
    },
    {
      id: 'GRP-20240529-004',
      title: '국산 쌀 (특등급, 20kg)',
      supplier: '경기 농협',
      deadline: '2024-05-28',
      dDay: '-',
      progress: 45,
      currentCount: 9,
      minCount: 20,
      price: 65000,
      discountPrice: 55000,
      status: '모집실패',
      category: '곡물류',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('전체');

  const filteredOrders = groupOrders.filter((order) => 
    filterStatus === '전체' ? true : order.status === filterStatus
  );

  const handleFilterChange = useCallback((status) => {
    setFilterStatus(status);
  }, []);

  return {
    groupOrders: filteredOrders,
    filterStatus,
    handleFilterChange,
  };
};
