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

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getDateRange = (range) => {
  const today = new Date();

  const start = new Date(today);

  if (range === '오늘') {
    // 오늘 그대로
  } else if (range === '7일') {
    start.setDate(today.getDate() - 7);
  } else if (range === '1개월') {
    start.setMonth(today.getMonth() - 1);
  } else if (range === '3개월') {
    start.setMonth(today.getMonth() - 3);
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(today),
  };
};

const getStatusValue = (status) => {
  const statusMap = {
    전체: '',
    대기중: 'REQUESTED',
    접수완료: 'ACCEPTED',
    배송중: 'SHIPPING',
    배송완료: 'DELIVERED',
  };

  return statusMap[status] || '';
};

  // 검색
  const fetchSearch = async () => {
    console.log('검색어:', keyword);
    fetchOrderList(keyword);
  };

  // 검색어 입력
  const handleKeywordChange = useCallback((e) => {
    setKeyword(e.target.value);
  }, []);

  // 검색 초기화
  const reset = async () => {
  setKeyword('');
  setFilterStatus('전체');
  setDateRange('7일');

  await fetchOrderList('', '전체', '7일');
};
  // const reset = async () => {
  //   setKeyword('');
  //   await fetchOrderList('');
  // }

  // useEffect(() => {
  //   fetchOrderList('');
  // }, [])
  useEffect(() => {
  fetchOrderList('', '전체', '7일');
}, []);

  

  const fetchOrderList = async (
  searchKeyword = keyword,
  nextStatus = filterStatus,
  nextDateRange = dateRange
) => {
  try {
    const storeSeq = Number(localStorage.getItem('storeSeq'));

    if (!storeSeq) {
      console.log('storeSeq 없음');
      setOrders([]);
      return;
    }

    const { startDate, endDate } = getDateRange(nextDateRange);
    const status = getStatusValue(nextStatus);

    const data = await orderList(
      storeSeq,
      searchKeyword,
      status,
      startDate,
      endDate
    );

    console.log('발주 목록 조회 조건:', {
      storeSeq,
      searchKeyword,
      status,
      startDate,
      endDate,
    });



    console.log('발주 목록 조회 결과:', data);

    setOrders(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('발주 목록 조회 실패:', error);
    setOrders([]);
  }
};
//   const fetchOrderList = async (searchKeyword = '') => {
//   try {
//     const storeSeq = Number(localStorage.getItem('storeSeq'));

//     if (!storeSeq) {
//       console.log('storeSeq 없음');
//       setOrders([]);
//       return;
//     }

//     const data = await orderList(storeSeq, searchKeyword);

//     console.log('발주 목록 조회 storeSeq:', storeSeq);
//     console.log('발주 목록 조회 결과:', data);

//     setOrders(Array.isArray(data) ? data : []);
//   } catch (error) {
//     console.error('발주 목록 조회 실패:', error);
//     setOrders([]);
//   }
// };

  // 필터링 로직
  // const filteredOrders = orders.filter((order) => {
  //   const statusMatch = filterStatus === '전체' ? true : order.orderStatus === filterStatus;
  //   // 기간 필터링 로직은 실제 구현 시 날짜 계산 라이브러리(date-fns 등) 사용 권장
  //   return statusMatch;
  // });

  const handleFilterChange = useCallback((status) => {
  setFilterStatus(status);
  fetchOrderList(keyword, status, dateRange);
}, [keyword, dateRange]);
  // const handleFilterChange = useCallback((status) => {
  //   setFilterStatus(status);
  // }, []);

  const handleDateRangeChange = useCallback((range) => {
  setDateRange(range);
  fetchOrderList(keyword, filterStatus, range);
}, [keyword, filterStatus]);
  // const handleDateRangeChange = useCallback((range) => {
  //   setDateRange(range);
  // }, []);

    return {
    orders,
    setOrders,
    filterStatus,
    dateRange,
    handleFilterChange,
    handleDateRangeChange,
    fetchSearch,
    keyword,
    handleKeywordChange,
    reset
  };
};
