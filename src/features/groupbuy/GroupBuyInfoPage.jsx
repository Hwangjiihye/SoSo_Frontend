import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGroupBuy } from './hooks/useGroupBuy';

/**
 * @file GroupBuyInfoPage.jsx
 * @description 공동구매 상세 정보 내역을 보여주는 프리미엄 UI 페이지
 */
const GroupBuyInfoPage = () => {
  const { seq } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { groupBuys, isLoading } = useGroupBuy();
  const [item, setItem] = useState(location.state?.item || null);

  useEffect(() => {
    if (!item && groupBuys && groupBuys.length > 0) {
      const found = groupBuys.find(g => String(g.seq) === String(seq) || String(g.groupBuySeq) === String(seq));
      setItem(found);
    }
  }, [seq, groupBuys, item]);

  if (!item && isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-black text-gray-400 bg-[#F8F9FA] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="tracking-widest uppercase">Fetching Details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-black text-gray-900 bg-[#F8F9FA] pb-24 space-y-4">
        <div className="text-5xl mb-2">📄</div>
        <p className="text-xl">해당 그룹의 상세 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
          뒤로 가기
        </button>
      </div>
    );
  }

  const progress = Math.min(Math.round((item.currentParticipants / item.targetParticipants) * 100), 100) || 0;

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

  const displayStatus = translateStatus(item.status);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-gray-900">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 상단 네비게이션바 */}
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
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Detail History</p>
            <h1 className="text-lg font-black text-gray-900">상세 내역 조회</h1>
          </div>
          <div className="w-12"></div> {/* 여백 맞춤용 */}
        </div>

        {/* 메인 상세 카드 */}
        <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden relative">
          {/* 장식용 배경 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

          <div className="p-8 sm:p-10 relative z-10">
            {/* 카테고리 & 뱃지 */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black border border-emerald-100">
                {item.category || '기타'}
              </span>
              <span className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-black shadow-md shadow-gray-200">
                {item.dDay || 'D-Day'}
              </span>
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100">
                {displayStatus}
              </span>
            </div>

            {/* 제목 */}
            <h2 className="text-3xl sm:text-4xl font-black mb-3 leading-tight tracking-tight">
              {item.groupName}
            </h2>
            <p className="text-sm font-bold text-gray-400 flex items-center gap-2 mb-10">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              {item.partnerName || '미지정 사업자'}
            </p>

            {/* 모집 진행률 */}
            <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 shadow-sm mb-6">
              <div className="flex justify-between items-end mb-3">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="text-emerald-500">🔥</span> 모집 현황
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">{item.currentParticipants || 0}</span>
                  <span className="text-sm font-bold text-gray-400"> / {item.targetParticipants || 0}명</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 상품 정보 그리드 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">단가</p>
                <p className="text-xl font-black text-gray-900 tracking-tight">₩{item.unitPrice?.toLocaleString() || '0'}</p>
              </div>
              <div className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">수량 / 묶음</p>
                <p className="text-xl font-black text-gray-900 tracking-tight">{item.quantity || '1'}개</p>
              </div>
            </div>

            {/* 핵심 정보 그리드 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">총 결제/목표 금액</p>
                <p className="text-xl font-black text-gray-900 tracking-tight">
                  ₩{item.totalAmount?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex flex-col justify-center">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">마감 일자</p>
                <p className="text-xl font-black text-gray-900 tracking-tight">
                  {item.endDate ? item.endDate.split('T')[0] : '미지정'}
                </p>
              </div>
              {item.paymentStatus && (
                <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[24px] shadow-sm flex flex-col justify-center">
                  <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-2">결제 상태</p>
                  <p className="text-xl font-black text-indigo-900 tracking-tight">{item.paymentStatus}</p>
                </div>
              )}
              {item.deliveryStatus && (
                <div className="p-6 bg-teal-50/50 border border-teal-100 rounded-[24px] shadow-sm flex flex-col justify-center">
                  <p className="text-[11px] font-black text-teal-400 uppercase tracking-widest mb-2">배송 상태</p>
                  <p className="text-xl font-black text-teal-900 tracking-tight">{item.deliveryStatus}</p>
                </div>
              )}
            </div>

            {/* 픽업 장소 및 시간 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-6 bg-blue-50/30 rounded-[24px] border border-blue-50 shadow-sm">
                <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="p-2 bg-blue-100 rounded-xl text-base">📍</span> 픽업 장소
                </h3>
                <p className="text-base font-bold text-gray-800 leading-relaxed pl-1 break-keep">
                  {item.pickupLocation || '지정된 픽업 장소가 없습니다.'}
                </p>
              </div>
              <div className="p-6 bg-purple-50/30 rounded-[24px] border border-purple-50 shadow-sm">
                <h3 className="text-[11px] font-black text-purple-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="p-2 bg-purple-100 rounded-xl text-base">⏰</span> 픽업 시간
                </h3>
                <p className="text-base font-bold text-gray-800 leading-relaxed pl-1 break-keep">
                  {item.pickupTime || '상시 픽업 가능 (상세 미지정)'}
                </p>
              </div>
            </div>

            {/* 유의사항 */}
            {item.notice && (
              <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 shadow-sm">
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="p-2 bg-gray-200 rounded-xl text-base">📌</span> 유의사항
                </h3>
                <p className="text-base font-bold text-gray-700 leading-relaxed break-keep whitespace-pre-wrap pl-1">
                  {item.notice}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupBuyInfoPage;
