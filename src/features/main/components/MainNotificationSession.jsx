import React from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../../store/notificationStore';
import authStore from '../../../store/authStore';
import { markNotificationAsRead } from '../../../apis/stockApi';

/**
 * @file MainNotificationSession.jsx
 * @description 메인 대시보드 전용 최근 3일 이슈(알림) 모듈 컴포넌트
 * 최대 5개 노출 후 초과 시 스크롤바 생성 및 타입별 비주얼 테마 제공 (멀티프로필/권한 분기 지원)
 */
const MainNotificationSession = () => {
  const { notifications, markAsRead } = useNotificationStore();
  const userType = authStore((state) => state.user_type); // "BUSINESS" 또는 "PARTNER"
  const navigate = useNavigate();

  // 알림 클릭 시 읽음 처리 및 관련 페이지 이동
  const handleNotificationClick = async (noti) => {
    try {
      // 1. 읽지 않은 알림만 API 전송 및 스토어 갱신
      if (noti.isRead === 'N') {
        await markNotificationAsRead(noti.notificationSeq);
        markAsRead(noti.notificationSeq);
      }

      // 2. 알림 타입별 라우팅 이동 (유저 타입 분기 적용)
      const isPartner = userType === 'PARTNER';

      if (noti.type === 'SAFETY_LACK' || noti.type === 'EXPIRY_IMMINENT') {
        navigate(isPartner ? '/lookup/stock' : '/stock'); // 파트너: 재고조회 / 소상공인: 재고관리
      } else if (noti.type === 'NEW_GROUPBUY') {
        navigate('/community'); // 공동구매
      } else if (noti.type === 'NEW_ORDER') {
        navigate(isPartner ? '/lookup/orders' : '/orders'); // 파트너: 수주조회 / 소상공인: 발주서
      } else if (noti.type === 'LATE_PAYMENT') {
        navigate(isPartner ? '/lookup/business-logs' : '/business-mypage'); // 파트너: 장부기록 / 소상공인: 마이페이지
      }
    } catch (err) {
      console.error('알림 읽음 처리 및 이동 중 오류:', err);
    }
  };

  // [초보자 가이드 - 역할별 실시간 알림 필터링]
  // 목적: 로그인한 사용자의 유형(userType)에 맞춰 대시보드 화면에 필요한 알림만 걸러서 보여줍니다.
  const filteredNotifications = notifications.filter((noti) => {
    // 만약 로그인한 사람이 'PARTNER'(공급/거래처 사장님)라면
    if (userType === 'PARTNER') {
      // 거래처 사장님은 신규 발주서(NEW_ORDER), 안전 재고(SAFETY_LACK), 업장 미수금(LATE_PAYMENT) 알림만 수신합니다.
      return ['NEW_ORDER', 'SAFETY_LACK', 'LATE_PAYMENT'].includes(noti.type);
    }
    // 일반 소상공인 사장님(BUSINESS)은 임박 재고, 공동구매 등 모든 유형의 알림을 전부 보여줍니다.
    return true;
  });

  // 타입별 카드 스타일 및 아이콘 매핑
  const getTypeStyles = (type) => {
    const isPartner = userType === 'PARTNER';

    switch (type) {
      case 'SAFETY_LACK':
        return {
          icon: '⚠️',
          bgClass: 'bg-red-50 hover:bg-red-100 border-red-200',
          textColor: 'text-red-800',
          badgeText: '안전 재고' // 파트너/일반 공통
        };
      case 'EXPIRY_IMMINENT':
        return {
          icon: '⏰',
          bgClass: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
          textColor: 'text-amber-800',
          badgeText: '임박 재고'
        };
      case 'NEW_GROUPBUY':
        return {
          icon: '📢',
          bgClass: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
          textColor: 'text-blue-800',
          badgeText: '공동 구매'
        };
      case 'NEW_ORDER':
        return {
          icon: '📦',
          bgClass: 'bg-violet-50 hover:bg-violet-100 border-violet-200',
          textColor: 'text-violet-800',
          badgeText: isPartner ? '신규 발주서' : '신규 주문'
        };
      case 'LATE_PAYMENT':
        return {
          icon: '💸',
          bgClass: 'bg-rose-50 hover:bg-rose-100 border-rose-200',
          textColor: 'text-rose-800',
          badgeText: isPartner ? '업장 미수금' : '미수금 연체'
        };
      default:
        return {
          icon: '🔔',
          bgClass: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
          textColor: 'text-gray-800',
          badgeText: '알림'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>🔔</span> 최근 3일간의 실시간 알림
        </h3>
        <span className="text-xs text-gray-500 font-medium">
          최근 발생 이슈 리스트
        </span>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2 flex-grow">
          <span className="text-3xl">🕊️</span>
          <p className="text-sm font-medium">최근 3일간 발생한 특이사항이 없습니다.</p>
        </div>
      ) : (
        // 알림이 5개 이상이면 스크롤 생성 (max-h로 조절, 1개당 약 80px 높이 기준)
        <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin flex-grow">
          {filteredNotifications.map((noti) => {
            const styles = getTypeStyles(noti.type);
            const isRead = noti.isRead === 'Y';
            const formattedTime = new Date(noti.createdAt).toLocaleString('ko-KR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={noti.notificationSeq}
                onClick={() => handleNotificationClick(noti)}
                className={`flex gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isRead ? 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-80' : styles.bgClass
                }`}
              >
                <div className="text-2xl flex items-center justify-center select-none">
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isRead ? 'bg-gray-200 text-gray-600' : 'bg-white shadow-sm'
                    } ${styles.textColor}`}>
                      {styles.badgeText}
                    </span>
                    <span className="text-[10px] text-gray-400 font-light">{formattedTime}</span>
                  </div>
                  <h4 className={`text-xs font-bold truncate ${isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                    {noti.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {noti.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MainNotificationSession;
