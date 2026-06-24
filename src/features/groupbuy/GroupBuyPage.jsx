import React, { useState } from 'react';
import { useGroupBuy } from './hooks/useGroupBuy';
import GroupBuyCreateModal from './components/GroupBuyCreateModal';
import GroupBuyStatusModal from './components/GroupBuyStatusModal';
import { useNavigate } from 'react-router-dom';

/**
 * @file GroupBuyPage.jsx
 * @description 공동구매 메인 페이지 (사업자 및 거래처 요구사항 통합 반영)
 */
const GroupBuyPage = () => {
  const navigate = useNavigate();
  const {
    groupBuys,
    isLoading,
    filter,
    setFilter,
    myCount,
    globalStats,
    user_type,
    handleCreateGroupBuy,
    handleUpdateStatus,
  } = useGroupBuy();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);

  const isPartner = user_type === 'PARTNER';

  // 거래처일 경우 내가 올린 항목만 필터링 (isOwner 필드 기준)
  const displayGroupBuys = isPartner 
    ? groupBuys.filter(item => item.isOwner)
    : groupBuys;

  const statusColors = {
    '모집중': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    '모집완료': 'bg-blue-50 text-blue-600 border-blue-100',
    '배송중': 'bg-orange-50 text-orange-600 border-orange-100',
    '수령': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    '배분중': 'bg-purple-50 text-purple-600 border-purple-100',
    '완료': 'bg-gray-100 text-gray-600 border-gray-200',
    '취소': 'bg-red-50 text-red-600 border-red-100',
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

  // 날짜 포맷 (yyyy-mm-dd 또는 yyyy:mm:dd)
  const formatEndDate = (dateStr) => {
    if (!dateStr) return '';
    // 만약 yyyy:mm:dd 형태로 콜론을 원하신다면 아래 '-'를 ':'로 변경
    return dateStr.split('T')[0].replace(/-/g, '-');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 상단 통계 바 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">참여 가능한 그룹</p>
            <h3 className="text-3xl font-black text-gray-900">{globalStats.ongoing}건</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">나의 참여 그룹</p>
            <h3 className="text-3xl font-black text-emerald-600">{myCount}건</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">완료된 그룹</p>
            <h3 className="text-3xl font-black text-blue-600">{globalStats.delivered}건</h3>
          </div>
        </div>

        {/* 헤더 섹션 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-10 bg-emerald-500 rounded-full"></span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {isPartner ? '공동구매 관리' : '공동구매 현황'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* 사업자용 공동그룹 생성 버튼 (요구사항 반영) */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`flex-1 sm:flex-none px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 ${
                isPartner ? 'bg-gray-900 text-white hover:bg-black shadow-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
              }`}
            >
              + 공동그룹 생성
            </button>
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-[22px] shadow-sm border border-gray-100 w-fit mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 sm:px-8 py-3 rounded-[16px] text-sm font-black transition-all ${
              filter === 'all' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            참여 가능한 그룹
          </button>
          <button
            onClick={() => setFilter('my')}
            className={`px-6 sm:px-8 py-3 rounded-[16px] text-sm font-black transition-all ${
              filter === 'my' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            나의 참여 그룹
          </button>
          {/* 나중에 구현할 예정 (사업자 주관, 거래처 주관 필터)
          <button
            onClick={() => setFilter('business')}
            className={`px-6 sm:px-8 py-3 rounded-[16px] text-sm font-black transition-all ${
              filter === 'business' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            사업자 주관
          </button>
          <button
            onClick={() => setFilter('partner')}
            className={`px-6 sm:px-8 py-3 rounded-[16px] text-sm font-black transition-all ${
              filter === 'partner' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            거래처 주관
          </button>
          */}
        </div>

        {/* 공동구매 리스트 (가로형 레이아웃 반영) */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-black text-sm tracking-widest uppercase">Fetching Groups...</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {displayGroupBuys.map((item) => {
              const progress = Math.min(Math.round((item.currentParticipants / item.targetParticipants) * 100), 100);
              const isJoined = item.isJoined;
              const displayStatus = translateStatus(item.status);

              return (
                <div 
                  key={item.groupBuySeq} 
                  className={`group bg-white rounded-[24px] border-2 transition-all duration-500 flex flex-col lg:flex-row overflow-hidden hover:-translate-y-1 ${
                    isJoined 
                      ? 'border-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.15)] bg-emerald-50/5' 
                      : 'border-gray-50 shadow-sm hover:shadow-lg'
                  }`}
                >
                  {/* 좌측/상단: 메인 콘텐츠 및 메타 정보 */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black border tracking-wider transition-colors ${statusColors[displayStatus] || 'bg-gray-100 text-gray-600'}`}>
                            {displayStatus}
                          </span>
                          {/* 사업자 / 거래처 제안 구분 뱃지 나중에 필요 시 해제
                          {item.creatorType === 'BUSINESS' ? (
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black border border-blue-100 shadow-sm">
                              사업자 제안
                            </span>
                          ) : (
                            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black border border-orange-100 shadow-sm">
                              거래처 제안
                            </span>
                          )}
                          */}
                          {item.paymentStatus && (
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black border border-indigo-100 shadow-sm">
                              💳 {item.paymentStatus}
                            </span>
                          )}
                          {item.deliveryStatus && (
                            <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-lg text-[10px] font-black border border-teal-100 shadow-sm">
                              📦 {item.deliveryStatus}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1.5 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {item.groupName}
                      </h3>
                      {!isPartner && (
                        <p className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          {item.partnerName}
                        </p>
                      )}

                      {/* 마감일 및 픽업 위치 */}
                      <div className="flex flex-col sm:flex-row gap-2 mb-4 text-xs font-bold text-gray-500">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <span className="text-sm">⏰</span>
                          <span>마감: <span className="text-gray-900">{formatEndDate(item.endDate)}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex-1">
                          <span className="text-sm">📍</span>
                          <span className="line-clamp-1">픽업: <span className="text-gray-900">{item.pickupLocation || '미지정'}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                        <div className="text-right">
                          <span className="text-lg font-black text-emerald-600">{item.currentParticipants}</span>
                          <span className="text-xs font-bold text-gray-300"> / {item.targetParticipants}명</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden border border-gray-50">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* 우측/하단: 결제 금액 및 액션 버튼 */}
                  <div className="w-full lg:w-[260px] p-5 bg-gray-50/50 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-center shrink-0">
                    {!isPartner && (
                      <div className="mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">총 참여 금액</p>
                        <span className="text-2xl font-black text-gray-900 tracking-tight">₩{item.totalAmount?.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 mt-auto">
                      {(!isPartner && displayStatus === '모집중' && !isJoined) ? (
                        <button
                          onClick={() => navigate(`/group-buy/${item.groupBuySeq || item.seq}`)}
                          className="w-full py-3 bg-emerald-600 text-white rounded-[14px] font-black text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100 active:scale-95"
                        >
                          그룹 참여하기
                        </button>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => navigate(`/group-buy/${item.groupBuySeq || item.seq}/info`, { state: { item } })}
                              className="py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs hover:bg-emerald-100 transition-all"
                            >
                              상세 정보 내역
                            </button>
                            <button
                              onClick={() => navigate(`/group-buy/${item.groupBuySeq || item.seq}/delivery`)}
                              className="py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs hover:bg-black transition-all shadow-md"
                            >
                              배송 안내
                            </button>
                          </div>
                          {/* 나중에 구현할 예정 (채팅방)
                          <button
                            onClick={() => navigate(`/chat/${item.groupBuySeq || item.seq}`)}
                            className="w-full py-2.5 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-black text-xs hover:bg-gray-50 transition-all"
                          >
                            채팅방 입장
                          </button>
                          */}
                        </>
                      )}
                      
                      {isPartner && (
                        <button
                          onClick={() => {
                            setSelectedGroupBuy(item);
                            setIsStatusModalOpen(true);
                          }}
                          className="w-full py-2.5 bg-orange-50 text-orange-600 rounded-xl font-black text-xs hover:bg-orange-100 transition-all mt-1 border border-orange-100"
                        >
                          상태 업데이트
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isCreateModalOpen && <GroupBuyCreateModal onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateGroupBuy} isPartner={isPartner} />}
      {isStatusModalOpen && (
        <GroupBuyStatusModal 
          groupBuy={selectedGroupBuy} 
          onClose={() => setIsStatusModalOpen(false)} 
          onUpdate={handleUpdateStatus} 
        />
      )}
    </div>
  );
};

export default GroupBuyPage;
