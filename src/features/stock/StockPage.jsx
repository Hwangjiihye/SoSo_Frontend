import React, { useState, useEffect } from 'react';
import { useStock } from './hooks/useStock';
import StockHeader from './components/StockHeader';
import StockFilter from './components/StockFilter';
import StockTable from './components/StockTable';
import StockHistoryModal from './components/StockHistoryModal';
import StockRegistrationModal from './components/StockRegistrationModal';
import StockTransactionModal from './components/StockTransactionModal';
import StockActionBar from './components/StockActionBar';
import StockEditModal from './components/StockEditModal';

/**
 * @file StockPage.jsx
 * @description 재고 관리 메인 페이지
 */
const StockPage = () => {
  const {
    stocks,
    isLoading,
    filters,
    handleFilterChange,
    handleSearch,
    fetchStocks,
    deleteStocks,
    getStockDetailData,
    registerStock,
    editStock,
    getExpiringSoonCount, // 훅에서 가져오기
  } = useStock();

  const [selectedIds, setSelectedIds] = useState([]);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0); // 상태 추가

  // 모달 관련 상태
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedStockForHistory, setSelectedStockForHistory] = useState(null);
  const [selectedStockForTransaction, setSelectedStockForTransaction] = useState(null);
  const [selectedStockForEdit, setSelectedStockForEdit] = useState(null);

  // 데이터 로딩 시 임박 수치 갱신
  useEffect(() => {
    const updateExpiringCount = async () => {
      const count = await getExpiringSoonCount();
      setExpiringSoonCount(count);
    };
    if (stocks.length > 0) updateExpiringCount();
  }, [stocks, getExpiringSoonCount]);

  const handleAddStock = () => setIsRegisterModalOpen(true);
  const handleRegister = (formData) => registerStock(formData);
  const handleEdit = (stockId, formData) => editStock(stockId, formData);
  const handleEditClick = (stock) => {
    setSelectedStockForEdit(stock);
    setIsEditModalOpen(true);
  };

  const handleSelectChange = (code) => {
    setSelectedIds(prev => 
      prev.includes(code) ? prev.filter(item => item !== code) : [...prev, code]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === stocks.length && stocks.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(stocks.map(stock => stock.stockSeq));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    deleteStocks(selectedIds).then(success => {
      if (success) setSelectedIds([]);
    });
  };

  const handleViewHistory = (stock) => {
    setSelectedStockForHistory(stock);
    setIsHistoryModalOpen(true);
  };

  const handleTransactionClick = (stock) => {
    setSelectedStockForTransaction(stock);
    setIsTransactionModalOpen(true);
  };

  const handleTransactionSuccess = () => fetchStocks();

  // 요약 수치 계산 (백엔드 필드 기준)
  const lowStockCount = stocks.filter(s => s.currentStock > 0 && s.currentStock <= s.safetyStock).length;
  const outOfStockCount = stocks.filter(s => s.currentStock === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StockHeader onAddClick={handleAddStock} />

        {/* 요약 카드 섹션 - 이미지 스타일 반영 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">📦</div>
              <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">전체 품목</div>
            </div>
            <div className="text-3xl font-black text-gray-900 leading-none">
              {stocks.length}<span className="text-sm font-medium text-gray-400 ml-1">건</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-xl">⚠️</div>
              <div className="text-[12px] font-bold text-amber-500 uppercase tracking-wider">재고 부족</div>
            </div>
            <div className="text-3xl font-black text-amber-500 leading-none">
              {lowStockCount}<span className="text-sm font-medium text-amber-300 ml-1">건</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-xl">🚫</div>
              <div className="text-[12px] font-bold text-rose-500 uppercase tracking-wider">품절 임박</div>
            </div>
            <div className="text-3xl font-black text-rose-500 leading-none">
              {outOfStockCount}<span className="text-sm font-medium text-rose-300 ml-1">건</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-rose-600 p-5 rounded-3xl shadow-lg shadow-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">⏰</div>
              <div className="text-[12px] font-bold text-white/80 uppercase tracking-wider">유통기한 임박</div>
            </div>
            <div className="text-3xl font-black text-white leading-none">
              {expiringSoonCount}<span className="text-sm font-medium text-white/60 ml-1">건</span>
            </div>
          </div>
        </div>

        <StockFilter filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} />
        <StockTable 
          stocks={stocks} 
          isLoading={isLoading} 
          selectedIds={selectedIds}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          onViewHistory={handleViewHistory}
          onIncoming={handleTransactionClick}
          onEdit={handleEditClick}
        />
      </div>

      <StockActionBar 
        selectedCount={selectedIds.length}
        onCancel={() => setSelectedIds([])}
        onDelete={handleDeleteSelected}
        isLoading={isLoading}
      />

      <StockHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        stock={selectedStockForHistory}
        fetchDetailData={getStockDetailData}
      />
      <StockRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
      />
      <StockTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        selectedStock={selectedStockForTransaction}
        onSuccess={handleTransactionSuccess}
      />
      <StockEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        stock={selectedStockForEdit}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default StockPage;
