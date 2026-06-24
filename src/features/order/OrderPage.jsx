import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOrder } from './hooks/useOrder';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { webSocketMe, getOrderDetail } from '../../apis/orderApi';

/**
 * @file OrderPage.jsx
 * @description 사업자 발주 관리 메인 화면입니다.
 * 발주 목록 조회, 기간/상태 필터링, 엑셀 다운로드 등 상세 기능을 포함합니다.
 */
function OrderPage() {
  const { orders, setOrders, keyword, filterStatus, dateRange, handleKeywordChange, fetchSearch, reset, handleFilterChange, handleDateRangeChange } = useOrder();
  const navigate = useNavigate();

  // 로그인한 사업자 userSeq
  const [userSeq, setUserSeq] = useState(null);
  // 웹소켓 연결 객체 저장용
  const stompClientRef = useRef(null);
  // 웹소켓으로 받은 최신 발주 상태
  const [liveOrderStatus, setLiveOrderStatus] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortType, setSortType] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  // userSeq 가져오기
  useEffect(() => {
    const fetchWebSocketMe = async () => {
      try {
        const data = await webSocketMe();
        console.log("웹소켓 구독용 userSeq : " + data);
        setUserSeq(data);
      } catch (err) {
        console.error('웹소켓 사용자 조회 실패:', err);
      }
    }
    fetchWebSocketMe();
  }, []);

  // userSeq를 가져온 뒤 웹소켓 연결
  useEffect(() => {
    if (!userSeq) return;

    const socket = new SockJS(import.meta.env.VITE_API_BASE_URL ,'/ws');

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('웹소켓 연결 성공');
        console.log(`구독 주소: /sub/order/${userSeq}`);

        client.subscribe(`/sub/order/${userSeq}`, (message) => {
          const data = JSON.parse(message.body);
          console.log('발주 상태 변경 알림:', data);
          // 1. 단건 상태 저장 (기존 코드)
          setLiveOrderStatus(data.status);

          // ⭐️ 2. [핵심 추가] 전체 목록(orders) 상태를 실시간으로 직접 업데이트!
          // data 내부의 orderSeq와 일치하는 주문의 status를 업데이트해 준다.
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderSeq === data.orderSeq
                ? { ...order, status: data.status }
                : order
            )
          );
          // 최신 DB를 다시 가져오라는 명령어 (주석 처리 이유 : setOrders가 다시 업데이트되서 안먹힘)
          // fetchSearch();
        });
      },

      onStompError: (frame) => {
        console.error('STOMP 에러:', frame);
      },

      onWebSocketError: (error) => {
        console.error('웹소켓 연결 에러:', error);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [userSeq]);

  // 발주 상태별 컬러 매핑
  const statusSteps = [
    { key: 'REQUESTED', label: '발주신청', icon: '📝' },
    { key: 'ACCEPTED', label: '접수완료', icon: '📩' },
    { key: 'PREPARING', label: '상품준비', icon: '📦' },
    { key: 'SHIPPING', label: '배송중', icon: '🚚' },
    { key: 'DELIVERED', label: '배송완료', icon: '📬' },
  ];

  // 발주 상태별 개수 계산
  const getOrderStatus = (order) => {
    const status = String(order.status || order.orderStatus || '').trim();
    const statusMap = {
      발주신청: 'REQUESTED',
      접수완료: 'ACCEPTED',
      상품준비: 'PREPARING',
      배송중: 'SHIPPING',
      배송완료: 'DELIVERED',
    };
    return statusMap[status] || status;
  };

  const statusCounts = {
    REQUESTED: orders.filter(order => getOrderStatus(order) === 'REQUESTED').length,
    ACCEPTED: orders.filter(order => getOrderStatus(order) === 'ACCEPTED').length,
    PREPARING: orders.filter(order => getOrderStatus(order) === 'PREPARING').length,
    SHIPPING: orders.filter(order => getOrderStatus(order) === 'SHIPPING').length,
    DELIVERED: orders.filter(order => getOrderStatus(order) === 'DELIVERED').length,
  };

  // 컬러 매핑
  const statusColors = {
    REQUESTED: 'bg-blue-100 text-blue-700 border-blue-200',
    ACCEPTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PREPARING: 'bg-amber-100 text-amber-700 border-amber-200',
    SHIPPING: 'bg-purple-100 text-purple-700 border-purple-200',
    DELIVERED: 'bg-gray-200 text-gray-700 border-gray-300',
  };

  // 상세보기
  const handleOpenDetail = async (orderSeq) => {
  console.log('상세보기 클릭:', orderSeq);

  try {
    const data = await getOrderDetail(orderSeq);

    console.log('상세 조회 결과:', data);

    setSelectedOrder(data);
    setIsDetailOpen(true);
  } catch (error) {
    console.error('상세 조회 실패:', error);
    alert('발주 상세 조회에 실패했습니다.');
  }
};

const handleCloseDetail = () => {
  setIsDetailOpen(false);
  setSelectedOrder(null);
};

const sortedOrders = [...orders].sort((a, b) => {
  if (sortType === 'latest') {
    return Number(b.orderSeq || 0) - Number(a.orderSeq || 0);
  }

  if (sortType === 'high') {
    return Number(b.totalAmount || 0) - Number(a.totalAmount || 0);
  }

  if (sortType === 'low') {
    return Number(a.totalAmount || 0) - Number(b.totalAmount || 0);
  }

  return 0;
});

const ordersPerPage = 5;
const totalPages = Math.max(1, Math.ceil(sortedOrders.length / ordersPerPage));
const paginatedOrders = sortedOrders.slice(
  (currentPage - 1) * ordersPerPage,
  currentPage * ordersPerPage,
);

const pagesPerGroup = 10;
const currentPageGroup = Math.floor((currentPage - 1) / pagesPerGroup);
const firstVisiblePage = currentPageGroup * pagesPerGroup + 1;
const lastVisiblePage = Math.min(firstVisiblePage + pagesPerGroup - 1, totalPages);
const visiblePageNumbers = Array.from(
  { length: lastVisiblePage - firstVisiblePage + 1 },
  (_, index) => firstVisiblePage + index,
);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Title & Main Action */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">일반 발주 현황</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-wider">Business Mode</span>
              <p className="text-gray-500 font-semibold text-sm">매장의 발주 상태를 실시간으로 모니터링하세요.</p>
            </div>
          </div>
        </div>

        {/* 발주 현황 타이틀 추가 */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            발주 현황
          </h3>
        </div>

        {/* Status Summary - 더 상세한 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: '전체 발주', value: orders.length, color: 'border-gray-200', text: 'text-gray-900' },
            { label: '승인 대기', value: statusCounts.REQUESTED, color: 'border-orange-200', text: 'text-orange-600' },
            { label: '접수 완료', value: statusCounts.ACCEPTED, color: 'border-emerald-200', text: 'text-emerald-600' },
            { label: '배송 중', value: statusCounts.SHIPPING, color: 'border-blue-200', text: 'text-blue-600' },
            { label: '배송 완료', value: statusCounts.DELIVERED, color: 'border-gray-200', text: 'text-gray-700' },
          ].map((item, idx) => (
            <div key={idx} className={`bg-white p-7 rounded-3xl border shadow-sm transition-transform hover:-translate-y-1 ${item.color}`}>
              <div className="text-gray-600 text-[12px] font-black uppercase tracking-[0.2em] mb-3">{item.label}</div>
              <div className={`text-3xl font-black mb-1 ${item.text}`}>{item.value}건</div>
            </div>
          ))}
        </div>

        {/* 주문 프로세스 바 */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm mb-10">
          <div className="flex justify-between items-center max-w-5xl mx-auto relative">
            <div className="absolute top-8 left-0 w-full h-1 bg-gray-50 -z-0 rounded-full"></div>
            {statusSteps.map((step, i) => {
              const count = statusCounts[step.key] || 0;
              const active = count > 0;
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

        {/* Filter Section */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-4 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
              <span className="text-xs font-black text-gray-600 px-3 uppercase tracking-tighter">조회 기간</span>
              {['오늘', '7일', '1개월', '3개월'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleDateRangeChange(range)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${dateRange === range ? 'bg-white text-emerald-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {range}
                </button>
              ))}
              <div className="h-4 w-px bg-gray-200 mx-2"></div>
              <input type="date" className="bg-transparent border-none text-xs font-bold text-gray-500 focus:ring-0 cursor-pointer" />
              <span className="text-gray-300">~</span>
              <input type="date" className="bg-transparent border-none text-xs font-bold text-gray-500 focus:ring-0 cursor-pointer" />
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl flex-grow">
              <span className="text-xs font-black text-gray-600 px-3 uppercase tracking-tighter">발주 상태</span>
              {[
                { name: '전체', activeClass: 'bg-gray-900 text-white shadow-lg shadow-gray-200' },
                { name: '대기중', activeClass: 'bg-orange-500 text-white shadow-lg shadow-orange-100' },
                { name: '접수완료', activeClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' },
                { name: '배송중', activeClass: 'bg-blue-600 text-white shadow-lg shadow-blue-100' },
                { name: '배송완료', activeClass: 'bg-gray-700 text-white shadow-lg shadow-gray-200' },
              ].map((status) => (
                <button
                  key={status.name}
                  onClick={() => handleFilterChange(status.name)}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all transform active:scale-95 ${filterStatus === status.name ? status.activeClass : 'text-gray-400 hover:bg-white hover:text-gray-600'}`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={keyword}
                onChange={handleKeywordChange}
                onKeyDown={(e) => e.key === 'Enter' && fetchSearch()}
                placeholder="발주 번호, 공급업체, 또는 품목명을 입력하세요"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
            <button onClick={fetchSearch} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all">검색하기</button>
            <button onClick={reset} className="bg-white border border-gray-200 text-gray-400 px-4 py-4 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">🔄 초기화</button>
          </div>
        </div>

        {/* Data List */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
              발주 상세 목록 <span className="text-gray-500 font-medium ml-1 text-sm">{orders.length}건</span>
            </h3>
            <div className="flex gap-4">
              <select
                value={sortType}
                onChange={(e) => {
                  setSortType(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-bold text-gray-500 bg-gray-50 border-none rounded-lg px-3 py-1.5 outline-none"
              >
                <option value="latest">최신순</option>
                <option value="high">금액 높은순</option>
                <option value="low">금액 낮은순</option>
              </select>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-18 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">발주번호</th>
                <th className="px-16 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">공급업체</th>
                <th className="px-15 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">발주 품목</th>
                <th className="px-7 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">결제 금액/수단</th>
                <th className="px-12 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">상태</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.map((order) => (
                <tr key={order.orderSeq} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-gray-900 mb-1">{order.orderNo}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs">🏢</div>
                      <div className="text-sm font-bold text-gray-700">{order.companyName || '-'}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm text-gray-600 font-medium">{order.itemSummary || '-'}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-emerald-600 mb-1">
                      {order.totalAmount != null ? `${order.totalAmount.toLocaleString()}원` : '-'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border shadow-sm inline-block ${statusColors[getOrderStatus(order)]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(order.orderSeq)}
                        className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-emerald-600 shadow-sm"
                        title="상세보기"
                      >
                        📄
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-8 py-6 bg-gray-50/50 flex justify-center border-t border-gray-50">
            <div className="flex gap-2">
              {totalPages > pagesPerGroup && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, firstVisiblePage - pagesPerGroup))}
                  disabled={firstVisiblePage === 1}
                  aria-label="이전 페이지 묶음"
                  className="w-10 h-10 rounded-xl border border-gray-100 bg-white text-sm font-bold text-gray-400 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &lt;
                </button>
              )}

              {visiblePageNumbers.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCurrentPage(n)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${n === currentPage ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}
                >
                  {n}
                </button>
              ))}

              {totalPages > pagesPerGroup && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(totalPages, lastVisiblePage + 1))}
                  disabled={lastVisiblePage === totalPages}
                  aria-label="다음 페이지 묶음"
                  className="w-10 h-10 rounded-xl border border-gray-100 bg-white text-sm font-bold text-gray-400 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &gt;
                </button>
              )}
            </div>
          </div>
        </div>
        {isDetailOpen && selectedOrder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="w-[700px] max-w-[90vw] rounded-[28px] bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">발주 상세</h3>
                <button
                  onClick={handleCloseDetail}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200"
                >
                  닫기
                </button>
              </div>

              <div className="mb-6 rounded-2xl bg-gray-50 p-5 text-sm font-bold text-gray-700">
                <p>발주번호: {selectedOrder.orderInfo?.orderNo}</p>
                <p>공급업체: {selectedOrder.orderInfo?.companyName}</p>
                <p>상태: {selectedOrder.orderInfo?.status}</p>
                <p>총 금액: {Number(selectedOrder.orderInfo?.totalAmount || 0).toLocaleString()}원</p>
                <p>배송지: ({selectedOrder.orderInfo?.zonecode}) {selectedOrder.orderInfo?.address1} {selectedOrder.orderInfo?.address2}</p>
                <p>요청사항: {selectedOrder.orderInfo?.orderMemo || '-'}</p>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-sm text-gray-500">
                    <th className="p-3">품목명</th>
                    <th className="p-3">카테고리</th>
                    <th className="p-3">수량</th>
                    <th className="p-3">규격</th>
                    <th className="p-3">단가</th>
                    <th className="p-3">합계</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item) => (
                    <tr key={item.orderItemSeq} className="border-b text-sm">
                      <td className="p-3 font-bold">{item.itemName}</td>
                      <td className="p-3">{item.categoryName}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">{item.spec}</td>
                      <td className="p-3">{Number(item.unitPrice || 0).toLocaleString()}원</td>
                      <td className="p-3">{Number(item.totalPrice || 0).toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderPage;
