import axiosInstance from './axiosConfig';

/**
 * @file groupBuyApi.js
 * @description 공동구매(Group Buy) 관련 API 통신 함수 모음
 */

const GROUP_BUY_BASE_URL = '/api/group-buys';

export const groupBuyApi = {
  /**
   * 공동구매 목록 조회
   * @param {string} filter - 'all' 또는 'my'
   */
  getGroupBuys: async (filter = 'all') => {
    const response = await axiosInstance.get(GROUP_BUY_BASE_URL, {
      params: { filter },
    });
    return response.data;
  },

  /**
   * 내가 참여한 공동구매 목록 조회 (결제 상태, 배송 상태 포함)
   */
  getParticipatedGroupBuys: async () => {
    const response = await axiosInstance.get(`${GROUP_BUY_BASE_URL}/participated`);
    return response.data;
  },

  /**
   * 나의 참여그룹 수 조회
   */
  getParticipatedCount: async () => {
    const response = await axiosInstance.get(`${GROUP_BUY_BASE_URL}/participated/count`);
    return response.data;
  },

  /**
   * 내가 참여한 그룹 중 상태가 COMPLETED인 그룹 수 조회
   */
  getCompletedCount: async () => {
    const response = await axiosInstance.get(`${GROUP_BUY_BASE_URL}/completed/count`);
    return response.data;
  },

  /**
   * 내가 참여한 그룹 중 상태가 COMPLETED인 그룹 리스트 조회
   */
  getCompletedGroupBuys: async () => {
    const response = await axiosInstance.get(`${GROUP_BUY_BASE_URL}/completed`);
    return response.data;
  },

  /**
   * 공동구매 상세 조회
   * @param {number} seq - 공동구매 시퀀스 번호
   */
  getGroupBuyDetail: async (seq) => {
    const response = await axiosInstance.get(`${GROUP_BUY_BASE_URL}/${seq}`);
    return response.data;
  },

  /**
   * 공동구매 그룹 생성 (PARTNER 전용)
   * @param {Object} data - 공동구매 생성 데이터
   */
  createGroupBuy: async (data) => {
    const response = await axiosInstance.post(GROUP_BUY_BASE_URL, data);
    return response.data;
  },

  /**
   * 공동구매 참여하기 (BUSINESS 전용)
   * @param {number} seq - 공동구매 시퀀스 번호
   */
  joinGroupBuy: async (seq) => {
    const response = await axiosInstance.post(`${GROUP_BUY_BASE_URL}/${seq}/join`);
    return response.data;
  },

  /**
   * 공동구매 상태 변경 (PARTNER 전용)
   * @param {number} seq - 공동구매 시퀀스 번호
   * @param {string} status - 변경할 상태
   */
  updateGroupBuyStatus: async (seq, status) => {
    const response = await axiosInstance.patch(`${GROUP_BUY_BASE_URL}/${seq}/status`, { status });
    return response.data;
  },

  /**
   * 공동구매 참여자 리스트 조회
   * @param {number} seq - 공동구매 시퀀스 번호
   */
  getParticipants: async (seq) => {
    const response = await axiosInstance.get(`${GROUP_BUY_BASE_URL}/${seq}/participants`);
    return response.data;
  },


// 1. 공동구매 참여 이력 조회
 getGroupBuyHistory : async (storeSeq) => {
  const response = await axiosInstance.get('/api/group-buys/history', {
    params: { storeSeq }
  });
  return response.data;
},
}