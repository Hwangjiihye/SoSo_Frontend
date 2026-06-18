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
    user_type,
    handleCreateGroupBuy,
    handleUpdateStatus,
  } = useGroupBuy();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedGroupBuy, setSelectedGroupBuy] = useState(null);

  const isPartner = user_type === 'PARTNER';

  // 거래처일 경우 내가 올린 항목만 필터링 (is_owner 필드 기준)
  const displayGroupBuys = isPartner 
    ? groupBuys.filter(item => item.is_owner)
    : groupBuys;

  const statusColors = {
    '모집중': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    '모집완료': 'bg-blue-50 text-blue-600 border-blue-100',
    '배송준비': 'bg-orange-50 text-orange-600 border-orange-100',
    '배송중': 'bg-purple-50 text-purple-600 border-purple-100',
    '배송완료': 'bg-gray-100 text-gray-600 border-gray-200',
    '모집실패': 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 상단 통계 바 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">진행 중인 그룹</p>
            <h3 className="text-3xl font-black text-gray-900">{groupBuys.filter(i => i.status === '모집중').length}건</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">나의 참여 그룹</p>
            <h3 className="text-3xl font-black text-emerald-600">{groupBuys.filter(i => i.is_joined).length}건</h3>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">배송완료</p>
            <h3 className="text-3xl font-black text-blue-600">{groupBuys.filter(i => i.status === '배송완료').length}건</h3>
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
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-[22px] shadow-sm border border-gray-100 w-fit mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-8 py-3 rounded-[16px] text-sm font-black transition-all ${
              filter === 'all' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            모든 그룹
          </button>
          <button
            onClick={() => setFilter('my')}
            className={`px-8 py-3 rounded-[16px] text-sm font-black transition-all ${
              filter === 'my' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            나의 참여 그룹
          </button>
        </div>

        {/* 공동구매 카드 리스트 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-black text-sm tracking-widest uppercase">Fetching Groups...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayGroupBuys.map((item) => {
              const progress = Math.min(Math.round((item.current_participants / item.target_participants) * 100), 100);
              const isJoined = item.is_joined;

              return (
                <div 
                  key={item.seq} 
                  className={`group bg-white rounded-[40px] border-2 transition-all duration-500 flex flex-col hover:-translate-y-2 ${
                    isJoined 
                      ? 'border-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.15)] bg-emerald-50/5' 
                      : 'border-gray-50 shadow-sm hover:shadow-xl'
                  }`}
                >
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border tracking-wider ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                      {isJoined && (
                        <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black animate-pulse shadow-lg shadow-emerald-200">
                          참여 중
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    {!isPartner && <p className="text-sm font-bold text-gray-400 mb-8">{item.supplier_name}</p>}

                    <div className="space-y-5 mb-10 flex-1">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recruitment</span>
                        <div className="text-right">
                          <span className="text-xl font-black text-emerald-600">{item.current_participants}</span>
                          <span className="text-xs font-bold text-gray-300"> / {item.target_participants}명</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-50">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {!isPartner && (
                      <div className="flex items-center justify-between py-6 border-t border-gray-50 mb-8">
                        <div>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">참여 금액</p>
                          <span className="text-2xl font-black text-gray-900">₩{item.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                      {(!isPartner && item.status === '모집중' && !isJoined) ? (
                        <button
                          onClick={() => navigate(`/group-buy/${item.seq}`)}
                          className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                        >
                          그룹 참여하기
                        </button>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => navigate(`/group-buy/${item.seq}`)}
                              className="py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm hover:bg-emerald-100 transition-all"
                            >
                              참여 현황
                            </button>
                            <button
                              onClick={() => navigate(`/group-buy/${item.seq}/delivery`)}
                              className="py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg"
                            >
                              배송 안내
                            </button>
                          </div>
                          <button
                            onClick={() => navigate(`/chat/${item.seq}`)}
                            className="w-full py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all"
                          >
                            채팅방 입장
                          </button>
                        </>
                      )}
                      
                      {isPartner && (
                        <button
                          onClick={() => {
                            setSelectedGroupBuy(item);
                            setIsStatusModalOpen(true);
                          }}
                          className="w-full py-4 bg-orange-50 text-orange-600 rounded-2xl font-black text-sm hover:bg-orange-100 transition-all mt-2"
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
