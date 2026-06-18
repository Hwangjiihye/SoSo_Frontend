/**
 * @file PartnerMain.jsx
 * @description '거래처' 대시보드 페이지입니다. 
 * Chart.js를 사용하여 매출, 수금 및 미수금 현황을 시각화하며, 훅 사용을 최적화했습니다.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import authStore from '../../store/authStore';
import PartnerMainHeader from '../../components/layout/PartnerMainHeader';
import useNotificationStore from '../../store/notificationStore';
import useNotificationSocket from '../../hooks/useNotificationSocket';

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

function PartnerMain({ setRole }) {
  const navigate = useNavigate();
  const { user_seq } = authStore();
  const { notifications, fetchNotifications, markAsRead } = useNotificationStore();

  // 1. 실시간 소켓 연결
  useNotificationSocket(user_seq);

  // 2. 초기 알림 로드
  useEffect(() => {
    if (user_seq) {
      fetchNotifications(user_seq);
    }
  }, [user_seq, fetchNotifications]);

  // 시간 포맷팅 헬퍼
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);

    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    return date.toLocaleDateString();
  };

  // --- 차트 데이터 (기존과 동일) ---
  const trendChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'],
    datasets: [
      { label: '매출', data: [4000, 6000, 5500, 8000, 4500, 9000, 7000, 8500], backgroundColor: 'rgba(16, 185, 129, 0.6)', borderRadius: 4 },
      { label: '수금', data: [3500, 5000, 4800, 7200, 4000, 8200, 6500, 7800], backgroundColor: 'rgba(59, 130, 246, 0.6)', borderRadius: 4 },
    ]
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', align: 'end', labels: { boxWidth: 12, font: { size: 12, weight: 'bold' } } } },
    scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
  };

  const receivableChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'],
    datasets: [{
      label: '누적 미수금',
      data: [500, 1000, 700, 800, 500, 800, 500, 700],
      borderColor: 'rgb(239, 68, 68)', 
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }]
  };

  const businessSales = [
    { name: '강남 본점', desc: '이번 달 12건, 미수금 없음', amount: '1,240만', trend: '↑ +8.2%', progress: 100, color: 'bg-emerald-500' },
    { name: '홍대 2호점', desc: '이번 달 9건, 입금 완료', amount: '980만', trend: '↑ +3.1%', progress: 100, color: 'bg-emerald-500' },
    { name: '신촌 3호점', desc: '이번 달 7건, 미수금 340만', amount: '740만', trend: '↓ -2.4%', progress: 65, color: 'bg-orange-400' },
    { name: '이태원 직영점', desc: '이번 달 5건, 미수금 840만', amount: '620만', trend: '연체 D+15', progress: 30, color: 'bg-red-500' }
  ];

  const groupOrders = [
    { id: 1, title: '참치캔 (동원 150g X 48)', status: '발주 완료', progress: 100, color: 'bg-blue-500', dDay: '배송 준비 중', btn: '배송 현황 보기' },
    { id: 2, title: '냉동만두 (비비고 2kg X 12)', status: '모집 중', progress: 48, color: 'bg-emerald-500', dDay: '마감 D-4', btn: '참여하기' },
    { id: 3, title: '식용유 (CJ 18L X 4)', status: '마감 임박', progress: 95, color: 'bg-red-500', dDay: '마감 오늘', btn: '수량 수정 / 취소' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-8 py-8 space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { t: '신규 발주 (오늘)', v: '12', u: '건', b: '↑ 어제 대비 +3건', c: 'border-emerald-100' },
            { t: '배송 중', v: '7', u: '건', b: '정상 배송 중', c: 'border-emerald-100' },
            { t: '입금 대기', v: '1,200', u: '만원', b: '이번 달 기준', c: 'border-orange-100' }
          ].map((s, i) => (
            <div key={i} className={`bg-white p-8 rounded-3xl border-2 shadow-sm ${s.c}`}>
              <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider font-bold">{s.t}</div>
              <div className="text-5xl font-black mb-4 tracking-tight">{s.v}<span className="text-lg font-normal text-gray-400 ml-1">{s.u}</span></div>
              <span className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-black text-emerald-600">{s.b}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-200 p-10 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <span className="w-4 h-4 bg-emerald-500 rounded-full"></span>
              월별 매출 및 수금 현황
            </h3>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">2026년 상반기 리포트</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 h-[350px]">
              <Bar data={trendChartData} options={trendChartOptions} />
            </div>
            
            <div className="bg-gray-50 rounded-[2rem] p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-black uppercase tracking-widest">이번 달 매출</div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight">8,340만</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-black uppercase tracking-widest">이번 달 수금</div>
                  <div className="text-3xl font-black text-emerald-600 tracking-tight">3,520만</div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-400 mb-2 font-black uppercase tracking-widest">누적 미수금</div>
                  <div className="text-3xl font-black text-red-500 tracking-tight">4,820만</div>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex justify-between text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">
                  <span>수금 목표 달성률</span>
                  <span>73%</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '73%' }}></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 pt-10 border-t border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                누적 미수금 변동 추이
              </h4>
              <div className="h-60">
                <Line 
                  data={receivableChartData} 
                  options={{
                    ...trendChartOptions,
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="bg-white rounded-[2.5rem] border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-black mb-8 flex justify-between items-center text-gray-900">
                사업자별 매출 요약
                <span className="text-xs text-gray-400 font-bold cursor-pointer hover:text-emerald-600 transition-colors uppercase tracking-widest">View All &gt;</span>
              </h3>
              <div className="space-y-8">
                {businessSales.map(b => (
                   <div key={b.name} className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xs text-gray-400 font-black tracking-tighter">CORP</div>
                          <div>
                            <div className="font-black text-base text-gray-900">{b.name}</div>
                            <div className="text-xs text-gray-400 font-medium">{b.desc}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-base text-gray-900 tracking-tight">{b.amount}</div>
                          <div className="text-xs text-emerald-500 font-black uppercase tracking-tighter">{b.trend}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden ml-13" style={{ width: 'calc(100% - 52px)' }}>
                        <div className={`${b.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${b.progress}%` }}></div>
                      </div>
                   </div>
                ))}
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-black mb-8 flex justify-between items-center text-gray-900">
                공동 발주 현황
                <span className="text-xs text-emerald-600 font-black cursor-pointer hover:underline uppercase tracking-widest">New Order +</span>
              </h3>
              <div className="space-y-6">
                {groupOrders.map(o => (
                  <div key={o.id} className="border-2 border-gray-50 rounded-2xl p-6 hover:border-emerald-100 transition-all hover:shadow-md">
                    <div className="flex justify-between mb-4 items-start">
                      <h4 className="text-sm font-black text-gray-900 leading-snug">{o.title}</h4>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md border uppercase tracking-widest ${o.status === '모집 중' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : (o.status === '발주 완료' ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-red-500 bg-red-50 border-red-100')}`}>{o.status}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full mb-3">
                      <div className={`${o.color} h-full rounded-full transition-all duration-700`} style={{ width: `${o.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-6 font-black uppercase tracking-widest">
                      <span>{o.progress}% Completed</span>
                      <span>{o.dDay}</span>
                    </div>
                    <button className="w-full py-3 bg-gray-50 text-gray-900 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm">{o.btn}</button>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-black mb-8 flex justify-between items-center text-gray-900">
                실시간 알림
                <span className="text-xs text-gray-400 font-bold cursor-pointer hover:text-emerald-600 transition-colors uppercase tracking-widest">View All &gt;</span>
              </h3>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div 
                      key={n.notificationId} 
                      className={`flex gap-4 items-start group cursor-pointer border-b border-gray-50 pb-5 last:border-0 last:pb-0 transition-opacity ${n.isRead ? 'opacity-40' : 'opacity-100'}`}
                      onClick={() => markAsRead(n.notificationId)}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        n.type === 'STOCK' ? 'bg-red-500' : 
                        n.type === 'EXPIRY' ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-black text-gray-800 group-hover:text-emerald-600 transition-colors leading-tight">
                            {n.storeName && <span className="text-emerald-600 mr-1">[{n.storeName}]</span>}
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter whitespace-nowrap ml-2">{formatTime(n.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center text-gray-400 text-sm font-bold">새로운 알림이 없습니다.</div>
                )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

export default PartnerMain;
