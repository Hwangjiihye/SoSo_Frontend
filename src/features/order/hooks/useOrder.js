import { useState, useCallback, useEffect } from 'react';
import { orderList } from '../../../apis/orderApi';

/**
 * @file useOrder.js
 * @description 발주 관리 도메인의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useOrder = () => {

  // 발주 목록 데이터
  const [orders, setOrders] = useState([]);

  const [filterStatus, setFilterStatus] = useState('전체');
  const [dateRange, setDateRange] = useState('7일'); // 오늘, 7일, 1개월, 3개월
  const [keyword, setKeyword] = useState('');

  // 검색
  const fetchSearch = async () => {
    console.log("검색어 : " + keyword);
    fetchOrderList(keyword);
  };

  // 검색어 입력
  const handleKeywordChange = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

  // 검색 초기화
  const reset = async () => {
    setKeyword('');
    await fetchOrderList('');
  }

  useEffect(() => {
    fetchOrderList();
  }, [])

  const fetchOrderList = async (searchKeyword = '') => {
     try {
      const data = await orderList(searchKeyword);

      console.log('발주 목록 조회 결과:', data);

      setOrders(data);
    } catch (error) {
      console.error('발주 목록 조회 실패:', error);
      setOrders([]);
    }
  };

  // 필터링 로직
  const filteredOrders = orders.filter((order) => {
    const statusMatch = filterStatus === '전체' ? true : order.orderStatus === filterStatus;
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
    setOrders,
    filterStatus,
    dateRange,
    handleFilterChange,
    handleDateRangeChange,
    fetchSearch,
    keyword,
    handleKeywordChange,
    fetchSearch,
    reset
  };
};
