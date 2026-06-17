import React, { useState, useEffect } from 'react';
import { useFinance } from './hooks/useFinance';

/**
 * @file BusinessLogPage.jsx
 * @description 영업 일지 및 정산 내역 페이지 (영업일지.png, 캘린더.png, 정산내역.png 기반)
 */
const BusinessLogPage = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    type: 'ALL'
  });

  const { financeList, dailySummary, isLoading, fetchFinanceList, fetchDailySummary } = useFinance();

  useEffect(() => {
    if (viewMode === 'list') {
      fetchFinanceList(params);
    } else {
      fetchDailySummary(currentMonth);
    }
  }, [fetchFinanceList, fetchDailySummary, viewMode, params, currentMonth]);

  const totalIncome = financeList.filter(f => f.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = financeList.filter(f => f.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 text-sm">📝</span>
            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Finance & Logs</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">영업 일지 및 정산 관리</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">매일의 매출, 지출 기록과 정산 내역을 통합 관리합니다.</p>
        </div>
        <div className="bg-gray-100 p-1 rounded-2xl flex">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            리스트 보기
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            캘린더 보기
          </button>
        </div>
      </header>

      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Total Income</div>
          <div className="text-3xl font-black text-gray-900">{totalIncome.toLocaleString()}원</div>
          <div className="mt-2 text-xs text-gray-400 font-bold">조회 기간 합계</div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">Total Expense</div>
          <div className="text-3xl font-black text-gray-900">{totalExpense.toLocaleString()}원</div>
          <div className="mt-2 text-xs text-gray-400 font-bold">조회 기간 합계</div>
        </div>
        <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-xl shadow-gray-200">
          <div className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Net Profit</div>
          <div className="text-3xl font-black text-white">{(totalIncome - totalExpense).toLocaleString()}원</div>
          <div className="mt-2 text-xs text-white/40 font-bold">순이익</div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* 필터 섹션 */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">조회 기간</label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500"
                  onChange={(e) => setParams(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <span className="text-gray-300">~</span>
                <input 
                  type="date" 
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500"
                  onChange={(e) => setParams(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">구분</label>
              <select 
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500 appearance-none"
                onChange={(e) => setParams(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="ALL">전체 보기</option>
                <option value="INCOME">수익 (+)</option>
                <option value="EXPENSE">지출 (-)</option>
              </select>
            </div>
          </div>

          {/* 장부 리스트 테이블 */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">날짜</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">구분</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">카테고리</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider">상세 내용</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse">기록을 불러오는 중...</td></tr>
                ) : financeList.length > 0 ? (
                  financeList.map((item) => (
                    <tr key={item.financeSeq} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 text-sm font-bold text-gray-400 text-center">{item.targetDate}</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          item.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {item.type === 'INCOME' ? '수익' : '지출'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[13px] font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">{item.category}</span>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium text-gray-600">{item.description}</td>
                      <td className={`px-8 py-6 text-lg font-black text-right ${
                        item.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {item.type === 'INCOME' ? '+' : '-'}{item.amount.toLocaleString()}원
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                      <div className="text-5xl mb-6 opacity-20">📝</div>
                      <p className="text-gray-400 font-bold">등록된 장부 기록이 없습니다.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-900">{currentMonth.split('-')[0]}년 {currentMonth.split('-')[1]}월</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const [y, m] = currentMonth.split('-').map(Number);
                  const prev = m === 1 ? `${y-1}-12` : `${y}-${String(m-1).padStart(2, '0')}`;
                  setCurrentMonth(prev);
                }}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
              >
                ←
              </button>
              <button 
                onClick={() => {
                  const [y, m] = currentMonth.split('-').map(Number);
                  const next = m === 12 ? `${y+1}-01` : `${y}-${String(m+1).padStart(2, '0')}`;
                  setCurrentMonth(next);
                }}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
              >
                →
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {['일', '월', '화', '수', '목', '금', '토'].map(d => (
              <div key={d} className="bg-gray-50 py-4 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
            ))}
            {[...Array(35)].map((_, i) => {
              const day = i + 1; // Simplified calendar logic
              const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
              const summary = dailySummary.find(s => s.targetDate === dateStr);
              
              return (
                <div key={i} className="bg-white min-h-[120px] p-4 flex flex-col justify-between group hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-bold text-gray-300 group-hover:text-gray-900">{day}</span>
                  {summary && (
                    <div className="space-y-1">
                      {summary.totalIncome > 0 && (
                        <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex justify-between">
                          <span>+</span>
                          <span>{summary.totalIncome.toLocaleString()}</span>
                        </div>
                      )}
                      {summary.totalExpense > 0 && (
                        <div className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded flex justify-between">
                          <span>-</span>
                          <span>{summary.totalExpense.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLogPage;
