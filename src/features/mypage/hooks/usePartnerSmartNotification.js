import { useState } from 'react';

/**
 * @file usePartnerSmartNotification.js
 * @description 스마트 알림 설정을 관리하는 커스텀 훅
 */
export const usePartnerSmartNotification = () => {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    orderAlert: true,
    chatAlert: true,
    stockAlert: false,
    marketingAlert: false,
    nightAlert: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // API 연동 시 실제 데이터 전송
      console.log('알림 설정 저장:', settings);
      
      // 가상 딜레이
      await new Promise(resolve => setTimeout(resolve, 800));
      alert('알림 설정이 저장되었습니다.');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
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
