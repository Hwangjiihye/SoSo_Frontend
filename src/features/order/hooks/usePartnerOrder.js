import { useState, useEffect, useCallback } from 'react';
import { fetchPartnerOrders, fetchPartnerOrderDetail, webSocketMe, updatePartnerOrderStatus } from '../../../apis/orderApi';

/**
 * [거래처용 발주 관리 커스텀 훅]
 * 초보자 가이드: 이 훅은 PartnerOrderPage에서 필요한 데이터 관리(목록 조회, 상세 조회, 필터링 등)를 전담합니다.
 */
export const usePartnerOrder = () => {
  const [orders, setOrders] = useState([]); // 발주 목록 저장
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]); // 선택한 발주의 상세 품목
  const [loading, setLoading] = useState(false);
  const [userSeq, setUserSeq] = useState(null); // 현재 로그인한 거래처의 userSeq
  const [isModalOpen, setIsModalOpen] = useState(false); // 상세 보기 모달 상태

  // 1. 내 정보(userSeq) 가져오기
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const data = await webSocketMe(); // 기존 API를 활용해 내 seq 확인
        setUserSeq(data);
      } catch (err) {
        console.error('사용자 정보 조회 실패:', err);
      }
    };
    getUserInfo();
  }, []);

  // 2. 발주 목록 조회 함수
  const fetchOrders = useCallback(async () => {
    if (!userSeq) return;
    setLoading(true);
    try {
      const data = await fetchPartnerOrders(userSeq);
      setOrders(data);
    } catch (err) {
      console.error('발주 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [userSeq]);

  // userSeq가 확인되면 목록을 바로 불러옵니다.
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 3. 특정 발주의 상세 품목 조회 함수
  const openOrderDetail = async (orderSeq) => {
    try {
      const data = await fetchPartnerOrderDetail(orderSeq);
      setSelectedOrderDetails(data);
      setIsModalOpen(true); // 모달 열기
    } catch (err) {
      console.error('상세 내역 조회 실패:', err);
      alert('상세 내역을 불러오는데 실패했습니다.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderDetails([]);
  };

  // 4. 발주 상태 변경 함수
  const handleStatusChange = async (orderSeq, newStatus) => {
    try {
      await updatePartnerOrderStatus(orderSeq, newStatus);
      // 상태 변경 성공 후 목록을 다시 불러옵니다.
      fetchOrders();
    } catch (err) {
      console.error('상태 변경 실패:', err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    openOrderDetail,
    isModalOpen,
    closeModal,
    selectedOrderDetails,
    handleStatusChange, // 상태 변경 함수 추가
  };
};
