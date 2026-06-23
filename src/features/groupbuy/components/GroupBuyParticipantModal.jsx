import React, { useEffect, useState } from 'react';

/**
 * @file GroupBuyParticipantModal.jsx
 * @description 공동구매 참여자 리스트 모달 (PARTNER 전용)
 * 배송 안내 및 참여 현황 확인을 위한 UI를 제공합니다.
 */
const GroupBuyParticipantModal = ({ groupBuy, onClose, getParticipants }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (groupBuy) {
        setIsLoading(true);
        const data = await getParticipants(groupBuy.seq);
        setParticipants(data);
        setIsLoading(false);
      }
    };
    fetchParticipants();
  }, [groupBuy, getParticipants]);

  if (!groupBuy) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-900">참여자 리스트</h3>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Participant Directory</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 className="text-sm font-black text-emerald-900 mb-1">{groupBuy.title}</h4>
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-600 font-bold">현재 {participants.length}명 참여 중</p>
              <span className="text-[10px] font-black text-emerald-500 bg-white px-2 py-0.5 rounded-full border border-emerald-100">
                목표 {groupBuy.target_participants}명
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 font-bold text-sm">참여자 정보를 불러오는 중...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-gray-400 font-bold">아직 참여한 사업자가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {participants.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[24px] hover:border-emerald-200 transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lg shadow-inner">
                      🏪
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900">{p.bizname}</div>
                      <div className="text-[10px] text-gray-400 font-bold">담당자: {p.user_nickname}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-gray-900">₩{groupBuy.price?.toLocaleString()}</div>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">결제완료</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-4 rounded-[20px] font-black text-sm hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupBuyParticipantModal;
