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
  const [createdCount, setCreatedCount] = useState(0);
  const [globalStats, setGlobalStats] = useState({ ongoing: 0, delivered: 0 });
  const { user_type, user_seq } = authStore();

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
      isOwner: filter === 'created' || item.userSeq === user_seq || item.isOwner,
      dDay: calculateDDay(item.endDate),
      status: item.status || 'RECRUITING',
      category: item.category || '기타'
    };
  };

  const fetchGroupBuys = useCallback(async () => {
    setIsLoading(true);
    let latestData = [];
    try {
      let data;
      if (filter === 'my') {
        data = await groupBuyApi.getParticipatedGroupBuys();
      } else if (filter === 'completed') {
        const participatedCompleted = await groupBuyApi.getCompletedGroupBuys();
        const createdAll = await groupBuyApi.getCreatedGroupBuys();
        const createdCompleted = createdAll.filter(item => item.status === 'COMPLETED');
        const merged = [...participatedCompleted, ...createdCompleted];
        // 중복 제거 (seq 기준)
        data = merged.filter((v, i, a) => a.findIndex(t => (t.groupBuySeq || t.seq) === (v.groupBuySeq || v.seq)) === i);
      } else if (filter === 'created') {
        data = await groupBuyApi.getCreatedGroupBuys();
      } else {
        data = await groupBuyApi.getGroupBuys(filter);
      }
      // 데이터 변환 및 기본값 설정
      const formattedData = data.map((item, index) => mapGroupBuyData(item, index, filter === 'my' || filter === 'completed' || filter === 'created'));
      latestData = formattedData;
      setGroupBuys(formattedData);
    } catch (error) {
      console.error('Failed to fetch group buys:', error);
      setGroupBuys([]);
      latestData = [];
    } finally {
      setIsLoading(false);
    }

    // 상단바 통계용 참여 개수 조회 (독립적으로 실행)
    try {
      const countData = await groupBuyApi.getParticipatedCount();
      let countVal = 0;
      if (typeof countData === 'object' && countData !== null) {
        countVal = countData.count || 0;
      } else {
        countVal = Number(countData) || 0;
      }
      setMyCount(countVal);
    } catch (countError) {
      console.error('Failed to fetch participated count:', countError);
    }

    // 상단바 통계용 개설 개수 조회
    try {
      const createdData = await groupBuyApi.getCreatedCount();
      let createdVal = 0;
      if (typeof createdData === 'object' && createdData !== null) {
        createdVal = createdData.count || 0;
      } else {
        createdVal = Number(createdData) || 0;
      }
      setCreatedCount(createdVal);
    } catch (error) {
      console.error('Failed to fetch created count:', error);
    }

    // 상단바 통계용 전체 현황 및 완료된 그룹 수 조회
    try {
      const allData = await groupBuyApi.getGroupBuys('all');
      const ongoing = allData.filter(i => i.status === 'RECRUITING').length;
      
      const completedData = await groupBuyApi.getCompletedCount();
      let delivered = 0;
      if (typeof completedData === 'object' && completedData !== null) {
        delivered = completedData.count || 0;
      } else {
        delivered = Number(completedData) || 0;
      }
      
      setGlobalStats({ ongoing, delivered });
    } catch (statsError) {
      console.error('Failed to fetch global stats:', statsError);
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
    if (filter === 'my') {
      if (!item.isJoined || item.status === 'COMPLETED') return false;
    }
    if (filter === 'created') {
      if (item.status === 'COMPLETED') return false;
    }
    if (filter === 'completed' && (!item.isJoined || item.status !== 'COMPLETED')) {
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
    createdCount,
    globalStats,
    user_type,
    handleCreateGroupBuy,
    handleJoinGroupBuy,
    handleUpdateStatus,
    getParticipants,
    refresh: fetchGroupBuys,
  };
};
