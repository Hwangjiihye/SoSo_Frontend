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
    </div>
  );
}

export default BusinessMain;
