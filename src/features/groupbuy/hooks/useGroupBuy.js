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
      const data = await groupBuyApi.getGroupBuys(filter);
      // 데이터 변환 및 기본값 설정
      const formattedData = data.map(item => ({
        ...item,
        is_joined: item.is_joined || false,
        d_day: item.d_day || 'D-Day',
        status: item.status || '모집중',
        category: item.category || '기타'
      }));
      setGroupBuys(formattedData);
    } catch (error) {
      console.error('Failed to fetch group buys:', error);
      // 개발용 목 데이터
      setGroupBuys([
        {
          seq: 1,
          title: '한우 등심 (1+ 등급, 10kg)',
          supplier_name: '상생 농장',
          deadline: '2024-06-30',
          d_day: 'D-12',
          current_participants: 15,
          target_participants: 20,
          price: 380000,
          status: '모집중',
          category: '육류',
          is_joined: false
        },
        {
          seq: 2,
          title: '친환경 양파 (20kg 망)',
          supplier_name: '산지 직송',
          deadline: '2024-06-20',
          d_day: 'D-2',
          current_participants: 30,
          target_participants: 30,
          price: 28000,
          status: '모집완료',
          category: '채소류',
          is_joined: true
        }
      ]);
    } finally {
      setIsLoading(false);
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
    if (statusFilter === '전체') return true;
    return item.status === statusFilter;
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
