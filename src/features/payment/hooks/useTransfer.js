import { useState, useEffect } from 'react';

/**
 * @file useTransfer.js
 * @description 이체 관리 관련 비즈니스 로직 및 데이터를 관리하는 커스텀 훅입니다.
 */
export const useTransfer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [transferData, setTransferData] = useState({
    accounts: [
      {
        id: 1,
        bankName: '신한은행',
        accountNumber: '110-123-456789',
        balance: 5420000,
        isMain: true,
      }
    ],
    recentTransfers: [
      { id: 1, date: '2024-06-10 14:30', recipient: '김철수 (식자재)', amount: 150000, status: '이체완료' },
      { id: 2, date: '2024-06-09 11:20', recipient: '박영희 (임대료)', amount: 2300000, status: '이체완료' },
      { id: 3, date: '2024-06-08 16:45', recipient: '이민호 (주류)', amount: 850000, status: '이체완료' },
      { id: 4, date: '2024-06-07 09:15', recipient: '최지우 (야채)', amount: 320000, status: '이체완료' },
      { id: 5, date: '2024-06-06 18:00', recipient: '정해인 (고기)', amount: 450000, status: '이체완료' },
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
    transferData,
    formatCurrency: (value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value).replace('₩', '') + '원',
  };
};
