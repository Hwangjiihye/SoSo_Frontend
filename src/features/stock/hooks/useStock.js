import { useState, useEffect, useCallback } from 'react';
import { 
  getStockList, 
  createStockMaster, 
  getStockBatches, 
  getStockHistories,
  deleteStock,
  updateStock
} from '../../../apis/stockApi';

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
    category: 'ALL',
    status: 'ALL', // ALL, NORMAL, LACK, OUT_OF_STOCK
  });

  // 1. 재고 목록 조회
  const fetchStocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getStockList(filters);
      setStocks(data || []);
      setError(null);
    } catch (err) {
      console.error('Fetch Stocks Error:', err);
      setError('재고 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // 2. 품목 마스터 등록 (수량 제외)
  const registerStock = async (stockData) => {
    setIsLoading(true);
    try {
      // stockData: { stockName, category, unit, safetyStock, defaultExpiryDays }
      await createStockMaster(stockData);
      alert('새 품목이 등록되었습니다.');
      await fetchStocks();
      return true;
    } catch (err) {
      console.error('Register Stock Error:', err);
      alert('품목 등록에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 재고 상세 정보 조회 (배치 + 이력)
  const getStockDetailData = async (stockSeq) => {
    try {
      const [batches, histories] = await Promise.all([
        getStockBatches(stockSeq),
        getStockHistories(stockSeq)
      ]);
      return { batches, histories };
    } catch (err) {
      console.error('Get Stock Detail Error:', err);
      throw new Error('상세 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 4. 품목 수정
  const editStock = async (stockId, stockData) => {
    try {
      await updateStock(stockId, stockData);
      alert('품목 정보가 수정되었습니다.');
      await fetchStocks();
      return true;
    } catch (err) {
      console.error('Edit Stock Error:', err);
      alert('수정에 실패했습니다.');
      return false;
    }
  };

  // 5. 품목 삭제 (복수)
  const deleteStocks = async (ids) => {
    if (!window.confirm(`${ids.length}개의 항목을 삭제하시겠습니까?`)) return;
    
    try {
      await Promise.all(ids.map(id => deleteStock(id)));
      alert('삭제되었습니다.');
      await fetchStocks();
      return true;
    } catch (err) {
      console.error('Delete Stocks Error:', err);
      alert('삭제 중 오류가 발생했습니다.');
      return false;
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

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
    registerStock,
    editStock,
    getStockDetailData,
  };
};
