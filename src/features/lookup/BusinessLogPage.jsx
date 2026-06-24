import React, { useState, useEffect, useCallback } from 'react';
import { useFinance } from './hooks/useFinance';
import { getRecentPayments } from '../../apis/account';
import authStore from '../../store/authStore';

/**
 * @file BusinessLogPage.jsx
 * @description 영업 일지 및 정산 내역 페이지 (영업일지.png, 캘린더.png, 정산내역.png 기반)
 */

/**
 * timezone-safe local date parser (returns YYYY-MM-DD in local time)
 */
const parseLocalDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) {
    return typeof dateVal === 'string' ? dateVal.split('T')[0] : '';
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BusinessLogPage = () => {
  const { selectedStoreSeq } = authStore();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    type: 'ALL'
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Card payments list state
  const [cardPayments, setCardPayments] = useState([]);
  const [cardPaymentsForCalendar, setCardPaymentsForCalendar] = useState([]);

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesForm, setSalesForm] = useState({
    targetDate: new Date().toISOString().substring(0, 10),
    amount: '',
    category: '매출',
    description: '일일 영업 매출 등록'
  });

  const { financeList, dailySummary, isLoading, fetchFinanceList, fetchDailySummary, addFinance } = useFinance();

  const loadCardPayments = useCallback(async () => {
    if (!selectedStoreSeq) return;
    try {
      const data = await getRecentPayments({ storeSeq: selectedStoreSeq, period: 'month' });
      setCardPayments(data || []);
    } catch (err) {
      console.error("카드 내역 조회 실패:", err);
    }
  }, [selectedStoreSeq]);

  useEffect(() => {
    setCurrentPage(1);
  }, [params]);

  useEffect(() => {
    if (viewMode === 'list') {
      fetchFinanceList(params);
      loadCardPayments();
    } else {
      fetchDailySummary(currentMonth);
      if (selectedStoreSeq) {
        const [year, month] = currentMonth.split('-').map(Number);
        const lastDay = new Date(year, month, 0).getDate();
        const startDate = `${currentMonth}-01`;
        const endDate = `${currentMonth}-${String(lastDay).padStart(2, '0')}`;
        
        // Fetch manual finance logs for calendar month range
        fetchFinanceList({ startDate, endDate, type: 'ALL' });
        
        getRecentPayments({ storeSeq: selectedStoreSeq, startDate, endDate, period: 'custom' })
          .then(data => setCardPaymentsForCalendar(data || []))
          .catch(err => console.error("캘린더 카드 내역 조회 실패:", err));
      }
    }
  }, [fetchFinanceList, fetchDailySummary, loadCardPayments, viewMode, params, currentMonth, selectedStoreSeq]);

  // Helper to generate correct calendar days based on currentMonth
  const getCalendarDays = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const startDayOfWeek = firstDay.getDay(); // 0: Sun, 1: Mon, ...
    const totalDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Fill previous month blank days
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, dateStr: '' });
    }
    
    // Fill current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateStr });
    }
    
    // Fill next month blank days to make it full rows (multiple of 7)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let i = 0; i < remaining; i++) {
      days.push({ day: null, dateStr: '' });
    }
    
    return days;
  };

  // Filter card payments in frontend to match current lookup criteria
  const filteredCardPayments = cardPayments.filter(p => {
    const date = parseLocalDate(p.paidAt);
    if (params.startDate && date < params.startDate) return false;
    if (params.endDate && date > params.endDate) return false;
    if (params.type === 'INCOME') return false; // Card payments are always expense
    return true;
  });

  // Combine manual finance logs and card transaction history
  const combinedList = [
    ...financeList.map(f => ({
      ...f,
      targetDate: parseLocalDate(f.targetDate)
    })),
    ...filteredCardPayments.map(p => ({
      financeSeq: `card-${p.paymentSeq}`,
      targetDate: parseLocalDate(p.paidAt),
      type: 'EXPENSE',
      category: '카드결제',
      description: `${p.partnerName} 대금 결제 (${p.cardCompany} ${p.cardNumberMasked})`,
      amount: p.totalAmount
    }))
  ].sort((a, b) => new Date(b.targetDate) - new Date(a.targetDate));

  const itemsPerPage = 5;
  const totalPages = Math.ceil(combinedList.length / itemsPerPage) || 1;
  const displayedList = combinedList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalIncome = combinedList.filter(f => f.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = combinedList.filter(f => f.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);

  const handleSaveSales = async (e) => {
    e.preventDefault();
    if (!salesForm.amount || isNaN(salesForm.amount)) {
      alert('올바른 금액을 입력해 주세요.');
      return;
    }

    const success = await addFinance({
      type: 'INCOME',
      amount: Number(salesForm.amount),
      category: salesForm.category,
      description: salesForm.description,
      targetDate: salesForm.targetDate
    });

    if (success) {
      alert('영업 매출이 등록되었습니다.');
      setIsModalOpen(false);
      // Reset Form
      setSalesForm({
        targetDate: new Date().toISOString().substring(0, 10),
        amount: '',
        category: '매출',
        description: '일일 영업 매출 등록'
      });
      // Refresh Lists
      fetchFinanceList(params);
      loadCardPayments();
      fetchDailySummary(currentMonth);
    } else {
      alert('등록 중 오류가 발생했습니다.');
    }
  };

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
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-amber-100 flex items-center gap-1.5"
          >
            <span>+</span> 오늘 매출 등록
          </button>
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
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">조회 기간</label>
              <div className="flex items-center gap-3">
                <input 
                  type="date" 
                  className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500 min-w-[130px]"
                  onChange={(e) => setParams(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <span className="text-gray-300 shrink-0 font-bold">~</span>
                <input 
                  type="date" 
                  className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500 min-w-[130px]"
                  onChange={(e) => setParams(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="md:col-span-1">
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
                ) : displayedList.length > 0 ? (
                  displayedList.map((item) => (
                    <tr key={item.financeSeq} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 text-sm font-bold text-gray-400 text-center">
                        {item.targetDate ? item.targetDate.split('T')[0].replace(/(\d{4})-(\d{2})-(\d{2})/, '$1년 $2월 $3일') : '-'}
                      </td>
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

          {/* 페이지네이션 */}
          {!isLoading && combinedList.length > 0 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
              >
                ←
              </button>
              {(() => {
                const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
                const endPage = Math.min(startPage + 9, totalPages);
                const pageButtons = [];
                for (let i = startPage; i <= endPage; i++) {
                  pageButtons.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                        currentPage === i 
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' 
                          : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                return pageButtons;
              })()}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
              >
                →
              </button>
            </div>
          )}
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
            {getCalendarDays().map((cell, i) => {
              if (!cell.day) {
                return <div key={`empty-${i}`} className="bg-gray-50/50 min-h-[120px]" />;
              }
              
              const { day, dateStr } = cell;
              
              const dayFinanceLogs = financeList.filter(f => parseLocalDate(f.targetDate) === dateStr);
              const dayCardPayments = cardPaymentsForCalendar.filter(p => parseLocalDate(p.paidAt) === dateStr);

              return (
                <div key={dateStr} className="bg-white min-h-[140px] p-3 flex flex-col justify-between group hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-400 group-hover:text-gray-900">{day}</span>
                  </div>
                  
                  {/* 각 지출 및 매출 내역 리스트 */}
                  <div className="flex-1 overflow-y-auto space-y-1 max-h-[90px] custom-scrollbar">
                    {/* 수입 내역 */}
                    {dayFinanceLogs.filter(f => f.type === 'INCOME').map((item, idx) => (
                      <div key={`income-${idx}`} className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex justify-between items-center gap-1" title={`${item.category}: ${item.description}`}>
                        <span className="truncate max-w-[45px]">{item.category}</span>
                        <span className="shrink-0">+{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    
                    {/* 지출 내역 */}
                    {dayFinanceLogs.filter(f => f.type === 'EXPENSE').map((item, idx) => (
                      <div key={`expense-${idx}`} className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded flex justify-between items-center gap-1" title={`${item.category}: ${item.description}`}>
                        <span className="truncate max-w-[45px]">{item.category}</span>
                        <span className="shrink-0">-{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    
                    {/* 카드 지출 내역 */}
                    {dayCardPayments.map((item, idx) => (
                      <div key={`card-${idx}`} className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded flex justify-between items-center gap-1" title={`${item.partnerName} 결제: ${item.cardNumberMasked || ''}`}>
                        <span className="truncate max-w-[45px]">{item.partnerName || '카드'}</span>
                        <span className="shrink-0">-{item.totalAmount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* 오늘 매출 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-2xl w-[480px] max-w-[90vw] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                오늘 매출 등록
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSales} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">영업 날짜</label>
                <input
                  type="date"
                  required
                  value={salesForm.targetDate}
                  onChange={(e) => setSalesForm(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">매출 금액 (원)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="금액을 입력하세요"
                  value={salesForm.amount}
                  onChange={(e) => setSalesForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">분류 (카테고리)</label>
                <input
                  type="text"
                  required
                  placeholder="예: 매출, 주말매출, 배달매출"
                  value={salesForm.category}
                  onChange={(e) => setSalesForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">상세 메모</label>
                <textarea
                  rows="3"
                  placeholder="상세 내용을 입력하세요"
                  value={salesForm.description}
                  onChange={(e) => setSalesForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-all text-sm"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black transition-all text-sm shadow-lg shadow-amber-100"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLogPage;
