import React from 'react';

/**
 * @file GroupBuyStatusModal.jsx
 * @description 공동구매 상태 변경 모달 (PARTNER 전용)
 */
const GroupBuyStatusModal = ({ groupBuy, onClose, onUpdate }) => {
  if (!groupBuy) return null;

  const statuses = ['모집중', '모집완료', '모집실패', '배송준비', '배송중', '완료'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-900">상태 변경</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8 space-y-3">
          <p className="text-sm font-bold text-gray-500 mb-4 text-center">
            <span className="text-emerald-600">"{groupBuy.title}"</span><br/>의 현재 상태를 업데이트 하세요.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  onUpdate(groupBuy.seq, status);
                  onClose();
                }}
                className={`py-3 rounded-2xl font-black text-xs transition-all ${
                  groupBuy.status === status
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupBuyStatusModal;
