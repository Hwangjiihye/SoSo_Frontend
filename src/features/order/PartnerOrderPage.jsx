import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainFooter from '../../components/layout/MainFooter';
import MainHeader from '../../components/layout/MainHeader';
import { usePartnerOrder } from './hooks/usePartnerOrder';

/**
 * @file PartnerOrderPage.jsx
 * @description 거래처(Partner) 전용 발주 관리 페이지입니다.
 * 초보자 가이드: 이 페이지는 거래처 사장님이 자신에게 들어온 주문을 한눈에 확인하는 곳입니다.
 */
function PartnerOrderPage() {
  // 우리가 만든 커스텀 훅에서 필요한 기능들을 가져옵니다.
  const { 
    orders, 
    loading, 
    openOrderDetail, 
    isModalOpen, 
    closeModal, 
    selectedOrderDetails,
    handleStatusChange // 상태 변경 함수 추가
  } = usePartnerOrder();

  // 발주 상태별 예쁜 색깔 매핑
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
      <MainHeader activeMenu="발주 관리" />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* 페이지 제목 섹션 */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">거래처 발주 관리</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-wider">PartnerMode</span>
              <p className="text-gray-500 font-semibold text-sm">업장에서 들어온 발주 요청을 실시간으로 확인하세요.</p>
            </div>
          </div>
        </div>

        {/* 발주 목록 테이블 */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
              새로 접수된 발주 <span className="text-gray-500 font-medium ml-1 text-sm">{orders.length}건</span>
            </h3>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">발주번호</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">주문 업체</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">상태</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 text-right">총 결제 금액</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 text-center">상세보기</th>
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
                orders.map((order) => (
                  <tr key={order.orderSeq} className="hover:bg-emerald-50/30 transition-colors group cursor-pointer" onClick={() => openOrderDetail(order.orderSeq)}>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-gray-900">{order.orderNo}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-xs">🏪</div>
                        <div className="text-sm font-bold text-gray-700">{order.companyName}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderSeq, e.target.value)}
                        onClick={(e) => e.stopPropagation()} // 행 클릭 이벤트(상세보기) 방지
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black border shadow-sm outline-none cursor-pointer transition-all ${statusColors[order.status] || 'bg-gray-100'}`}
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
                        className="p-2 bg-gray-50 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-gray-100 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation(); // 행 클릭 이벤트 방지
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

      <MainFooter />
    </div>
  );
}

export default PartnerOrderPage;
