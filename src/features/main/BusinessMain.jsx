/**
 * @file BusinessMain.jsx
 * @description '사업자' 대시보드 메인 페이지입니다.
 * authStore에서 실제 회원 정보를 가져와 프로필 영역에 표시하며, 훅 사용을 최적화했습니다.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import authStore from '../../store/authStore';
import { askRag } from "../../apis/ragApi";
import MainNotificationSession from './components/MainNotificationSession';
import { fetchBusinessDashboard } from '../../apis/mainApi';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { useStores } from '../../hooks/useStores';

function BusinessMain({ setRole }) {
  const navigate = useNavigate();
  const userSeq = authStore((state) => state.user_seq);
  const selectedStoreSeq = authStore((state) => state.selectedStoreSeq);


  // 🏪 [멀티 프로필] 사장님의 모든 매장 목록을 가져옵니다.
  const { stores, isLoading: isStoresLoading } = useStores();

  // 프로필 드롭다운 상태
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettlementMenuOpen, setIsSettlementMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  

  // 마이페이지 이동 핸들러
  const handleProfileClick = () => {
    if (user_type === 'BUSINESS') {
      navigate('/business-mypage');
      setIsProfileOpen(false); // 이동 시 드롭다운 닫기
    } else {
      alert("사업자 전용 마이페이지입니다.");
    }
  }

  const { user_type, logout, setSelectedStore } = authStore();
  

  const handleSend = async () => {
  if (!question.trim()) return;

  const userQuestion = question;

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: userQuestion,
    },
  ]);

  setQuestion("");
  setLoading(true);

  try {
    const result = await askRag(userQuestion);

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        content: result.answer,
      },
    ]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        content: "답변을 가져오는 중 오류가 발생했습니다.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  /**
   * 🔄 매장 전환 핸들러
   * 클릭한 매장으로 프로필을 전환하고 마이페이지로 이동합니다.
   */
  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    navigate('/business-mypage');
    setIsProfileOpen(false);
  };

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // --- 차트 데이터 영역 (기존과 동일) ---

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 실시간 대시보드 데이터 로딩
  useEffect(() => {
    if (!selectedStoreSeq || !userSeq) return;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await fetchBusinessDashboard(selectedStoreSeq, userSeq);
        setDashboard(data);
        setCurrentPage(1);
      } catch (err) {
        console.error('소상공인 대시보드 데이터 로드 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [selectedStoreSeq, userSeq]);

  // KPI 카드 바인딩
  const totalStocks = dashboard?.totalStocks ?? 0;
  const lackStocks = dashboard?.lackStocks ?? 0;
  const expiringSoon = dashboard?.expiringSoon ?? 0;
  const activeGroupBuys = dashboard?.activeGroupBuys ?? 0;

  // 1. 현재 재고 차트 데이터

  const stockChartData = {
    labels: dashboard?.stockStatus?.map(item => item.name) || [],
    datasets: [{
      label: '현재 재고',
      data: dashboard?.stockStatus?.map(item => item.value) || [],
      backgroundColor: [
        'rgba(16, 185, 129, 0.6)', 'rgba(59, 130, 246, 0.6)', 
        'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.6)',
        'rgba(139, 92, 246, 0.6)', 'rgba(236, 72, 153, 0.6)',
        'rgba(75, 85, 99, 0.6)', 'rgba(20, 184, 166, 0.6)'
      ],
      borderColor: [
        'rgb(16, 185, 129)', 'rgb(59, 130, 246)', 
        'rgb(245, 158, 11)', 'rgb(239, 68, 68)',
        'rgb(139, 92, 246)', 'rgb(236, 72, 153)',
        'rgb(75, 85, 99)', 'rgb(20, 184, 166)'
      ],
      borderWidth: 1,
      borderRadius: 8,
    }]
  };

  // 2. 월별 매출 차트 데이터 (만원 단위)
  const salesChartData = {
    labels: dashboard?.salesTrend?.map(item => item.month) || [],
    datasets: [{
      label: '매출액 (만원)',
      data: dashboard?.salesTrend?.map(item => Math.round(item.amount / 10000)) || [],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(16, 185, 129)',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
  };

  const groupOrders = dashboard?.groupOrders || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold text-sm">실제 데이터 기반 소상공인 대시보드를 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[
            { t: '총 재고', v: totalStocks.toLocaleString(), u: '개 품목', b: '현재 등록된 자재 정보', c: 'border-emerald-100' },
            { t: '부족 재고', v: lackStocks.toLocaleString(), u: '개 품목', b: '즉시 발주 필요', c: 'border-red-100', tc: 'text-red-600' },
            { t: '유통기한 임박', v: expiringSoon.toLocaleString(), u: '개 품목', b: '7일 이내 만료 예정', c: 'border-orange-100', tc: 'text-orange-600' },
            { t: '공동 발주', v: activeGroupBuys.toLocaleString(), u: '건 진행 중', b: '참여 가능 공구', c: 'border-emerald-100', tc: 'text-emerald-600' }
          ].map((s, i) => (
            <div key={i} className={`bg-white p-5 rounded-2xl border-2 shadow-sm ${s.c}`}>
              <div className="text-gray-500 text-sm mb-2">{s.t}</div>
              <div className="text-3xl font-extrabold mb-4">{s.v}<span className="text-sm font-medium text-gray-400 ml-1">{s.u}</span></div>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold bg-gray-50 ${s.tc || 'text-emerald-600 border-emerald-100'}`}>{s.b}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                현재 재고 현황 (상위 8개 품목)
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">기준: 실시간 보유 수량</span>
            </div>
            <div className="h-64">
              <Bar data={stockChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                월별 매출 현황 (INCOME 장부 기준)
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">단위: 만원</span>
            </div>
            <div className="h-64">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MainNotificationSession />
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-6 text-gray-700">공동 발주 현황</h3>
              <div className="space-y-4">
                {groupOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">참여 가능한 공동 구매가 없습니다.</div>
                ) : (
                  (() => {
                    const currentGroupOrders = groupOrders.slice((currentPage - 1) * 4, currentPage * 4);
                    return currentGroupOrders.map(o => (
                      <div key={o.id} className="border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all">
                        <div className="flex justify-between mb-4"><h4 className="text-sm font-bold text-gray-900">{o.title}</h4><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${o.status === '모집 중' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-red-500 border-red-100 bg-red-50'}`}>{o.status}</span></div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mb-3"><div className={`${o.color} h-full rounded-full`} style={{ width: `${o.progress}%` }}></div></div>
                        <div className="flex justify-between items-center mb-6 text-[10px] text-gray-400 font-bold uppercase tracking-tight"><span>참여 {o.currentParticipants} / {o.targetParticipants}개</span><span>{o.progress}% · {o.dDay}</span></div>
                        <button className="w-full py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-100/50">{o.btn}</button>
                      </div>
                    ));
                  })()
                )}
              </div>
            </div>
            
            {/* 페이지네이션 UI */}
            {groupOrders.length > 4 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                >
                  ←
                </button>
                {[...Array(Math.ceil(groupOrders.length / 4))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg font-black text-xs transition-all active:scale-95 ${
                      currentPage === i + 1 
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' 
                        : 'bg-white text-gray-400 hover:text-gray-900 border border-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(groupOrders.length / 4)))}
                  disabled={currentPage === Math.ceil(groupOrders.length / 4)}
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <aside className="fixed bottom-6 right-6 z-40 flex items-end gap-5 max-lg:right-4 max-lg:bottom-4 max-sm:left-4 max-sm:right-4 max-sm:flex-col-reverse max-sm:items-end">
        <button
          type="button"
          onClick={() => setIsChatbotOpen((prev) => !prev)}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-2xl shadow-emerald-900/30 transition-transform hover:-translate-y-1"
          aria-label={isChatbotOpen ? '챗봇 닫기' : '챗봇 열기'}
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-inner">
            <span className="relative flex h-7 w-8 items-center justify-center rounded-full bg-white">
              <span className="absolute -bottom-1 left-1.5 h-2 w-2 -skew-x-12 bg-white"></span>
              <span className="relative z-10 flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-700"></span>
              </span>
            </span>
          </div>
        </button>

        {isChatbotOpen && (
        <section className="w-[430px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/15 max-sm:w-full">
          <div className="flex items-center justify-between bg-emerald-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/95">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                  <span className="relative flex h-6 w-7 items-center justify-center rounded-lg bg-emerald-600">
                    <span className="absolute -top-1 h-1.5 w-1 rounded-full bg-emerald-600"></span>
                    <span className="flex h-4 w-5 items-center justify-center gap-1 rounded-md bg-white">
                      <span className="h-1 w-1 rounded-full bg-emerald-700"></span>
                      <span className="h-1 w-1 rounded-full bg-emerald-700"></span>
                    </span>
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black leading-tight">SoSo 챗봇</h2>
              </div>
            </div>
            <div className="flex items-center text-3xl font-light leading-none">
              <button type="button" onClick={() => setIsChatbotOpen(false)} aria-label="챗봇 닫기" className="leading-none text-white">
                ×
              </button>
            </div>
          </div>

          <div className="flex h-[520px] flex-col bg-white px-5 py-5 max-sm:h-[460px]">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
                    <span className="relative flex h-6 w-7 items-center justify-center rounded-lg bg-emerald-600">
                      <span className="absolute -top-1 h-1.5 w-1 rounded-full bg-emerald-600"></span>
                      <span className="flex h-4 w-5 items-center justify-center gap-1 rounded-md bg-white">
                        <span className="h-1 w-1 rounded-full bg-emerald-700"></span>
                        <span className="h-1 w-1 rounded-full bg-emerald-700"></span>
                      </span>
                    </span>
                  </div>

                  <div className="max-w-[280px] rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm leading-7 text-gray-900">
                      안녕하세요! 👋<br />
                      SoSo 업무 도우미입니다.<br />
                      무엇을 도와드릴까요?
                    </p>
                  </div>
                </div>

                {messages.map((msg, index) => (
                  msg.role === "user" ? (
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[300px] whitespace-pre-line rounded-2xl rounded-tr-md bg-emerald-700 px-4 py-3 text-sm font-bold leading-7 text-white shadow-sm">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
                        <span className="relative flex h-6 w-7 items-center justify-center rounded-lg bg-emerald-600">
                          <span className="absolute -top-1 h-1.5 w-1 rounded-full bg-emerald-600"></span>
                          <span className="flex h-4 w-5 items-center justify-center gap-1 rounded-md bg-white">
                            <span className="h-1 w-1 rounded-full bg-emerald-700"></span>
                            <span className="h-1 w-1 rounded-full bg-emerald-700"></span>
                          </span>
                        </span>
                      </div>

                      <div className="max-w-[310px] rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
                        <p className="whitespace-pre-line text-sm leading-7 text-gray-900">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  )
                ))}

                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="max-w-[220px] rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-sm text-gray-500">답변 생성 중...</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="질문을 입력하세요..."
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="챗봇 메시지 전송"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.4 20.4 21.6 12 3.4 3.6 3 10l10 2-10 2 .4 6.4Z" />
                </svg>
              </button>
            </div>
          </div>
        </section>
        )}
      </aside>
    </div>
  );
};

export default BusinessMain;
