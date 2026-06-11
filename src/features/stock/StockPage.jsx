import React, { useState } from 'react';
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
    getStockHistory,
    registerStock,
    editStock,
  } = useStock();

  const [selectedIds, setSelectedIds] = useState([]);

  // 모달 관련 상태
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedStockForHistory, setSelectedStockForHistory] = useState(null);
  const [selectedStockForTransaction, setSelectedStockForTransaction] = useState(null);
  const [selectedStockForEdit, setSelectedStockForEdit] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const handleAddStock = () => setIsRegisterModalOpen(true);
  const handleRegister = (formData) => registerStock(formData);
  const handleEdit = (stockId, formData) => editStock(stockId, formData);
  const handleEditClick = (stock) => {
    setSelectedStockForEdit(stock);
    setIsEditModalOpen(true);
  };

  const handleSelectChange = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === stocks.length && stocks.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(stocks.map(stock => stock.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`정말로 선택한 ${selectedIds.length}개의 항목을 삭제하시겠습니까?`)) {
      deleteStocks(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleViewHistory = async (stock) => {
    setSelectedStockForHistory(stock);
    const data = await getStockHistory(stock.id);
    setHistoryData(data);
    setIsHistoryModalOpen(true);
  };

  const handleTransactionClick = (stock) => {
    setSelectedStockForTransaction(stock);
    setIsTransactionModalOpen(true);
  };

  const handleTransactionSuccess = () => fetchStocks();

  // 유통기한 7일 이내 만료 재고 계산
  const getExpiringSoonCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return stocks.filter(stock => {
      if (!stock.expiryDate || stock.expiryDate === '-') return false;
      const target = new Date(stock.expiryDate);
      target.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StockHeader onAddClick={handleAddStock} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-gray-400 uppercase mb-1">전체 품목</div>
            <div className="text-xl font-black text-gray-900">{stocks.length}건</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-amber-500 uppercase mb-1">재고 부족</div>
            <div className="text-xl font-black text-amber-500">
              {stocks.filter(s => s.status === 'LACK').length}건
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-rose-500 uppercase mb-1">품절</div>
            <div className="text-xl font-black text-rose-500">
              {stocks.filter(s => s.status === 'OUT_OF_STOCK').length}건
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm ring-1 ring-red-100">
            <div className="text-[11px] font-bold text-red-500 uppercase mb-1">유통기한 임박</div>
            <div className="text-xl font-black text-red-600">{getExpiringSoonCount()}건</div>
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
      />

      <StockHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        stockName={selectedStockForHistory?.name}
        historyData={historyData}
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
