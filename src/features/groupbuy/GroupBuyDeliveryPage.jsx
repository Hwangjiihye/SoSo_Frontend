import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupBuyApi } from '../../apis/groupBuyApi';

/**
 * @file GroupBuyDeliveryPage.jsx
 * @description 픽업/배송 안내 페이지 (요구사항: QR코드 삭제, 수령확인 중심, 채팅삭제)
 */
const GroupBuyDeliveryPage = () => {
  const { seq } = useParams();
  const navigate = useNavigate();
  const [groupBuy, setGroupBuy] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 실제 연동 시 API 호출 (현재는 Mock 데이터 위주로 구성)
        // const data = await groupBuyApi.getGroupBuyDetail(seq);
        // setGroupBuy(data);
        
        // Mock 데이터 (사업자 픽업안내용)
        setGroupBuy({
          seq: seq,
          title: '한우 등심 (1+ 등급, 10kg)',
          status: '배송중',
          delivery_note: '정문 앞 무인 택배함에 보관 예정입니다. 도착 시 문자 드립니다.',
          address: '서울시 강남구 테헤란로 123 소소빌딩 1층',
        });

        const participantData = await groupBuyApi.getParticipants(seq);
        setParticipants(participantData || []);
      } catch (error) {
        console.error('Failed to fetch delivery info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [seq]);

  if (isLoading) return <div className="p-20 text-center font-black">정보를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          뒤로가기
        </button>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          {/* 상단 상태 바 */}
          <div className="bg-gray-900 px-10 py-8 text-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Delivery Status</span>
              <span className="px-3 py-1 bg-emerald-500 rounded-lg text-[10px] font-black">{groupBuy.status}</span>
            </div>
            <h2 className="text-2xl font-black mb-2">{groupBuy.title}</h2>
            <p className="text-gray-400 text-sm font-bold">참여하신 공동구매의 진행 현황입니다.</p>
          </div>

          <div className="p-10 space-y-12">
            {/* 픽업/배송 단계 (QR코드 삭제, 수령 확인 중심) */}
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">배송 진행 단계</h3>
              <div className="flex justify-between items-start relative">
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0"></div>
                {[
                  { label: '배송준비', icon: '📦', active: groupBuy.status === '배송준비' },
                  { label: '배송중', icon: '🚚', active: groupBuy.status === '배송중' },
                  { label: '수령', icon: '✅', active: groupBuy.status === '배송완료' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 relative z-10 bg-white px-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${step.active ? 'bg-emerald-500 text-white ring-4 ring-emerald-50' : 'bg-gray-50 text-gray-300 grayscale'}`}>
                      {step.icon}
                    </div>
                    <span className={`text-[11px] font-black ${step.active ? 'text-emerald-600' : 'text-gray-300'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 배송/픽업 정보 */}
            <section className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-[24px] space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">📍</div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">배송 유의사항</p>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed">{groupBuy.delivery_note}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 참여 멤버 정보 (배송안내 시 필요) */}
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">함께하는 멤버</h3>
              <div className="space-y-3">
                {participants.length > 0 ? participants.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-xs">🏪</div>
                      <span className="text-sm font-black text-gray-700">{p.bizname}</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase">결제완료</span>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 font-bold text-center py-4">참여 멤버 정보를 불러올 수 없습니다.</p>
                )}
              </div>
            </section>

            {/* 액션 버튼 (채팅 삭제) */}
            <div className="pt-6">
              <button 
                className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
                onClick={() => navigate('/group-buy')}
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupBuyDeliveryPage;
