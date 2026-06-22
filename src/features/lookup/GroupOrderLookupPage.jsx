import React, { useEffect } from 'react';
import { useGroupBuyLookup } from './hooks/useGroupBuyLookup';

/**
 * @file GroupOrderLookupPage.jsx
 * @description 공동구매 참여 이력 조회 페이지
 */
const GroupOrderLookupPage = () => {
  const { history, isLoading, fetchHistory } = useGroupBuyLookup();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 text-sm">🤝</span>
            <span className="text-[11px] font-black text-purple-500 uppercase tracking-widest">Group Buy</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">공동구매 참여 이력</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">참여한 모든 공동구매의 진행 상태와 이력을 확인합니다.</p>
        </div>
      </header>

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">전체 참여 건수</div>
          <div className="text-2xl font-black text-gray-900">{history.length}건</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">완료된 구매</div>
          <div className="text-2xl font-black text-emerald-600">
            {history.filter(h => h.status === 'COMPLETED').length}건
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">진행 중인 구매</div>
          <div className="text-2xl font-black text-blue-600">
            {history.filter(h => h.status !== 'COMPLETED' && h.status !== 'CLOSED').length}건
          </div>
        </div>
        <div className="bg-purple-600 p-6 rounded-[2rem] shadow-lg shadow-purple-100">
          <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">누적 절감액</div>
          <div className="text-2xl font-black text-white">{(history.length * 15200).toLocaleString()}원</div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">참여일</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">상태</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider">공동구매 품목</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">목표 대비 달성</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">마감일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse">데이터를 불러오는 중...</td></tr>
            ) : history.length > 0 ? (
              history.map((gb) => (
                <tr key={gb.groupBuySeq} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-gray-400 text-center">
                    {gb.createdAt?.split('T')[0]}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      gb.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 
                      gb.status === 'RECRUITING' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {gb.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[15px] font-black text-gray-900">{gb.itemName}</div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="w-full max-w-[120px] mx-auto bg-gray-100 h-2 rounded-full overflow-hidden mb-1">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all" 
                        style={{ width: `${Math.min(100, (gb.currentQuantity / gb.targetQuantity) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">
                      {gb.currentQuantity} / {gb.targetQuantity}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-rose-500 text-center uppercase">
                    {gb.endDate?.split('T')[0]}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-32 text-center">
                  <div className="text-5xl mb-6 opacity-20">🤝</div>
                  <p className="text-gray-400 font-bold">참여한 공동구매 이력이 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupOrderLookupPage;
