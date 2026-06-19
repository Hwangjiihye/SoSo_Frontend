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
import MainNotificationSession from './components/MainNotificationSession';
import { fetchPartnerDashboard } from '../../apis/orderApi';

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
  const sellerSeq = authStore((state) => state.user_seq);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // 실 데이터 로드
  useEffect(() => {
    if (!sellerSeq) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetchPartnerDashboard(sellerSeq);
        setDashboard(res);
      } catch (err) {
        console.error('거래처 대시보드 데이터 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [sellerSeq]);

  // KPI 카드 숫자
  const todayNewOrders = dashboard?.todayNewOrders ?? 0;
  const shippingOrders = dashboard?.shippingOrders ?? 0;
  const waitingPayments = dashboard?.waitingPayments ?? 0;

  // 이번 달 현황 및 미수금
  const thisMonthSales = dashboard?.thisMonthSales ?? 0;
  const thisMonthCollections = dashboard?.thisMonthCollections ?? 0;
  const totalReceivables = dashboard?.totalReceivables ?? 0;

  // 수금 목표 달성률 계산
  const collectionRate = thisMonthSales > 0 ? Math.round((thisMonthCollections / thisMonthSales) * 100) : 100;

  // 1. 월별 매출 및 수금 현황 차트 데이터
  const trendChartData = {
    labels: dashboard?.monthlySalesAndCollections?.map(item => item.month) || [],
    datasets: [
      { 
        label: '매출', 
        data: dashboard?.monthlySalesAndCollections?.map(item => Math.round(item.sales / 10000)) || [], // 만원 단위
        backgroundColor: 'rgba(16, 185, 129, 0.6)', 
        borderRadius: 4 
      },
      { 
        label: '수금', 
        data: dashboard?.monthlySalesAndCollections?.map(item => Math.round(item.collection / 10000)) || [], 
        backgroundColor: 'rgba(59, 130, 246, 0.6)', 
        borderRadius: 4 
      },
    ]
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'top', 
        align: 'end', 
        labels: { boxWidth: 12, font: { size: 12, weight: 'bold' } } 
      } 
    },
    scales: { 
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, 
      x: { grid: { display: false } } 
    }
  };

  // 2. 누적 미수금 변동 추이 차트 데이터
  const receivableChartData = {
    labels: dashboard?.receivableTrend?.map(item => item.month) || [],
    datasets: [{
      label: '누적 미수금',
      data: dashboard?.receivableTrend?.map(item => Math.round(item.amount / 10000)) || [], // 만원 단위
      borderColor: 'rgb(239, 68, 68)', 
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }]
  };

  const businessSales = dashboard?.businessSales || [];
  const groupOrders = dashboard?.groupOrders || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold text-sm">실제 데이터 기반 대시보드를 구축하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-8 py-8 space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            { t: '신규 발주 (오늘)', v: todayNewOrders, u: '건', b: '실시간 접수 건수', c: 'border-emerald-100' },
            { t: '배송 중', v: shippingOrders, u: '건', b: '정상 배송 건수', c: 'border-emerald-100' },
            { t: '입금 대기', v: (waitingPayments / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 1 }), u: '만원', b: '미결제 발주 총액', c: 'border-orange-100' }
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
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-500">실시간 통합 통계</div>
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
                  <div className="text-3xl font-black text-gray-900 tracking-tight">{(thisMonthSales / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}만</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-black uppercase tracking-widest">이번 달 수금</div>
                  <div className="text-3xl font-black text-emerald-600 tracking-tight">{(thisMonthCollections / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}만</div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-400 mb-2 font-black uppercase tracking-widest">누적 미수금</div>
                  <div className="text-3xl font-black text-red-500 tracking-tight">{(totalReceivables / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}만</div>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex justify-between text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">
                  <span>수금 목표 달성률</span>
                  <span>{collectionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${collectionRate}%` }}></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 pt-10 border-t border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                누적 미수금 변동 추이 (단위: 만원)
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

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
           <div className="bg-white rounded-[2.5rem] border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-black mb-8 flex justify-between items-center text-gray-900">
                사업자별 매출 요약
                <span className="text-xs text-gray-400 font-bold cursor-pointer hover:text-emerald-600 transition-colors uppercase tracking-widest">View All &gt;</span>
              </h3>
              <div className="space-y-8">
                {businessSales.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">연계된 소상공인 사업자가 없습니다.</div>
                ) : (
                  businessSales.map(b => (
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
                  ))
                )}
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-black mb-8 flex justify-between items-center text-gray-900">
                공동 발주 현황
                <span className="text-xs text-emerald-600 font-black cursor-pointer hover:underline uppercase tracking-widest">New Order +</span>
              </h3>
              <div className="space-y-6">
                {groupOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">진행 중인 공동 발주(공구)가 없습니다.</div>
                ) : (
                  groupOrders.map(o => (
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
                  ))
                )}
              </div>
           </div>

           <MainNotificationSession />
        </div>
      </main>
    </div>
  );
}

export default PartnerMain;
