import { useState, useEffect, useCallback } from 'react';
import { 
  getStockList, 
  createStockMaster, 
  getStockBatches, 
  getStockHistories,
  deleteStock,
  updateStock,
  getStockExpiringSoonCountApi
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
    status: 'ALL', // ALL, NORMAL, LACK, OUT_OF_STOCK, EXPIRING_SOON
  });

  // 1. 재고 목록 조회
  const fetchStocks = useCallback(async () => {
    setIsLoading(true);
    try {
      // 백엔드 API 호출 시 필터 파라미터 전달
      let data = await getStockList(filters);
      
      // 프론트엔드에서 한 번 더 필터링 로직을 강화하여 '실제 로직 작동' 보장
      if (data && filters.status !== 'ALL') {
        data = data.filter(stock => {
          const isLowStock = stock.currentStock > 0 && stock.currentStock <= stock.safetyStock;
          const isOutOfStock = stock.currentStock === 0;
          const isNormal = !isLowStock && !isOutOfStock;

          if (filters.status === 'LACK') return isLowStock;
          if (filters.status === 'OUT_OF_STOCK') return isOutOfStock;
          if (filters.status === 'NORMAL') return isNormal;
          return true;
        });
      }

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
    if (!ids || ids.length === 0) return false;
    if (!window.confirm(`${ids.length}개의 항목을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`)) return false;
    
    setIsLoading(true);
    try {
      // 순차적으로 혹은 병렬로 삭제 처리 (여기서는 병렬 처리)
      await Promise.all(ids.map(id => deleteStock(id)));
      
      alert('선택한 항목이 모두 삭제되었습니다.');
      // 삭제 후 목록 새로고침
      await fetchStocks();
      return true;
    } catch (err) {
      console.error('Delete Stocks Error:', err);
      setError('항목 삭제 중 오류가 발생했습니다. 일부 항목이 삭제되지 않았을 수 있습니다.');
      alert('삭제 중 오류가 발생했습니다.');
      // 오류가 발생하더라도 일부는 삭제되었을 수 있으므로 목록 새로고침
      await fetchStocks();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 유통기한 7일 이내 임박한 전체 배치 수량 계산
  const getExpiringSoonCount = useCallback(async () => {
    try {
      // 1. 전체 품목 목록 조회
      const count = await getStockExpiringSoonCountApi();
      
      return count;
    } catch (err) {
      console.error('Calculate Expiry Error:', err);
      return 0;
    }
  }, []);

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
    getExpiringSoonCount, // 반환 추가
  };
};
