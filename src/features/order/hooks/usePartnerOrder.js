import { useState, useEffect, useCallback } from 'react';
import { fetchPartnerOrders, fetchPartnerOrderDetail, webSocketMe, updatePartnerOrderStatus } from '../../../apis/orderApi';

/**
 * [거래처용 발주 관리 커스텀 훅]
 * 초보자 가이드: 이 훅은 PartnerOrderPage에서 필요한 데이터 관리(목록 조회, 상세 조회, 필터링 등)를 전담합니다.
 */
export const usePartnerOrder = () => {
  const [allOrders, setAllOrders] = useState([]); // 전체 발주 목록 (통계용)
  const [filteredOrders, setFilteredOrders] = useState([]); // 필터링된 발주 목록 (테이블용)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]); 
  const [selectedOrder, setSelectedOrder] = useState(null); // 선택된 발주서(가게 정보, 메모 등)
  const [loading, setLoading] = useState(false);
  const [userSeq, setUserSeq] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // 필터 및 검색 상태
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('전체');

  // 1. 내 정보(userSeq) 가져오기
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await webSocketMe(); 
        setUserSeq(data);
      } catch (err) {
        console.error('사용자 정보 조회 실패:', err);
      }
    };
    getUserInfo();
  }, []);

  // 2. 전체 발주 목록 조회 (최초 1회 또는 강제 새로고침 시)
  const fetchAllOrders = useCallback(async () => {
    if (!userSeq) return;
    setLoading(true);
    try {
      const data = await fetchPartnerOrders(userSeq, '', ''); // 전체를 가져오기 위해 빈값 전송
      setAllOrders(data);
      setFilteredOrders(data); // 초기값은 전체
    } catch (err) {
      console.error('발주 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [userSeq]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // 3. 로컬 필터링 로직 (상태나 키워드가 바뀔 때마다 실행)
  useEffect(() => {
    let result = [...allOrders];

    // 상태 필터링
    if (filterStatus !== '전체') {
      const statusMap = {
        '발주신청': 'REQUESTED',
        '준비중': 'PREPARING',
        '배송중': 'SHIPPING',
        '배송완료': 'DELIVERED'
      };
      const targetStatus = statusMap[filterStatus];
      // '준비중' 선택 시 'ACCEPTED'(접수완료)와 'PREPARING'(상품준비) 둘 다 보여주게 설정 가능
      if (filterStatus === '준비중') {
        result = result.filter(o => o.status === 'PREPARING' || o.status === 'ACCEPTED');
      } else {
        result = result.filter(o => o.status === targetStatus);
      }
    }

    // 키워드 검색 (발주번호 또는 업체명)
    if (keyword.trim() !== '') {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(o => 
        o.orderNo.toLowerCase().includes(lowerKeyword) || 
        o.companyName.toLowerCase().includes(lowerKeyword)
      );
    }

    setFilteredOrders(result);
  }, [allOrders, keyword, filterStatus]);

  // 4. 핸들러 함수들
  const handleKeywordChange = (e) => setKeyword(e.target.value);
  const handleFilterChange = (status) => setFilterStatus(status);
  
  const openOrderDetail = async (orderSeq) => {
    try {
      const data = await fetchPartnerOrderDetail(orderSeq);
      setSelectedOrderDetails(data);
      
      // 전체 목록에서 클릭한 발주서의 정보(가게명, 주소, 메모 등) 찾기
      const order = allOrders.find(o => o.orderSeq === orderSeq);
      setSelectedOrder(order);
      
      setIsModalOpen(true);
    } catch (err) {
      console.error('상세 내역 조회 실패:', err);
      alert('상세 내역을 불러오는데 실패했습니다.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderDetails([]);
    setSelectedOrder(null);
  };

  // 5. 발주 상태 변경 함수
  const handleStatusChange = async (orderSeq, newStatus) => {
    try {
      await updatePartnerOrderStatus(orderSeq, newStatus);
      // 성공 시 전체 목록을 다시 서버에서 불러와서 동기화합니다.
      fetchAllOrders();
    } catch (err) {
      console.error('상태 변경 실패:', err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  return {
    orders: filteredOrders, // UI에는 필터링된 목록을 전달
    allOrders, // 통계 계산용으로 전체 목록 전달
    loading,
    keyword,
    filterStatus,
    handleKeywordChange,
    handleFilterChange,
    fetchOrders: fetchAllOrders, // 버튼 클릭 시 새로고침 용도
    openOrderDetail,
    isModalOpen,
    closeModal,
    selectedOrderDetails,
    selectedOrder, // 선택된 발주서 정보 노출
    handleStatusChange,
  };
};
