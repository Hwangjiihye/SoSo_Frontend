import { useState, useEffect } from 'react';

/**
 * @file useSettlement.js
 * @description 정산 관련 비즈니스 로직 및 데이터를 관리하는 커스텀 훅입니다.
 * (payment 도메인으로 통합됨)
 */
export const useSettlement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settlementData, setSettlementData] = useState({
    summary: {
      totalSales: 15420000,
      expectedSettlement: 13850000,
      completedSettlement: 12000000,
      fees: 1570000,
    },
    monthlySales: [
      { month: '1월', amount: 12000000 },
      { month: '2월', amount: 15000000 },
      { month: '3월', amount: 13000000 },
      { month: '4월', amount: 18000000 },
      { month: '5월', amount: 21000000 },
      { month: '6월', amount: 15420000 },
    ],
    history: [
      { id: 1, date: '2024-06-10', type: '카드결제', amount: 150000, status: '정산완료', store: '소소마을 1호점' },
      { id: 2, date: '2024-06-09', type: '계좌이체', amount: 230000, status: '정산대기', store: '소소마을 1호점' },
      { id: 3, date: '2024-06-08', type: '카드결제', amount: 85000, status: '정산완료', store: '소소마을 1호점' },
      { id: 4, date: '2024-06-07', type: '카드결제', amount: 320000, status: '정산완료', store: '소소마을 1호점' },
      { id: 5, date: '2024-06-06', type: '현금', amount: 45000, status: '정산완료', store: '소소마을 1호점' },
    ]
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    isLoading,
    settlementData,
    formatCurrency: (value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value).replace('₩', '') + '원',
  };
};
