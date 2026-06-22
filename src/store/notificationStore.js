import { create } from 'zustand';

/**
 * @file notificationStore.js
 * @description 알림 관련 전역 상태 관리 스토어 (최근 3일 알림 보존 및 실시간 업데이트)
 */
const useNotificationStore = create((set) => ({
  notifications: [],
  
  // API 조회 결과로 알림 리스트 초기 설정
  setNotifications: (list) => set({ notifications: list || [] }),
  
  // 실시간 수신한 알림을 리스트 맨 앞에 추가
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),

  // 특정 알림 읽음 상태로 업데이트
  markAsRead: (notificationSeq) => set((state) => ({
    notifications: state.notifications.map((n) => 
      n.notificationSeq === notificationSeq ? { ...n, isRead: 'Y' } : n
    )
  })),
}));

export default useNotificationStore;
