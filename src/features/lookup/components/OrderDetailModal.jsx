import React from 'react';

/**
 * @file OrderDetailModal.jsx
 * @description 발주 이력 상세 정보를 보여주는 모달 컴포넌트
 */
const OrderDetailModal = ({ isOpen, onClose, detail }) => {
  if (!isOpen || !detail) return null;

  const { orderInfo, items } = detail;

  // 상태별 스타일 설정
  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600';
      case 'REQUESTED':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-amber-50 text-amber-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-start bg-gray-50/30">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusStyle(orderInfo.status)}`}>
                {orderInfo.status}
              </span>
              <span className="text-xs font-mono text-gray-400 font-bold">{orderInfo.orderNo}</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{orderInfo.companyName}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {/* 배송 및 정보 섹션 */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-3">Order Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-gray-400">발주 일자</span>
                  <span className="text-sm font-black text-gray-700">{orderInfo.createdAt?.split('T')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-gray-400">총 금액</span>
                  <span className="text-sm font-black text-emerald-600">{orderInfo.totalAmount?.toLocaleString()}원</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-3">Shipping Address</h3>
              <p className="text-sm font-black text-gray-700 leading-relaxed">
                [{orderInfo.zonecode}]<br />
                {orderInfo.address1} {orderInfo.address2}
              </p>
            </div>
          </div>

          {/* 품목 리스트 */}
          <div className="mb-10">
            <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4">Order Items</h3>
            <div className="bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">품목명</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">수량</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">단가</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">합계</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.orderItemSeq} className="group hover:bg-white transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-black text-gray-900">{item.itemName}</div>
                        <div className="text-[11px] font-bold text-gray-400">{item.categoryName} | {item.spec}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-gray-700 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-400 text-right">{item.unitPrice?.toLocaleString()}원</td>
                      <td className="px-6 py-4 text-sm font-black text-gray-900 text-right">{item.totalPrice?.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 메모 */}
          {orderInfo.order_memo && (
            <div>
              <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-3">Order Memo</h3>
              <div className="p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50 text-sm font-medium text-gray-600 italic">
                "{orderInfo.order_memo}"
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-gray-900 text-white text-sm font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
