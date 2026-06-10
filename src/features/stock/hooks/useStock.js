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
      
      // 더미 데이터 (품목명, 카테고리, 현재 수량, 단위, 안전재고, 재고상태)
      const dummyData = [
        { id: 'S00001', name: '냉동 삼겹살', category: '육류', currentStock: 45, unit: '팩', safetyStock: 20, status: 'NORMAL' },
        { id: 'S00002', name: '신선 대파', category: '채소', currentStock: 5, unit: '단', safetyStock: 15, status: 'LACK' },
        { id: 'S00003', name: '참기름', category: '소스/오일', currentStock: 0, unit: '병', safetyStock: 5, status: 'OUT_OF_STOCK' },
        { id: 'S00004', name: '백설탕', category: '가공식품', currentStock: 120, unit: '포', safetyStock: 30, status: 'NORMAL' },
        { id: 'S00005', name: '진간장', category: '소스/오일', currentStock: 15, unit: '통', safetyStock: 10, status: 'NORMAL' },
      ];
      setStocks(dummyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStocks = async (ids) => {
    // 실제 API 연동 시: await Promise.all(ids.map(id => deleteStock(id)));
    setStocks(prev => prev.filter(stock => !ids.includes(stock.id)));
    alert(`${ids.length}개의 항목이 삭제되었습니다.`);
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
    deleteStocks,
  };
};
