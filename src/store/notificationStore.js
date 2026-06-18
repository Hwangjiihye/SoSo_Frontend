import { create } from 'zustand';
import axios from 'axios';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  /**
   * 3일 이내의 알림 목록을 가져옵니다.
   */
  fetchNotifications: async (userSeq) => {
    if (!userSeq) return;
    try {
      const response = await axios.get(`http://localhost/api/notifications/${userSeq}`);
      const list = response.data;
      set({ 
        notifications: list,
        unreadCount: list.filter(n => !n.isRead).length
      });
    } catch (error) {
      console.error("알림을 가져오는 중 오류 발생:", error);
    }
  },

  /**
   * 실시간으로 수신된 알림을 목록 최상단에 추가합니다.
   */
  addNotification: (notification) => {
    set((state) => {
      // 3일이 넘은 알림은 걸러내고 최신 50개까지만 유지
      const now = new Date();
      const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));
      
      const filteredList = [notification, ...state.notifications]
        .filter(n => new Date(n.createdAt) >= threeDaysAgo)
        .slice(0, 50);

      return {
        notifications: filteredList,
        unreadCount: filteredList.filter(n => !n.isRead).length
      };
    });
  },

  /**
   * 알림을 읽음 처리합니다.
   */
  markAsRead: async (notificationId) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/${notificationId}/read`);
      set((state) => {
        const updatedList = state.notifications.map(n => 
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        );
        return {
          notifications: updatedList,
          unreadCount: updatedList.filter(n => !n.isRead).length
        };
      });
    } catch (error) {
      console.error("알림 읽음 처리 중 오류 발생:", error);
    }
  }
}));

export default useNotificationStore;
