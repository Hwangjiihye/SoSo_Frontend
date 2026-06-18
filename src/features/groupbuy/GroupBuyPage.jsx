import React, { useState } from 'react';
import { useGroupBuy } from './hooks/useGroupBuy';
import GroupBuyCreateModal from './components/GroupBuyCreateModal';
import GroupBuyStatusModal from './components/GroupBuyStatusModal';
import GroupBuyParticipantModal from './components/GroupBuyParticipantModal';
import { useNavigate } from 'react-router-dom';

/**
 * @file GroupBuyPage.jsx
 * @description 공동구매 메인 페이지 (사업자용 요구사항 집중 반영)
 */
const GroupBuyPage = () => {
  const navigate = useNavigate();
  const {
    groupBuys,
    isLoading,
    filter,
    setFilter,
    statusFilter,
    setStatusFilter,
    user_type,
    handleCreateGroupBuy,
    handleJoinGroupBuy,
    handleUpdateStatus,
  } = useGroupBuy();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);

  const isPartner = user_type === 'PARTNER';

  const statusColors = {
    '모집중': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    '모집완료': 'bg-blue-50 text-blue-600 border-blue-100',
    '배송준비': 'bg-orange-50 text-orange-600 border-orange-100',
    '배송중': 'bg-purple-50 text-purple-600 border-purple-100',
    '배송완료': 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 상단 통계 바 (요구사항: 이번달 절감 -> 배송완료) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">진행 중인 그룹</p>
            <h3 className="text-3xl font-black text-gray-900">{groupBuys.filter(i => i.status === '모집중').length}건</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">나의 참여 그룹</p>
            <h3 className="text-3xl font-black text-emerald-600">{groupBuys.filter(i => i.is_joined).length}건</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">배송완료</p>
            <h3 className="text-3xl font-black text-blue-600">{groupBuys.filter(i => i.status === '배송완료').length}건</h3>
          </div>
        </div>

        {/* 헤더 섹션 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {isPartner ? '공동구매 관리' : '공동구매 현황'}
              </h2>
            </div>
          </div>
          
          {isPartner && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl"
            >
              + 공동그룹 생성
            </button>
          )}
        </div>

        {/* 필터 섹션 (나의 참여 그룹과 모든 그룹 필터링 가능) */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-[20px] shadow-sm border border-gray-100 w-fit mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-[14px] text-sm font-black transition-all ${
              filter === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            모든 그룹
          </button>
          <button
            onClick={() => setFilter('my')}
            className={`px-6 py-2.5 rounded-[14px] text-sm font-black transition-all ${
              filter === 'my' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            나의 참여 그룹
          </button>
        </div>

        {/* 공동구매 카드 리스트 */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 font-bold">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupBuys.map((item) => {
              const progress = Math.min(Math.round((item.current_participants / item.target_participants) * 100), 100);
              
              return (
                <div 
                  key={item.seq} 
                  className={`bg-white rounded-[32px] border-2 transition-all duration-300 overflow-hidden flex flex-col ${
                    item.is_joined ? 'border-emerald-500 shadow-emerald-100 shadow-xl' : 'border-gray-50 shadow-sm'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                      {item.is_joined && (
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black animate-pulse">
                          참여 중
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-sm font-bold text-gray-400 mb-6">{item.supplier_name}</p>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-black text-gray-400">모집인원</span>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-600">{item.current_participants}</span>
                          <span className="text-xs font-bold text-gray-300"> / {item.target_participants}명</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-300 uppercase mb-0.5">총 금액</p>
                        <span className="text-xl font-black text-gray-900">₩{item.price?.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* 버튼 그룹 (요구사항 반영) */}
                    <div className="grid grid-cols-1 gap-4 mt-10">
                      {/* 사업자 참여 버튼 (페이지 전환 요구사항 반영) */}
                      {!isPartner && !item.is_joined && item.status === '모집중' && (
                        <button
                          onClick={() => navigate(`/group-buy/${item.seq}`)}
                          className="w-full py-6 bg-emerald-600 text-white rounded-[32px] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 hover:-translate-y-1 active:scale-95"
                        >
                          그룹 참여
                        </button>
                      )}
                      
                      {(item.is_joined || isPartner) && (
                        <>
                          <button
                            onClick={() => navigate(`/group-buy/${item.seq}/delivery`)}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg"
                          >
                            {item.status === '배송완료' ? '수령 확인' : '배송 안내'}
                          </button>
                          <button
                            onClick={() => navigate(`/chat/${item.seq}`)}
                            className="w-full py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black hover:bg-gray-50 transition-all"
                          >
                            채팅하기
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 모달 */}
      {isCreateModalOpen && <GroupBuyCreateModal onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateGroupBuy} isPartner={isPartner} />}
    </div>
  );
};

export default GroupBuyPage;
