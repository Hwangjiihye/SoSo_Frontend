import { useState, useEffect, useCallback } from 'react';
// import { getStockAutoRules, updateStockAutoRule, getStockNotifications, getStockAutoHistory } from '../../../apis/stockApi';

/**
 * @file useStockStatus.js
 * @description 재고 상태 관리 페이지(자동 규칙, 타임라인, 이력) 비즈니스 로직
 */
export const useStockStatus = () => {
  const [autoRules, setAutoRules] = useState([
    { 
      id: 'auto_sync', 
      title: '주문 · 거래 상태 자동 재고 연동', 
      description: '발주 완료 및 거래처 출고 확정 시, 실시간으로 입출고 수량이 자동 반영됩니다.', 
      enabled: true 
    },
    { 
      id: 'auto_expiry', 
      title: '유통기한 만료 시 자동 차감', 
      description: '만료일 경과 시 해당 품목의 실물 배치를 폐기하고 장부 수량을 0으로 처리합니다.', 
      enabled: true 
    },
    { 
      id: 'alert_expiry_soon', 
      title: '소비기한 임박 사전 알림 (D-7)', 
      description: '소비기한이 7일 이하로 남은 품목 발생 시, 매일 아침 폐기 방지 경고 알림을 보냅니다.', 
      enabled: true 
    },
    { 
      id: 'alert_low_stock', 
      title: '안전 재고 미달 시 즉시 경고', 
      description: '현재 재고가 안전 재고 미만으로 떨어지면 알림을 띄우고 메인 화면에 붉은색으로 강조합니다.', 
      enabled: true 
    },
  ]);

  const [timeline, setTimeline] = useState([
    { id: 1, type: 'CRITICAL', title: '우유 품절 처리됨', message: '유통기한 만료로 자동 차감, 발주 필요', time: '14:32 방금', dotColor: 'bg-rose-500' },
    { id: 2, type: 'WARNING', title: '대파 재고 부족', message: '현재 3단 - 안전 재고(10단) 미만', time: '11:20 오늘', dotColor: 'bg-amber-500' },
    { id: 3, type: 'CRITICAL', title: '닭가슴살 유통기한 D-2', message: '2026-05-26 만료 예정, 확인 필요', time: '09:00 오늘', dotColor: 'bg-rose-500' },
    { id: 4, type: 'INFO', title: '한우 등심 입고 완료', message: '발주 완료 → 10kg 자동 추가', time: '09:15 어제', dotColor: 'bg-blue-500' },
    { id: 5, type: 'INFO', title: '식용유 재고 조정', message: '재고 실사 결과 반영 (+1병)', time: '18:20 05-22', dotColor: 'bg-emerald-500' },
  ]);

  const [history, setHistory] = useState([
    { 
      id: 1, 
      createdAt: '2026-05-24 14:32:10', 
      transactionType: 'OUTBOUND', 
      detailStockName: '국내산 닭가슴살 1kg', 
      changeQuantity: -2.0, 
      currentTotalStock: 5.5, 
      reason: '거래처 출고', 
      memo: '자동 차감 규칙 적용' 
    },
    { 
      id: 2, 
      createdAt: '2026-05-24 11:00:05', 
      transactionType: 'ADJUST', 
      detailStockName: '서울우유 1L', 
      changeQuantity: -5.0, 
      currentTotalStock: 0, 
      reason: '유통기한 만료', 
      memo: '만료 자동 폐기 처리' 
    },
    { 
      id: 3, 
      createdAt: '2026-05-23 09:15:30', 
      transactionType: 'INCOMING', 
      detailStockName: '한우 등심 A++ 5kg', 
      changeQuantity: 10.0, 
      currentTotalStock: 12.5, 
      reason: '발주 완료', 
      memo: '주문 번호 #ORD-12345' 
    },
  ]);

  const toggleRule = (id) => {
    setAutoRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const fetchStatusData = useCallback(async () => {
    // API 연동 시 실제 데이터 로드 로직
  }, []);

  useEffect(() => {
    fetchStatusData();
  }, [fetchStatusData]);

  return {
    autoRules,
    timeline,
    history,
    toggleRule,
    fetchStatusData
  };
};
