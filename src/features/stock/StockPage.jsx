import React, { useState } from 'react';
import { useStock } from './hooks/useStock';
import StockHeader from './components/StockHeader';
import StockFilter from './components/StockFilter';
import StockTable from './components/StockTable';
import StockHistoryModal from './components/StockHistoryModal';
import StockRegistrationModal from './components/StockRegistrationModal';
import StockIncomingModal from './components/StockIncomingModal';

/**
 * @file StockPage.jsx
 * @description 재고 관리 메인 페이지
 * 와이어프레임(a3, a4, a5, a6) 기반으로 사용자 요청 항목 및 기능 구현
 */
const StockPage = () => {
  const {
    stocks,
    isLoading,
    filters,
    handleFilterChange,
    handleSearch,
    deleteStocks,
    getStockHistory,
    registerStock,
    addStockQuantity,
  } = useStock();

  const [selectedIds, setSelectedIds] = useState([]);
  
  // 모달 관련 상태
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
  
  const [selectedStockForHistory, setSelectedStockForHistory] = useState(null);
  const [selectedStockForIncoming, setSelectedStockForIncoming] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const handleAddStock = () => {
    setIsRegisterModalOpen(true);
  };

  const handleRegister = (formData) => {
    registerStock(formData);
  };

  const handleSelectChange = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === stocks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(stocks.map(stock => stock.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    const confirmDelete = window.confirm(
      `정말로 선택한 ${selectedIds.length}개의 항목을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`
    );

    if (confirmDelete) {
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

  const handleIncomingClick = (stock) => {
    setSelectedStockForIncoming(stock);
    setIsIncomingModalOpen(true);
  };

  const handleIncomingSubmit = (stockId, quantity) => {
    addStockQuantity(stockId, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <StockHeader onAddClick={handleAddStock} />

        {/* 요약 카드 섹션 */}
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
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-[11px] font-bold text-emerald-500 uppercase mb-1">선택된 항목</div>
            <div className="text-xl font-black text-emerald-600">{selectedIds.length}건</div>
          </div>
        </div>

        <StockFilter 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onSearch={handleSearch} 
        />

        <StockTable 
          stocks={stocks} 
          isLoading={isLoading} 
          selectedIds={selectedIds}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          onViewHistory={handleViewHistory}
          onIncoming={handleIncomingClick}
        />

        {/* 하단 액션 바 */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="px-6 py-2.5 bg-white border border-rose-200 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            🗑️ 선택 삭제
          </button>
          
          <div className="md:hidden text-center">
            <p className="text-[11px] text-gray-400">좌우로 스크롤하여 상세 정보를 확인할 수 있습니다.</p>
          </div>
        </div>
      </div>

      {/* 변동 이력 모달 */}
      <StockHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        stockName={selectedStockForHistory?.name}
        historyData={historyData}
      />

      {/* 재고 등록 모달 */}
      <StockRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
      />

      {/* 재고 입고 모달 */}
      <StockIncomingModal
        isOpen={isIncomingModalOpen}
        onClose={() => setIsIncomingModalOpen(false)}
        stock={selectedStockForIncoming}
        onIncoming={handleIncomingSubmit}
      />
    </div>
  );
};

export default StockPage;
