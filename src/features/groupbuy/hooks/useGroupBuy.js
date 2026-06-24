import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { groupBuyApi } from '../../../apis/groupBuyApi';
import authStore from '../../../store/authStore';

/**
 * @file useGroupBuy.js
 * @description 공동구매 도메인의 비즈니스 로직을 담당하는 커스텀 훅
 */
export const useGroupBuy = () => {
  const [groupBuys, setGroupBuys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const statusFilter = searchParams.get('status') || '전체';

  const setFilter = useCallback((newFilter) => {
    setSearchParams(prev => {
      prev.set('filter', newFilter);
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const setStatusFilter = useCallback((newStatus) => {
    setSearchParams(prev => {
      prev.set('status', newStatus);
      return prev;
    }, { replace: true });
  }, [setSearchParams]);
  const [myCount, setMyCount] = useState(0);
  const [globalStats, setGlobalStats] = useState({ ongoing: 0, delivered: 0 });
  const { user_type } = authStore();

  const calculateDDay = (endDateStr) => {
    if (!endDateStr) return 'D-Day';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDateStr);
    end.setHours(0, 0, 0, 0);
    
    if (isNaN(end.getTime())) return 'D-Day';
    
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return 'D-Day';
    return `D+${Math.abs(diffDays)}`;
  };

  const mapGroupBuyData = (item, index, isMyFilter) => {
    const seq = item.groupBuySeq || item.seq || index;
    return {
      ...item,
      seq: seq,
      groupBuySeq: seq,
      isJoined: isMyFilter ? true : (item.isJoined || false),
      dDay: calculateDDay(item.endDate),
      status: item.status || 'RECRUITING',
      category: item.category || '기타'
    };
  };

  const fetchGroupBuys = useCallback(async () => {
    setIsLoading(true);
    let latestData = [];
    try {
      const data = filter === 'my' 
        ? await groupBuyApi.getParticipatedGroupBuys()
        : await groupBuyApi.getGroupBuys(filter);
      // 데이터 변환 및 기본값 설정
      const formattedData = data.map((item, index) => mapGroupBuyData(item, index, filter === 'my'));
      latestData = formattedData;
      setGroupBuys(formattedData);
    } catch (error) {
      console.error('Failed to fetch group buys:', error);
      // 개발용 목 데이터
      const mockData = [
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
      ];
      const formattedMock = mockData.map((item, index) => mapGroupBuyData(item, index, false));
      latestData = formattedMock;
      setGroupBuys(formattedMock);
    } finally {
      setIsLoading(false);
    }

    // 상단바 통계용 참여 개수 조회 (독립적으로 실행)
    try {
      const countData = await groupBuyApi.getParticipatedCount();
      // 백엔드가 숫자만 반환할 수도 있고 { count: 5 } 형태일 수도 있으므로 방어 코드 작성
      const countVal = typeof countData === 'number' ? countData : (countData?.count || 0);
      setMyCount(countVal);
    } catch (countError) {
      console.error('Failed to fetch participated count:', countError);
      // 백엔드 API 연결 실패 시 최신 데이터에서 추론하도록 폴백 처리
      setMyCount(latestData.filter(i => i.isJoined).length);
    }

    // 상단바 통계용 전체 현황 및 완료된 그룹 수 조회
    try {
      const allData = await groupBuyApi.getGroupBuys('all');
      const ongoing = allData.filter(i => i.status === 'RECRUITING').length;
      
      const completedData = await groupBuyApi.getCompletedCount();
      const delivered = typeof completedData === 'number' ? completedData : (completedData?.count || 0);
      
      setGlobalStats({ ongoing, delivered });
    } catch (statsError) {
      console.error('Failed to fetch global stats:', statsError);
      const ongoing = latestData.filter(i => i.status === 'RECRUITING').length;
      const delivered = latestData.filter(i => i.status === 'COMPLETED').length;
      setGlobalStats({ ongoing, delivered });
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
    myCount,
    globalStats,
    user_type,
    handleCreateGroupBuy,
    handleJoinGroupBuy,
    handleUpdateStatus,
    getParticipants,
    refresh: fetchGroupBuys,
  };
};
