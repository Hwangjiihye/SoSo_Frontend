import React, { useState, useEffect } from 'react';
import { useOrderLookup } from './hooks/useOrderLookup';
import OrderDetailModal from './components/OrderDetailModal';

/**
 * @file OrderLookupPage.jsx
 * @description 발주 이력 조회 페이지 (발주서이력.png 기반)
 */
const OrderLookupPage = () => {
  const [params, setParams] = useState({
    status: 'ALL',
    startDate: '',
    endDate: '',
    keyword: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { orders, isLoading, orderDetail, setOrderDetail, fetchOrders, fetchOrderDetail } = useOrderLookup();

  useEffect(() => {
    fetchOrders(params);
  }, [fetchOrders, params]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleOrderClick = (orderSeq) => {
    fetchOrderDetail(orderSeq);
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
  const displayedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm">📄</span>
            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Orders</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">발주 이력 조회</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">과거에 진행된 모든 발주 내역을 확인하고 관리합니다.</p>
        </div>
      </header>

      {/* 필터 섹션 */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">조회 기간</label>
          <div className="flex items-center gap-3">
            <input 
              type="date" 
              name="startDate"
              value={params.startDate}
              onChange={handleFilterChange}
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 min-w-[130px]"
            />
            <span className="text-gray-300 shrink-0 font-bold">~</span>
            <input 
              type="date" 
              name="endDate"
              value={params.endDate}
              onChange={handleFilterChange}
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 min-w-[130px]"
            />
          </div>
        </div>
        <div className="md:col-span-1">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">발주 상태</label>
          <select 
            name="status"
            value={params.status}
            onChange={handleFilterChange}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500 appearance-none"
          >
            <option value="ALL">전체 보기</option>
            <option value="REQUESTED">발주 신청</option>
            <option value="ACCEPTED">접수 완료</option>
            <option value="PREPARING">상품 준비중</option>
            <option value="SHIPPING">배송중</option>
            <option value="DELIVERED">배송 완료</option>
            <option value="COMPLETED">거래 완료</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">검색어 (발주번호/거래처명)</label>
          <input 
            type="text" 
            name="keyword"
            placeholder="검색어를 입력하세요..."
            value={params.keyword}
            onChange={handleFilterChange}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* 리스트 섹션 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white p-20 rounded-[3rem] text-center text-gray-400 font-bold animate-pulse">발주 내역을 불러오는 중...</div>
        ) : displayedOrders.length > 0 ? (
          displayedOrders.map((order) => (
            <div 
              key={order.orderSeq} 
              onClick={() => handleOrderClick(order.orderSeq)}
              className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/30 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Status</span>
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[12px] font-mono text-gray-300 font-bold">{order.orderNo}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{order.companyName}</h3>
                  <p className="text-sm text-gray-400 font-medium">{order.itemSummary}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-12">
                <div>
                  <div className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Amount</div>
                  <div className="text-xl font-black text-gray-900">{order.totalAmount?.toLocaleString()}원</div>
                </div>
                <div>
                  <div className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-1">Order Date</div>
                  <div className="text-sm font-bold text-gray-500">{order.createdAt?.split('T')[0]}</div>
                </div>
                <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-32 rounded-[3rem] border border-dashed border-gray-200 text-center">
            <div className="text-5xl mb-6 opacity-20">📄</div>
            <p className="text-gray-400 font-bold">발주 이력이 존재하지 않습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && orders.length > 0 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
          >
            ←
          </button>
          {(() => {
            const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
            const endPage = Math.min(startPage + 9, totalPages);
            const pageButtons = [];
            for (let i = startPage; i <= endPage; i++) {
              pageButtons.push(
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                    currentPage === i 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                      : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100'
                  }`}
                >
                  {i}
                </button>
              );
            }
            return pageButtons;
          })()}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
          >
            →
          </button>
        </div>
      )}

      {/* 상세 모달 */}
      <OrderDetailModal 
        isOpen={!!orderDetail} 
        onClose={() => setOrderDetail(null)} 
        detail={orderDetail} 
      />
    </div>
  );
};

export default OrderLookupPage;
