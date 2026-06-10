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
      
      // 더미 데이터 (a4.png 구조 반영: 품목번호, 품목명, 규격, 단위, 매입가, 매출가, 현재고, 상태)
      const dummyData = [
        { id: 'S00001', name: '냉동 삼겹살', spec: '1kg', unit: '팩', purchasePrice: 12000, salesPrice: 18000, currentStock: 45, status: 'NORMAL' },
        { id: 'S00002', name: '신선 대파', spec: '단', unit: '개', purchasePrice: 1500, salesPrice: 2500, currentStock: 5, status: 'LACK' },
        { id: 'S00003', name: '참기름', spec: '500ml', unit: '병', purchasePrice: 8000, salesPrice: 12000, currentStock: 0, status: 'OUT_OF_STOCK' },
        { id: 'S00004', name: '백설탕', spec: '3kg', unit: '포', purchasePrice: 4500, salesPrice: 6500, currentStock: 120, status: 'NORMAL' },
        { id: 'S00005', name: '진간장', spec: '1.8L', unit: '통', purchasePrice: 5500, salesPrice: 8000, currentStock: 15, status: 'NORMAL' },
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
