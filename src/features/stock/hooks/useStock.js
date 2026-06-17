import { useState, useEffect, useCallback } from 'react';
import authStore from '../../../store/authStore';
import { 
  getStockList, 
  createStockMaster, 
  getStockBatches, 
  getStockHistories,
  deleteStock,
  updateStock,
  getStockExpiringSoonCountApi,
  getCategories
} from '../../../apis/stockApi';

/**
 * @file useStock.js
 * @description 재고 관리 비즈니스 로직 및 상태 관리 커스텀 훅
 */
export const useStock = () => {
  const selectedStoreSeq = authStore(state => state.selectedStoreSeq);
  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]); // 카테고리 목록 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'ALL',
    status: 'ALL', // ALL, NORMAL, LACK, OUT_OF_STOCK, EXPIRING_SOON
  });

  // 카테고리 목록 조회
  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Fetch Categories Error:', err);
    }
  }, []);

  // 1. 재고 목록 조회
  const fetchStocks = useCallback(async (searchFilters = filters) => {
    setIsLoading(true);
    try {
      // Axios Interceptor에서 storeSeq가 자동으로 주입됨
      const data = await getStockList(searchFilters);
      setStocks(data || []);
      setError(null);
    } catch (err) {
      console.error('Fetch Stocks Error:', err);
      setError('재고 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, selectedStoreSeq]);

  // 2. 품목 마스터 등록 (수량 제외)
  const registerStock = async (stockData) => {
    setIsLoading(true);
    try {
      // @RequestBody StockDTO 대응: 페이로드 내부에 storeSeq 명시적 추가
      const payload = {
        ...stockData,
        storeSeq: selectedStoreSeq
      };
      await createStockMaster(payload);
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
  }, [selectedStoreSeq]);

  useEffect(() => {
    // 초기 로딩 및 매장 전환 시에만 자동 호출
    if (selectedStoreSeq) {
      fetchStocks();
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStoreSeq, fetchCategories]); 

  const handleFilterChange = (name, value) => {
    setFilters(prev => {
      const nextFilters = { ...prev, [name]: value };
      
      // 카테고리나 상태 변경 시에는 즉시 검색 수행 (UX 향상)
      if (name === 'category' || name === 'status') {
        fetchStocks(nextFilters);
      }
      
      return nextFilters;
    });
  };

  const handleSearch = (keyword) => {
    // keyword가 인자로 넘어오면 그것을 사용, 아니면 현재 filters.search 사용
    const searchKeyword = keyword !== undefined ? keyword : filters.search;
    const latestFilters = { ...filters, search: searchKeyword };
    fetchStocks(latestFilters);
  };

  return {
    stocks,
    categories, // 카테고리 목록 추가
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
