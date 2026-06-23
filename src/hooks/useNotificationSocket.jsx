import React, { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useNotificationStore from '../store/notificationStore';
import authStore from '../store/authStore';
import { getRecentNotifications } from '../apis/stockApi';
import { toast } from 'react-toastify';

/**
 * @file useNotificationSocket.jsx
 * @description WebSocket을 통해 실시간 알림을 수신하고 토스트 팝업을 띄우는 커스텀 훅 (멀티프로필/매장전환 완벽 대응)
 */
const useNotificationSocket = () => {
  const selectedStoreSeq = authStore((state) => state.selectedStoreSeq);
  const { setNotifications, addNotification } = useNotificationStore();
  
  const stompClient = useRef(null);
  const subscriptionRef = useRef(null); // 매장 전환 시 해제를 위한 구독 레퍼런스

  // 1. 매장 전환 또는 로그인 상태 감지 시 최근 3일 알림 로드 및 웹소켓 구독 갱신
  useEffect(() => {
    if (!selectedStoreSeq) return;

    // 최근 3일 알림 API 조회 및 스토어 세팅
    const fetchRecentAlarms = async () => {
      try {
        const data = await getRecentNotifications(selectedStoreSeq);
        setNotifications(data || []);
      } catch (err) {
        console.error('최근 알림 로드 실패:', err);
      }
    };
    fetchRecentAlarms();

    // 웹소켓 클라이언트 생성 (기존 연결이 없을 때만 연결 가동)
    if (!stompClient.current) {
      const socket = new SockJS(import.meta.env.VITE_API_BASE_URL ,'/ws', null, {
    transports: ['websocket']
});
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          // console.log(str); 
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.current.onConnect = (frame) => {
        // 커넥션 성공 시 구독 실행
        subscribeToStoreTopic(selectedStoreSeq);
      };

      stompClient.current.onStompError = (frame) => {
        console.error('STOMP Broker Error: ' + frame.headers['message']);
      };

      stompClient.current.activate();
    } else if (stompClient.current.connected) {
      // 이미 웹소켓이 열려 있다면 기존 토픽 구독 해제 후 새 토픽 구독
      subscribeToStoreTopic(selectedStoreSeq);
    }

    return () => {
      // 컴포넌트 언마운트 시에만 해제 (매장 전환 시에는 이전 구독만 해제)
    };
  }, [selectedStoreSeq]);

  // 특정 매장 토픽 구독 함수
  const subscribeToStoreTopic = (storeSeq) => {
    if (!stompClient.current || !stompClient.current.connected) return;

    // 1. 기존 구독 해제
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // 2. 신규 매장 채널 구독 (/sub/store/{storeSeq}/notifications)
    const topic = `/sub/store/${storeSeq}/notifications`;
    subscriptionRef.current = stompClient.current.subscribe(topic, (message) => {
      try {
        const notification = JSON.parse(message.body);
        
        // 전역 상태 업데이트 (최근 3일 리스트 맨 앞에 추가)
        addNotification(notification);

        // 실시간 토스트 알림 띄우기 (오른쪽 하단, 3초 노출)
        toast.info(
          <div>
            <div className="font-bold text-sm mb-1">{notification.title}</div>
            <div className="text-xs leading-relaxed">{notification.message}</div>
          </div>,
          {
            position: "bottom-right",
            autoClose: 3000, // 3초 노출 후 닫힘
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } catch (e) {
        console.error("알림 메시지 파싱 에러:", e);
      }
    });
  };

  // 전체 소켓 연결 종료 정리 (App 언마운트 시)
  useEffect(() => {
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        stompClient.current = null;
      }
    };
  }, []);

  return stompClient.current;
};

export default useNotificationSocket;
