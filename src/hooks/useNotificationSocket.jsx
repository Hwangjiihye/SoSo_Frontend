import React, { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useNotificationStore from '../store/notificationStore';
import { toast } from 'react-toastify';

/**
 * @file useNotificationSocket.jsx
 * @description WebSocket을 통해 실시간 알림을 수신하고 토스트 팝업을 띄우는 커스텀 훅
 */
const useNotificationSocket = (userSeq) => {
  const { addNotification } = useNotificationStore();
  const stompClient = useRef(null);

  useEffect(() => {
    if (!userSeq) return;

    const socket = new SockJS('http://localhost/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str); // 디버깅 필요 시 활성화
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = (frame) => {
      // console.log('Connected: ' + frame);

      // 사용자 전용 채널 구독 (/sub/notifications/{userSeq})
      stompClient.current.subscribe(`/sub/notifications/${userSeq}`, (message) => {
        try {
          const notification = JSON.parse(message.body);
          
          // 1. 전역 상태 업데이트 (목록 갱신)
          addNotification(notification);

          // 2. 실시간 토스트 알림 띄우기
          toast.info(
            <div>
              <div className="font-bold text-sm mb-1">{notification.title}</div>
              <div className="text-xs leading-relaxed">{notification.message}</div>
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
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

    stompClient.current.onStompError = (frame) => {
      console.error('STOMP Broker Error: ' + frame.headers['message']);
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [userSeq, addNotification]);

  return stompClient.current;
};

export default useNotificationSocket;
