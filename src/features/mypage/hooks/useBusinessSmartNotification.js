import { useState, useEffect, useCallback } from 'react';
import authStore from '../../../store/authStore';
import { getNotificationSettingsApi, updateNotificationSettingsApi } from '../../../apis/memberApi';

/**
 * @file useBusinessSmartNotification.js
 * @description '사업자' 전용 스마트 알림 설정을 관리하는 커스텀 훅입니다.
 */
export const useBusinessSmartNotification = () => {
  const { selectedStoreSeq } = authStore();
  const [settings, setSettings] = useState({
    pushEnabled: true,      // 전체 푸시 알림
    orderAlert: true,       // 발주 상태 알림
    chatAlert: true,        // 거래처 채팅 알림
    stockAlert: true,       // 재고 부족 알림
    marketingAlert: false,  // 이벤트 및 혜택 알림
    nightAlert: true,       // 야간 수신 제한 (21시~08시)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 백엔드 데이터 -> 로컬 훅 상태로 파싱
  const parseSettings = useCallback((data) => {
    const findSetting = (type) => {
      const s = data.settings?.find(item => item.notificationType === type && item.channelType === 'WEB');
      return s ? s.isEnabled === 'Y' : true; // 기본값은 true
    };

    const hasAnyActive = data.alertStockYn === 'Y' || data.alertOrderYn === 'Y';

    return {
      pushEnabled: hasAnyActive,
      orderAlert: data.alertOrderYn === 'Y' && findSetting('ORDER_STATUS'),
      stockAlert: data.alertStockYn === 'Y' && findSetting('STOCK_SHORTAGE'),
      chatAlert: findSetting('CHAT'),
      marketingAlert: findSetting('MARKETING'),
      nightAlert: findSetting('NIGHT_RESTRICTION'),
    };
  }, []);

  // 서버로부터 알림 설정 로드
  useEffect(() => {
    if (!selectedStoreSeq) return;

    const loadSettings = async () => {
      try {
        const data = await getNotificationSettingsApi(selectedStoreSeq);
        setSettings(parseSettings(data));
      } catch (err) {
        console.error('알림 설정을 로드하는데 실패했습니다.', err);
      }
    };

    loadSettings();
  }, [selectedStoreSeq, parseSettings]);

  // 스위치 토글 함수
  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 설정 저장 함수
  const handleSave = async () => {
    if (!selectedStoreSeq) {
      alert('선택된 매장이 없습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 로컬 훅 상태 -> 백엔드 DTO 구조로 직렬화
      const isPushEnabled = settings.pushEnabled;
      const alertStockYn = (isPushEnabled && settings.stockAlert) ? 'Y' : 'N';
      const alertExpiryYn = (isPushEnabled && settings.stockAlert) ? 'Y' : 'N';
      const alertOrderYn = (isPushEnabled && settings.orderAlert) ? 'Y' : 'N';

      const settingsList = [
        { notificationType: 'STOCK_SHORTAGE', channelType: 'WEB', isEnabled: alertStockYn },
        { notificationType: 'EXPIRY_IMMINENT', channelType: 'WEB', isEnabled: alertExpiryYn },
        { notificationType: 'ORDER_STATUS', channelType: 'WEB', isEnabled: alertOrderYn },
        { notificationType: 'CHAT', channelType: 'WEB', isEnabled: (isPushEnabled && settings.chatAlert) ? 'Y' : 'N' },
        { notificationType: 'MARKETING', channelType: 'WEB', isEnabled: (isPushEnabled && settings.marketingAlert) ? 'Y' : 'N' },
        { notificationType: 'NIGHT_RESTRICTION', channelType: 'WEB', isEnabled: (isPushEnabled && settings.nightAlert) ? 'Y' : 'N' },
      ];

      const requestBody = {
        alertStockYn,
        alertExpiryYn,
        alertOrderYn,
        settings: settingsList
      };

      await updateNotificationSettingsApi(selectedStoreSeq, requestBody);
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
