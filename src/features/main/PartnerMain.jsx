/**
 * @file PartnerMain.jsx
 * @description '거래처' 대시보드 페이지입니다. 
 * Chart.js를 사용하여 매출, 수금 및 미수금 현황을 시각화하며, 훅 사용을 최적화했습니다.
 */
import React, { useState } from 'react';
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
  // authStore 훅을 한 번만 호출하여 필요한 상태를 구조분해 할당으로 가져옵니다.
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotMessage, setChatbotMessage] = useState('');

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

  const notifications = [
    { id: 1, title: '신규 발주 접수 - 강남 본점', desc: '냉동삼겹살 10kg x 5 총 37만원', time: '방금 전', color: 'bg-red-500' },
    { id: 2, title: '미수금 결제 완료 - 홍대 2호점', desc: '210만원 입금 확인, 잔액 0원', time: '8분 전', color: 'bg-emerald-500' },
    { id: 3, title: '재고 임박 - 참치캔 150g', desc: '잔여 재고 30개, 평균 소진 3일', time: '34분 전', color: 'bg-orange-500' },
    { id: 4, title: '납품 예정일 - 신촌 3호점', desc: '내일 오전 10시, 건어물류 4종', time: '1시간 전', color: 'bg-blue-500' },
    { id: 5, title: '미수금 연체 - 이태원 직영점', desc: 'D+15, 840만원, 독촉 알림 발송', time: '2시간 전', color: 'bg-yellow-400' }
  ];

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
              <div className="space-y-6">
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-4 items-start group cursor-pointer border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.color}`}></div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-black text-gray-800 group-hover:text-emerald-600 transition-colors leading-tight">{n.title}</h4>
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter whitespace-nowrap ml-2">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                  <p className="text-sm leading-7 text-gray-900">안녕하세요! 👋<br />SoSo 업무 도우미입니다.<br />무엇을 도와드릴까요?</p>
                  <p className="mt-2 text-right text-xs text-gray-400">오후 2:30</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-md bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm">최근 발주 내역 알려줘</div>
              </div>

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
                <div className="max-w-[310px] rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm leading-7 text-gray-900">최근 발주 내역은 총 3건입니다.</p>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-gray-900">
                    <li>· 2024-06-18 신선식품 350,000원</li>
                    <li>· 2024-06-17 대한유통 180,000원</li>
                    <li>· 2024-06-16 푸드상사 250,000원</li>
                  </ul>
                  <p className="mt-2 text-right text-xs text-gray-400">오후 2:30</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <input
                type="text"
                value={chatbotMessage}
                onChange={(event) => setChatbotMessage(event.target.value)}
                placeholder="질문을 입력하세요..."
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              <button type="button" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-900/20" aria-label="챗봇 메시지 전송">
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
}

export default PartnerMain;
