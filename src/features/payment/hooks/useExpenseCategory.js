import { useState, useEffect } from 'react';

/**
 * @file useExpenseCategory.js
 * @description 비용 카테고리 관리 관련 비즈니스 로직 및 데이터를 관리하는 커스텀 훅입니다.
 */
export const useExpenseCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: '식자재비', count: 124, amount: 4500000, color: 'emerald' },
    { id: 2, name: '임대료', count: 1, amount: 2500000, color: 'blue' },
    { id: 3, name: '인건비', count: 12, amount: 8400000, color: 'orange' },
    { id: 4, name: '공과금', count: 5, amount: 850000, color: 'purple' },
    { id: 5, name: '마케팅비', count: 8, amount: 1200000, color: 'pink' },
    { id: 6, name: '기타운영비', count: 15, amount: 450000, color: 'gray' },
  ]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    isLoading,
    categories,
    formatCurrency: (value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value).replace('₩', '') + '원',
  };
};
