import { useState } from 'react';

/**
 * @file useBusinessSmartNotification.js
 * @description '사업자' 전용 스마트 알림 설정을 관리하는 커스텀 훅입니다.
 */
export const useBusinessSmartNotification = () => {
  // 알림 설정 상태 (기본값)
  const [settings, setSettings] = useState({
    pushEnabled: true,      // 전체 푸시 알림
    orderAlert: true,       // 발주 상태 알림
    chatAlert: true,        // 거래처 채팅 알림
    stockAlert: true,       // 재고 부족 알림
    marketingAlert: false,  // 이벤트 및 혜택 알림
    nightAlert: true,       // 야간 수신 제한 (21시~08시)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 스위치 토글 함수
  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 설정 저장 함수
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // 💡 실제 운영 환경에서는 백엔드 API를 호출하여 저장합니다.
      console.log('[Business] 알림 설정 저장 중:', settings);
      
      // 사용자 체감을 위해 가상 딜레이를 줍니다.
      await new Promise(resolve => setTimeout(resolve, 800));
      
      alert('스마트 알림 설정이 안전하게 저장되었습니다.');
    } catch (err) {
      console.error('알림 설정 저장 실패:', err);
      alert('설정 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    settings,
    isSubmitting,
    toggleSetting,
    handleSave,
  };
};
