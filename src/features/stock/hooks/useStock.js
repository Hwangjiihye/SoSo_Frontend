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
      
      // 더미 데이터 (품목명, 카테고리, 현재 수량, 단위, 안전재고, 재고상태, 소비기한)
      const dummyData = [
        { id: 'S00001', name: '냉동 삼겹살', category: '육류', currentStock: 45, unit: '팩', safetyStock: 20, status: 'NORMAL', expiryDate: '2026-12-20' },
        { id: 'S00002', name: '신선 대파', category: '채소', currentStock: 5, unit: '단', safetyStock: 15, status: 'LACK', expiryDate: '2026-06-15' },
        { id: 'S00003', name: '참기름', category: '소스/오일', currentStock: 0, unit: '병', safetyStock: 5, status: 'OUT_OF_STOCK', expiryDate: '-' },
        { id: 'S00004', name: '백설탕', category: '가공식품', currentStock: 120, unit: '포', safetyStock: 30, status: 'NORMAL', expiryDate: '2027-01-10' },
        { id: 'S00005', name: '진간장', category: '소스/오일', currentStock: 15, unit: '통', safetyStock: 10, status: 'NORMAL', expiryDate: '2026-11-05' },
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

  const registerStock = async (stockData) => {
    // 실제 API 연동 시: const newStock = await createStock(stockData);
    const newStock = {
      id: `S${String(stocks.length + 1).padStart(5, '0')}`,
      ...stockData,
      currentStock: 0,
      status: 'OUT_OF_STOCK',
      safetyStock: Number(stockData.safetyStock) || 0,
      expiryDate: '-',
    };
    
    setStocks(prev => [newStock, ...prev]);
    alert('새 품목이 등록되었습니다.');
  };

  const editStock = async (stockId, stockData) => {
    // 실제 API 연동 시: await updateStock(stockId, stockData);
    setStocks(prev => prev.map(stock => 
      stock.id === stockId ? { ...stock, ...stockData } : stock
    ));
    alert('품목 정보가 수정되었습니다.');
  };

  const getStockHistory = async (stockId) => {
    // 실제 API 연동 시: return await getStockHistoryApi(stockId);
    
    // 더미 이력 데이터 (입고 시 상세 정보 포함)
    return [
      { 
        date: '2024-03-20', 
        time: '14:30:22', 
        type: '입고', 
        detailName: 'A유통 국내산 냉동 삼겹살',
        changeQuantity: 20, 
        unitPrice: 12000,
        expiryDate: '2026-12-20',
        finalStock: 45, 
        reason: '정기 입고', 
        user: '홍길동' 
      },
      { 
        date: '2024-03-19', 
        time: '10:15:05', 
        type: '출고', 
        changeQuantity: -10, 
        finalStock: 25, 
        reason: '주방 소진', 
        user: '김철수' 
      },
      { 
        date: '2024-03-18', 
        time: '17:45:10', 
        type: '조정', 
        changeQuantity: -5, 
        finalStock: 35, 
        reason: '파손 폐기', 
        user: '이영희' 
      },
      { 
        date: '2024-03-15', 
        time: '09:00:00', 
        type: '입고', 
        detailName: '초기 삼겹살 재고',
        changeQuantity: 40, 
        unitPrice: 11500,
        expiryDate: '2026-09-15',
        finalStock: 40, 
        reason: '초기 재고 등록', 
        user: '홍길동' 
      },
    ];
  };

  const addStockQuantity = async (stockId, quantity) => {
    // 실제 API 연동 시: await updateStockQuantityApi(stockId, quantity);
    
    setStocks(prev => prev.map(stock => {
      if (stock.id === stockId) {
        const newStock = stock.currentStock + Number(quantity);
        let newStatus = 'NORMAL';
        if (newStock === 0) newStatus = 'OUT_OF_STOCK';
        else if (newStock < stock.safetyStock) newStatus = 'LACK';
        
        return {
          ...stock,
          currentStock: newStock,
          status: newStatus
        };
      }
      return stock;
    }));
    
    alert(`성공적으로 ${quantity}개가 입고되었습니다.`);
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
    getStockHistory,
    registerStock,
    editStock,
    addStockQuantity,
  };
};
