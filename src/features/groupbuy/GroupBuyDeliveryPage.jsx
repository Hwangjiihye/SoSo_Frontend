import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupBuyApi } from '../../apis/groupBuyApi';
import authStore from '../../store/authStore';
import GroupBuyStatusModal from './components/GroupBuyStatusModal';

/**
 * @file GroupBuyDeliveryPage.jsx
 * @description 사업자용 픽업 안내 페이지 (c4.png 와이어프레임 준수)
 * 요구사항: 
 * 1. 픽업진행단계 - QR코드 제시 삭제 -> '수령' 단계로 변경 (3단계)
 * 2. 채팅보기 버튼 삭제
 * 3. 내 배송지 정보 삭제
 * 4. 참여 멤버들의 정보 나열
 */
const GroupBuyDeliveryPage = () => {
  const { seq } = useParams();
  const navigate = useNavigate();
  const [groupBuy, setGroupBuy] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  const { user_seq } = authStore();

  const fetchGroupBuyData = async () => {
    setIsLoading(true);
    try {
      // 1. 실제 API 연동 시도
      const data = await groupBuyApi.getGroupBuyDetail(seq);
      setGroupBuy({
        ...data,
        groupBuySeq: data.groupBuySeq || seq,
        // DTO 필드를 UI용으로 매핑
        title: data.groupName,
        status: data.status,
        delivery_note: data.notice || '등록된 배송 유의사항이 없습니다.',
        pickup_location: data.pickupLocation,
        supplier_name: data.partnerName,
        arrival_time: data.pickupTime || '미정',
        userSeq: data.userSeq
      });
    } catch (error) {
      console.error('Failed to fetch real delivery info, using mock:', error);
      // 2. Mock 데이터 폴백
      setGroupBuy({
        groupBuySeq: seq,
        userSeq: 1, // 테스트를 위해 임의의 작성자 1번으로 고정
        title: '한우 등심 (1+ 등급, 10kg)',
        status: 'SHIPPING',
        delivery_note: '정문 앞 무인 택배함 03번에 보관 예정입니다.',
        pickup_location: '서울특별시 강남구 테헤란로 123 소소빌딩 1층 정문 택배함',
        supplier_name: '상생 농장',
        arrival_time: '오늘 오후 4시 도착 예정'
      });
    }

    try {
      const participantData = await groupBuyApi.getParticipants(seq);
      setParticipants(participantData || [
        { bizname: '강남 김치찌개', user_nickname: '김사장' },
        { bizname: '서초 파스타', user_nickname: '이사장' },
        { bizname: '역삼 베이커리', user_nickname: '박사장' },
      ]);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupBuyData();
  }, [seq]);

  const handleUpdateStatus = async (groupBuySeq, status) => {
    try {
      await groupBuyApi.updateGroupBuyStatus(groupBuySeq, status);
      alert('상태가 변경되었습니다.');
      fetchGroupBuyData(); // 데이터 재로딩 (낙관적 업데이트 대신 확실하게 리로드)
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 영문 상태를 한글로 변환
  const translateStatus = (status) => {
    if (status === 'RECRUITING') return '모집중';
    if (status === 'RECRUITED') return '모집완료';
    if (status === 'SHIPPING') return '배송중';
    if (status === 'RECEIVED') return '수령';
    if (status === 'DISTRIBUTING') return '배분중';
    if (status === 'COMPLETED') return '완료';
    if (status === 'CANCELED') return '취소';
    return status;
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-black text-sm tracking-widest uppercase">Loading Pickup Info</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-gray-900">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 상단 헤더 & 뒤로가기 */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3.5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all group"
          >
            <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Delivery Info</p>
            <h1 className="text-lg font-black text-gray-900">배송 안내</h1>
          </div>
          <div className="w-12"></div> {/* 여백 맞춤용 */}
        </div>

        {/* 메인 콘텐츠 카드 */}
        <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden relative">
          {/* 상태 요약 섹션 */}
          <div className="bg-gray-900 p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Pickup Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-black text-emerald-500">{translateStatus(groupBuy.status)}</span>
                </div>
              </div>
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight tracking-tight">{groupBuy.title}</h2>
                {/* 작성자(개설자)인 경우에만 상태 업데이트 버튼 표시 */}
                {Number(groupBuy.userSeq) === Number(user_seq) && (
                  <button
                    onClick={() => setIsStatusModalOpen(true)}
                    className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[11px] font-black tracking-widest transition-all flex items-center gap-2 border border-white/10 shadow-sm"
                  >
                    상태 변경 ⚙️
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-300 text-sm font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🏢</span> {groupBuy.supplier_name}
                </span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="text-emerald-400">{groupBuy.arrival_time}</span>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-10">
            {/* 픽업 진행 단계 */}
            <section>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center">진행 단계</h3>
              <div className="flex justify-between items-start relative px-4">
                {/* 배경 선 */}
                <div className="absolute top-7 left-10 right-10 h-1 bg-gray-50 -z-0 rounded-full"></div>
                {/* 진행 선 */}
                <div 
                  className="absolute top-7 left-10 h-1 bg-emerald-500 transition-all duration-1000 rounded-full shadow-sm"
                  style={{ 
                    width: ['RECRUITING', 'RECRUITED'].includes(groupBuy.status) ? '0%' : 
                           groupBuy.status === 'SHIPPING' ? '25%' :
                           groupBuy.status === 'RECEIVED' ? '50%' :
                           groupBuy.status === 'DISTRIBUTING' ? '75%' : 'calc(100% - 60px)' 
                  }}
                ></div>

                {[
                  { label: '배송중', icon: '🚚', active: ['SHIPPING', 'RECEIVED', 'DISTRIBUTING', 'COMPLETED'].includes(groupBuy.status) },
                  { label: '수령', icon: '🏢', active: ['RECEIVED', 'DISTRIBUTING', 'COMPLETED'].includes(groupBuy.status) },
                  { label: '배분중', icon: '🛍️', active: ['DISTRIBUTING', 'COMPLETED'].includes(groupBuy.status) },
                  { label: '완료', icon: '✅', active: groupBuy.status === 'COMPLETED' },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 relative z-10 bg-white px-2">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${step.active ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 ring-4 ring-emerald-50' : 'bg-gray-50 text-gray-200 border border-gray-100'}`}>
                      {step.icon}
                    </div>
                    <span className={`text-[11px] font-black ${step.active ? 'text-emerald-600' : 'text-gray-300'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 수령 정보 섹션 */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">수령 정보</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 shadow-sm group hover:border-emerald-200 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm border border-gray-100">📍</div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">Pickup Location</p>
                      <p className="text-base font-black text-gray-900 leading-relaxed mb-3">{groupBuy.pickup_location}</p>
                      <button className="text-[11px] font-black text-emerald-500 flex items-center gap-1.5 hover:gap-2 transition-all">
                        지도에서 위치 확인하기
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50/30 rounded-[24px] border border-emerald-100/50 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm border border-emerald-100/50">📝</div>
                    <div>
                      <p className="text-[11px] font-black text-emerald-600 uppercase mb-1.5 tracking-widest">Delivery Notes</p>
                      <p className="text-base font-bold text-gray-700 leading-relaxed">{groupBuy.delivery_note}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 함께 참여 중인 멤버 */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">함께 수령하는 사장님</h3>
              </div>
              <div className="space-y-3">
                {participants.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:border-emerald-200 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg">🏪</div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{p.bizname}</p>
                        <p className="text-[11px] font-bold text-gray-400 tracking-wider">{p.user_nickname}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">결제완료</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* 상태 변경 모달 */}
      {isStatusModalOpen && (
        <GroupBuyStatusModal 
          groupBuy={groupBuy} 
          onClose={() => setIsStatusModalOpen(false)} 
          onUpdate={handleUpdateStatus} 
        />
      )}
    </div>
  );
};

export default GroupBuyDeliveryPage;
