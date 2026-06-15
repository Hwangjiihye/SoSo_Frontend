import { useState, useEffect, useCallback } from 'react';
// import { getStockAutoRules, updateStockAutoRule, getStockNotifications, getStockAutoHistory } from '../../../apis/stockApi';

/**
 * @file useStockStatus.js
 * @description 재고 상태 관리 페이지(자동 규칙, 알림, 이력) 비즈니스 로직
 */
export const useStockStatus = () => {
  const [autoRules, setAutoRules] = useState([
    { id: 'auto_add', title: '발주 완료 시 재고 자동 추가', description: "발주 상태가 '완료'로 변경될 때 입고 수량 자동 변경", enabled: true },
    { id: 'auto_subtract', title: '거래처 출고 시 재고 자동 차감', description: '출고 처리 완료 시 해당 수량 실시간 차감', enabled: true },
    { id: 'auto_expiry', title: '유통기한 만료 시 자동 차감', description: '만료일 경과 시 해당 품목 수량을 0으로 처리', enabled: true },
    { id: 'auto_order', title: '부족 시 자동 발주 요청', description: '안전 재고 미만 시 등록된 거래처로 자동 발주', enabled: false },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'CRITICAL', title: '우유 품절 처리됨', message: '유통기한 만료로 자동 차감, 발주 필요', time: '14:32 방금', dotColor: 'bg-rose-500' },
    { id: 2, type: 'WARNING', title: '대파 재고 부족', message: '현재 3단 - 안전 재고(10단) 미만', time: '11:20 오늘', dotColor: 'bg-amber-500' },
    { id: 3, type: 'CRITICAL', title: '닭가슴살 유통기한 D-2', message: '2026-05-26 만료 예정, 확인 필요', time: '09:00 오늘', dotColor: 'bg-rose-500' },
    { id: 4, type: 'INFO', title: '한우 등심 입고 완료', message: '발주 완료 → 10kg 자동 추가', time: '09:15 어제', dotColor: 'bg-blue-500' },
  ]);

  const [history, setHistory] = useState([
    { id: 1, date: '05-24 14:32', item: '닭가슴살', type: '차감', change: '-2.0kg', finalStock: '5.5kg', reason: '거래처 출고', isNegative: true },
    { id: 2, date: '05-24 11:00', item: '우유', type: '차감', change: '-5.0L', finalStock: '0L', reason: '유통기한 만료', isNegative: true },
    { id: 3, date: '05-23 09:15', item: '한우등심', type: '추가', change: '+10.0kg', finalStock: '12.5kg', reason: '발주 완료', isNegative: false },
  ]);

  const toggleRule = (id) => {
    setAutoRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
    // TODO: API 연동하여 서버에 규칙 변경 저장
    // updateStockAutoRule(id, !currentEnabled);
  };

  const fetchStatusData = useCallback(async () => {
    // API 연동 시 실제 데이터 로드 로직
    /*
    try {
      const [rules, notes, hist] = await Promise.all([
        getStockAutoRules(),
        getStockNotifications(),
        getStockAutoHistory()
      ]);
      setAutoRules(rules);
      setNotifications(notes);
      setHistory(hist);
    } catch (err) {
      console.error(err);
    }
    */
  }, []);

  useEffect(() => {
    fetchStatusData();
  }, [fetchStatusData]);

  return {
    autoRules,
    notifications,
    history,
    toggleRule,
    fetchStatusData
  };
};
