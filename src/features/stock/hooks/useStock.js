import { useState, useEffect } from 'react';
import { getStockList } from '../../../apis/stockApi';

/**
 * @file useStock.js
 * @description 재고 관리 비즈니스 로직 및 상태 관리 커스텀 훅
 */
export const useStock = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL', // ALL, NORMAL, LACK, OUT_OF_STOCK
    startDate: '',
    endDate: '',
  });

  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      // 실제 API 연동 시에는 아래 주석 해제
      // const data = await getStockList(filters);
      // setStocks(data);
      
      // 더미 데이터 (a3.png 구조 참고)
      const dummyData = [
        { id: 1, name: '냉동 삼겹살', spec: '1kg', currentStock: 45, incoming: 20, outgoing: 10, status: 'NORMAL' },
        { id: 2, name: '신선 대파', spec: '단', currentStock: 5, incoming: 15, outgoing: 8, status: 'LACK' },
        { id: 3, name: '참기름', spec: '500ml', currentStock: 0, incoming: 5, outgoing: 0, status: 'OUT_OF_STOCK' },
        { id: 4, name: '백설탕', spec: '3kg', currentStock: 120, incoming: 0, outgoing: 15, status: 'NORMAL' },
      ];
      setStocks(dummyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchStocks();
  };

  return {
    stocks,
    isLoading,
    error,
    filters,
    handleFilterChange,
    handleSearch,
    fetchStocks,
  };
};
