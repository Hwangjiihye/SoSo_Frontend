import { useState, useEffect } from 'react';

/**
 * @file useTransfer.js
 * @description 이체/카드 관리 화면에서 공통으로 사용할 로딩 상태와 금액 포맷 함수를 관리하는 커스텀 훅입니다.
 */
export const useTransfer = () => {
  // 화면 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 금액 포맷 함수
   * 110 -> 110원
   * 14300 -> 14,300원
   */
  const formatCurrency = (value) => {
    // null, undefined, 빈 값이 들어와도 0원으로 처리
    return `${Number(value || 0).toLocaleString()}원`;
  };

  // 화면 진입 시 짧은 로딩 처리
  useEffect(() => {
    // 로딩 시작
    setIsLoading(true);

    // 0.5초 후 로딩 종료
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // 컴포넌트가 사라질 때 타이머 정리
    return () => clearTimeout(timer);
  }, []);

  return {
    // 로딩 상태
    isLoading,

    // 금액 포맷 함수
    formatCurrency,
  };
};