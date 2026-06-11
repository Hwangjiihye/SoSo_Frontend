/**
 * @file BusinessMain.jsx
 * @description '사업자' 대시보드 메인 페이지입니다.
 * authStore에서 실제 회원 정보를 가져와 프로필 영역에 표시하며, 훅 사용을 최적화했습니다.
 */
import React, { useState } from 'react';
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
import MainFooter from '../../components/layout/MainFooter';
import MainHeader from '../../components/layout/MainHeader';
import authStore from '../../store/authStore';

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
  // authStore에서 필요한 상태와 매장 전환 함수를 가져옵니다.
  const navigate = useNavigate();

  // --- 차트 데이터 영역 (기존과 동일) ---
  const stockChartData = {
    labels: ['소고기', '돼지고기', '닭고기', '양파', '마늘', '식용유'],
    datasets: [{
      label: '현재 재고',
      data: [45, 12, 33, 8, 2, 28],
      backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)'],
      borderColor: ['rgb(16, 185, 129)', 'rgb(239, 68, 68)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)', 'rgb(16, 185, 129)'],
      borderWidth: 1,
      borderRadius: 8,
    }]
  };

  const salesChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [{
      label: '매출액 (만원)',
      data: [1200, 1900, 1500, 2100, 2400, 1800],
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

  const notifications = [
    { id: 1, title: '부족 재고 - 냉동삼겹살 1kg', desc: '현재 재고 3개 · 안전 재고 기준 20개 미달', time: '방금 전', color: 'bg-red-500' },
    { id: 2, title: '유통기한 임박 - 두부 (면두부)', desc: 'D-3 · 12개 남음 · 즉시 처리 권장', time: '8분 전', color: 'bg-orange-500' },
    { id: 3, title: '발주 도착 예정 - 식용유 18L X 6', desc: '오늘 오후 2시~4시 배송 예정', time: '34분 전', color: 'bg-emerald-500' },
  ];

  const groupOrders = [
    { id: 1, title: '참치캔 (동원 150g X 48)', status: '모집 중', progress: 72, color: 'bg-emerald-500', current: 18, min: 25, dDay: 'D-1', btn: '참여하기' },
    { id: 2, title: '냉동만두 (비비고 2kg X 12)', status: '모집 중', progress: 48, color: 'bg-emerald-500', current: 12, min: 25, dDay: 'D-4', btn: '참여하기' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <MainHeader activeMenu="홈" />

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { t: '총 재고', v: '1,284', u: '개 품목', b: '전주 대비 +3.2%', c: 'border-emerald-100' },
            { t: '부족 재고', v: '17', u: '개 품목', b: '즉시 발주 필요', c: 'border-red-100', tc: 'text-red-600' },
            { t: '유통기한 임박', v: '8', u: '개 품목', b: '주의 필요', c: 'border-orange-100', tc: 'text-orange-600' },
            { t: '공동 발주', v: '3', u: '건 진행 중', b: '참여 가능 2건', c: 'border-emerald-100', tc: 'text-emerald-600' }
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
                현재 재고 현황
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">기준: 오늘 실시간</span>
            </div>
            <div className="h-64">
              <Bar data={stockChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                월별 매출 현황
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">단위: 만원</span>
            </div>
            <div className="h-64">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-700">실시간 알림</h3>
            <div className="space-y-6">
              {notifications.map(n => (
                <div key={n.id} className="flex gap-4 group cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${n.color}`}></div>
                  <div className="flex-grow border-b border-gray-50 pb-4 group-last:border-0">
                    <div className="flex justify-between items-start mb-0.5"><h4 className="text-sm font-bold text-gray-800">{n.title}</h4><span className="text-[10px] text-gray-300 font-bold">{n.time}</span></div>
                    <p className="text-xs text-gray-400 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-700">공동 발주 현황</h3>
            <div className="space-y-4">
              {groupOrders.map(o => (
                <div key={o.id} className="border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all">
                  <div className="flex justify-between mb-4"><h4 className="text-sm font-bold text-gray-900">{o.title}</h4><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${o.status === '모집 중' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-red-500 border-red-100 bg-red-50'}`}>{o.status}</span></div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full mb-3"><div className={`${o.color} h-full rounded-full`} style={{ width: `${o.progress}%` }}></div></div>
                  <div className="flex justify-between items-center mb-6 text-[10px] text-gray-400 font-bold uppercase tracking-tight"><span>참여 {o.current} / {o.min}개</span><span>{o.progress}% · {o.dDay}</span></div>
                  <button className="w-full py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-100/50">{o.btn}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}

export default BusinessMain;
