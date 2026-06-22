import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerOrder } from './hooks/usePartnerOrder';

/**
 * @file PartnerOrderPage.jsx
 * @description 거래처(Partner) 전용 발주 관리 페이지입니다.
 * OrderPage와 동일하게 실시간 발주 현황 프로세스 바를 포함합니다.
 */
function PartnerOrderPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    orders, // 필터링된 목록
    allOrders, // 전체 목록 (통계용)
    loading, 
    keyword,
    filterStatus,
    handleKeywordChange,
    handleFilterChange,
    fetchOrders,
    openOrderDetail, 
    isModalOpen, 
    closeModal, 
    selectedOrderDetails,
    selectedOrder, // 선택된 발주서 추가
    handleStatusChange 
  } = usePartnerOrder();

  // 발주 상태별 컬러 매핑
  const statusColors = {
    REQUESTED: 'bg-blue-100 text-blue-700 border-blue-200',
    ACCEPTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PREPARING: 'bg-amber-100 text-amber-700 border-amber-200',
    SHIPPING: 'bg-purple-100 text-purple-700 border-purple-200',
    DELIVERED: 'bg-gray-200 text-gray-700 border-gray-300',
  };

  const statusOptions = [
    { value: 'REQUESTED', label: '발주신청' },
    { value: 'ACCEPTED', label: '접수완료' },
    { value: 'PREPARING', label: '상품준비' },
    { value: 'SHIPPING', label: '배송중' },
    { value: 'DELIVERED', label: '배송완료' },
  ];

  // 상단 통계 데이터 계산 (allOrders 기준)
  const stats = {
    total: allOrders.length,
    requested: allOrders.filter(o => o.status === 'REQUESTED').length,
    preparing: allOrders.filter(o => o.status === 'PREPARING' || o.status === 'ACCEPTED').length,
    shipping: allOrders.filter(o => o.status === 'SHIPPING').length,
    delivered: allOrders.filter(o => o.status === 'DELIVERED').length,
  };

  // 프로세스 바용 데이터 설정
  const statusSteps = [
    { key: 'REQUESTED', label: '발주신청', icon: '📝' },
    { key: 'ACCEPTED', label: '접수완료', icon: '📩' },
    { key: 'PREPARING', label: '상품준비', icon: '📦' },
    { key: 'SHIPPING', label: '배송중', icon: '🚚' },
    { key: 'DELIVERED', label: '배송완료', icon: '📬' },
  ];

  // 각 단계별 건수 계산
  const statusCounts = {
    REQUESTED: allOrders.filter(o => o.status === 'REQUESTED').length,
    ACCEPTED: allOrders.filter(o => o.status === 'ACCEPTED').length,
    PREPARING: allOrders.filter(o => o.status === 'PREPARING').length,
    SHIPPING: allOrders.filter(o => o.status === 'SHIPPING').length,
    DELIVERED: allOrders.filter(o => o.status === 'DELIVERED').length,
  };

  const ordersPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(orders.length / ordersPerPage));
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* 페이지 타이틀 */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">거래처 발주 관리</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-wider">PartnerMode</span>
              <p className="text-gray-500 font-semibold text-sm">업장에서 들어온 발주 요청을 관리하고 실시간으로 상태를 업데이트하세요.</p>
            </div>
          </div>
        </div>

        {/* 발주 현황 타이틀 */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            발주 현황 요약
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-400">최근 업데이트: {new Date().toLocaleString('ko-KR')}</span>
          </div>
        </div>

        {/* Status Summary - 카드형 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: '전체 발주', value: stats.total, color: 'border-gray-200', text: 'text-gray-900' },
            { label: '신규 요청', value: stats.requested, color: 'border-blue-200', text: 'text-blue-600'},
            { label: '상품 준비', value: stats.preparing, color: 'border-amber-200', text: 'text-amber-600'},
            { label: '배송 중', value: stats.shipping, color: 'border-purple-200', text: 'text-purple-600' },
            { label: '배송 완료', value: stats.delivered, color: 'border-emerald-200', text: 'text-emerald-600' },
          ].map((item, idx) => (
            <div key={idx} className={`bg-white p-7 rounded-3xl border shadow-sm transition-transform hover:-translate-y-1 ${item.color}`}>
              <div className="text-gray-600 text-[12px] font-black uppercase tracking-[0.2em] mb-3">{item.label}</div>
              <div className={`text-3xl font-black mb-1 ${item.text}`}>{item.value}건</div>
            </div>
          ))}
        </div>

        {/* 주문 프로세스 바 (실시간 발주 현황) */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm mb-10">
          <div className="flex justify-between items-center max-w-5xl mx-auto relative">
            <div className="absolute top-8 left-0 w-full h-1 bg-gray-50 -z-0 rounded-full"></div>
            {statusSteps.map((step, i) => {
              const count = statusCounts[step.key] || 0;
              const active = count > 0; // 0건보다 많을 때만 활성화
              return (
                <div key={step.key} className="flex flex-col items-center gap-5 relative z-10 bg-white px-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm transition-all ${active ? 'bg-emerald-100 text-emerald-700 border-emerald-300 ring-4 ring-emerald-100' : 'bg-gray-50 text-gray-300 grayscale border-gray-100'}`}>
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <div className={`text-base font-black mb-1 ${active ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</div>
                    <div className={`text-sm font-bold ${active ? 'text-emerald-500' : 'text-gray-300'}`}>{count}건</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Section - 조회 조건 */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* 기간 필터 */}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
              <span className="text-xs font-black text-gray-600 px-3 uppercase tracking-tighter">조회 기간</span>
              {['오늘', '7일', '1개월', '3개월'].map((range) => (
                <button
                  key={range}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all hover:bg-white hover:shadow-sm text-gray-400`}
                >
                  {range}
                </button>
              ))}
              <div className="h-4 w-px bg-gray-200 mx-2"></div>
              <input type="date" className="bg-transparent border-none text-xs font-bold text-gray-500 focus:ring-0 cursor-pointer" />
              <span className="text-gray-300">~</span>
              <input type="date" className="bg-transparent border-none text-xs font-bold text-gray-500 focus:ring-0 cursor-pointer" />
            </div>

            {/* 상태 필터 */}
            <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl flex-grow">
              <span className="text-xs font-black text-gray-600 px-3 uppercase tracking-tighter">발주 상태</span>
              {['전체', '발주신청', '준비중', '배송중', '배송완료'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all transform active:scale-95 ${filterStatus === status ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-400 hover:bg-white hover:text-gray-600'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          {/* 검색 바 */}
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                value={keyword}
                onChange={handleKeywordChange}
                onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                placeholder="발주 번호 또는 주문 업체명을 입력하세요" 
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
            <button onClick={fetchOrders} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all">검색하기</button>
          </div>
        </div>

        {/* Data List - 목록 섹션 */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
              발주 상세 목록 <span className="text-gray-500 font-medium ml-1 text-sm">{orders.length}건</span>
            </h3>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">발주번호</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">주문 업체</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">상태 관리</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 text-right">결제 금액</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold">발주 내역을 불러오는 중입니다...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold">접수된 발주 내역이 없습니다.</td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.orderSeq} className="hover:bg-emerald-50/30 transition-colors group cursor-pointer" onClick={() => openOrderDetail(order.orderSeq)}>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-gray-900">{order.orderNo}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString('ko-KR')}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs">🏪</div>
                        <div className="text-sm font-bold text-gray-700">{order.companyName}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderSeq, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black border shadow-sm outline-none cursor-pointer transition-all ${statusColors[order.status] || 'bg-gray-100'}`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-sm font-black text-emerald-600">
                        {order.totalAmount?.toLocaleString()}원
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        className="p-2 bg-gray-50 group-hover:bg-white rounded-xl transition-all border border-gray-100 shadow-sm text-gray-400 group-hover:text-emerald-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderDetail(order.orderSeq);
                        }}
                      >
                        📄
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          <div className="px-8 py-6 bg-gray-50/50 flex justify-center border-t border-gray-50">
             <div className="flex gap-2">
               {Array.from({ length: totalPages }, (_, index) => index + 1).map(n => (
                 <button
                   key={n}
                   type="button"
                   onClick={() => setCurrentPage(n)}
                   className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${n === currentPage ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}
                 >
                   {n}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </main>

      {/* 발주 상세 모달창 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-900">발주 품목 상세</h3>
                <p className="text-gray-500 text-sm font-bold mt-1">선택하신 발주서의 세부 항목입니다.</p>
              </div>
              <button 
                onClick={closeModal}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm font-black text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-10 max-h-[60vh] overflow-y-auto">
              {/* 추가된 배송지 및 메모 영역 */}
              {selectedOrder && (
                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <div className="text-xs font-black text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                      <span>📍</span> 배송지 정보
                    </div>
                    <div className="font-bold text-gray-800 text-base mb-1">{selectedOrder.companyName}</div>
                    <div className="text-gray-600 text-sm leading-relaxed">
                      <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-bold mr-2 mb-1">
                        {selectedOrder.zonecode || '우편번호 없음'}
                      </span>
                      <br/>
                      {selectedOrder.address1} {selectedOrder.address2}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <div className="text-xs font-black text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                      <span>📝</span> 요청 메모
                    </div>
                    <div className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                      {selectedOrder.orderMemo || '입력된 요청 사항이 없습니다.'}
                    </div>
                  </div>
                </div>
              )}

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="py-4 text-sm font-black text-gray-900 uppercase">품목명</th>
                    <th className="py-4 text-sm font-black text-gray-900 uppercase">카테고리</th>
                    <th className="py-4 text-sm font-black text-gray-900 uppercase text-center">수량</th>
                    <th className="py-4 text-sm font-black text-gray-900 uppercase text-right">단가</th>
                    <th className="py-4 text-sm font-black text-gray-900 uppercase text-right">합계</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedOrderDetails.map((item) => (
                    <tr key={item.orderItemSeq} className="hover:bg-gray-50/50">
                      <td className="py-5">
                        <div className="font-bold text-gray-800">{item.itemName}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.spec}</div>
                      </td>
                      <td className="py-5 text-sm text-gray-500">{item.categoryName}</td>
                      <td className="py-5 text-sm font-black text-center">{item.quantity}</td>
                      <td className="py-5 text-sm text-gray-500 text-right">{item.unitPrice?.toLocaleString()}원</td>
                      <td className="py-5 text-sm font-black text-emerald-600 text-right">{item.totalPrice?.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-10 py-8 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-6">
              <div className="text-right">
                <span className="text-gray-400 font-bold text-sm uppercase tracking-widest mr-4">최종 결제 금액</span>
                <span className="text-3xl font-black text-gray-900">
                  {selectedOrderDetails.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toLocaleString()}원
                </span>
              </div>
              <button 
                onClick={closeModal}
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg shadow-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartnerOrderPage;
