import { useState, useEffect, useCallback } from 'react';
import { groupBuyApi } from '../../../apis/groupBuyApi';
import authStore from '../../../store/authStore';

/**
 * @file useGroupBuy.js
 * @description 공동구매 도메인의 비즈니스 로직을 담당하는 커스텀 훅
 */
export const useGroupBuy = () => {
  const [groupBuys, setGroupBuys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'my'
  const [statusFilter, setStatusFilter] = useState('전체'); 
  const { user_type } = authStore();

  const fetchGroupBuys = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = filter === 'my' 
        ? await groupBuyApi.getParticipatedGroupBuys()
        : await groupBuyApi.getGroupBuys(filter);
      // 데이터 변환 및 기본값 설정
      const formattedData = data.map((item, index) => ({
        ...item,
        seq: item.groupBuySeq || item.seq || index, // 프론트엔드 호환성을 위해 유지하되
        groupBuySeq: item.groupBuySeq || item.seq,
        isJoined: filter === 'my' ? true : (item.isJoined || false),
        dDay: item.dDay || 'D-Day',
        status: item.status || 'RECRUITING',
        category: item.category || '기타'
      }));
      setGroupBuys(formattedData);
    } catch (error) {
      console.error('Failed to fetch group buys:', error);
      // 개발용 목 데이터
      setGroupBuys([
        {
          seq: 1,
          groupName: '한우 등심 (1+ 등급, 10kg)',
          partnerName: '상생 농장',
          endDate: '2024-06-30',
          pickupLocation: '(06236) 서울특별시 강남구 테헤란로 123 소소빌딩 1층',
          dDay: 'D-12',
          currentParticipants: 15,
          targetParticipants: 20,
          totalAmount: 380000,
          status: 'RECRUITING',
          category: '육류',
          isJoined: false,
          creatorType: 'PARTNER', // 거래처가 주최한 공동구매
          isOwner: false
        },
        {
          seq: 2,
          groupName: '친환경 양파 (20kg 망)',
          partnerName: '강남 김치찌개 (사업자)',
          endDate: '2024-06-20',
          pickupLocation: '(06666) 서울 서초구 서초대로 456 상가 102호',
          dDay: 'D-2',
          currentParticipants: 30,
          targetParticipants: 30,
          totalAmount: 28000,
          status: 'COMPLETED',
          category: '채소류',
          isJoined: true,
          creatorType: 'BUSINESS', // 사업자가 주최한 공동구매
          isOwner: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }

    // 상단바 통계용 참여 개수 조회 (독립적으로 실행)
    try {
      const countData = await groupBuyApi.getParticipatedCount();
      setMyCount(countData.count || 0);
    } catch (countError) {
      console.error('Failed to fetch participated count:', countError);
      // API 실패 시 현재 상태값(Mock 또는 기존값)에서 임시로 추론
      setMyCount(prev => prev > 0 ? prev : groupBuys.filter(i => i.isJoined).length);
    }
  }, [filter]);

  useEffect(() => {
    fetchGroupBuys();
  }, [fetchGroupBuys]);

  const handleCreateGroupBuy = async (formData) => {
    try {
      await groupBuyApi.createGroupBuy(formData);
      alert('공동구매가 성공적으로 생성되었습니다.');
      fetchGroupBuys();
    } catch (error) {
      console.error('Failed to create group buy:', error);
      alert('공동구매 생성에 실패했습니다.');
    }
  };

  const handleJoinGroupBuy = async (seq) => {
    try {
      await groupBuyApi.joinGroupBuy(seq);
      alert('공동구매 참여가 완료되었습니다.');
      fetchGroupBuys();
    } catch (error) {
      console.error('Failed to join group buy:', error);
      alert('공동구매 참여에 실패했습니다.');
    }
  };

  const handleUpdateStatus = async (seq, status) => {
    try {
      await groupBuyApi.updateGroupBuyStatus(seq, status);
      alert('상태가 변경되었습니다.');
      fetchGroupBuys();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const getParticipants = async (seq) => {
    try {
      return await groupBuyApi.getParticipants(seq);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
      return [];
    }
  };

  const filteredGroupBuys = groupBuys.filter((item) => {
    // 1. 상태(모집중, 완료 등) 필터
    if (statusFilter !== '전체' && item.status !== statusFilter) {
      return false;
    }
    
    // 2. 종류(전체, 참여, 주최자) 필터
    if (filter === 'my' && !item.isJoined) {
      return false;
    }
    if (filter === 'business' && item.creatorType !== 'BUSINESS') {
      return false;
    }
    if (filter === 'partner' && item.creatorType !== 'PARTNER') {
      return false;
    }

    return true;
  });

  return {
    groupBuys: filteredGroupBuys,
    isLoading,
    filter,
    setFilter,
    statusFilter,
    setStatusFilter,
    user_type,
    handleCreateGroupBuy,
    handleJoinGroupBuy,
    handleUpdateStatus,
    getParticipants,
    refresh: fetchGroupBuys,
  };
};
