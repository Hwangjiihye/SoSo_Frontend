/**
 * @file PartnerMain.jsx
 * @description '거래처' 대시보드 페이지입니다. 
 * Chart.js를 사용하여 매출, 수금 및 미수금 현황을 시각화하며, 프로필 드롭다운이 추가되었습니다.
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
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
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

function PartnerMain({ setRole }) {
  const navigate = useNavigate();
  const logout = authStore((state) => state.logout);
  const user_type = authStore((state) => state.user_type);

  // 프로필 드롭다운 상태
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleProfileClick = () => {
    // 세션 스토리지 또는 스토어에서 유저 타입 확인
    const type = sessionStorage.getItem("user_type") || user_type;
    
    if (type === 'BUSINESS') {
      navigate('/business-mypage');
    } else {
      // 현재는 사업자 마이페이지 경로만 명시되었으므로 알림 처리
      alert("사업자 전용 마이페이지로 이동합니다. (현재 유저 타입: " + type + ")");
      // 실제 프로젝트에 파트너 마이페이지가 있다면 navigate('/partner-mypage') 등으로 연결
    }
  };

  // --- 차트 데이터: 월별 매출/수금 추이 (Grouped Bar) ---
  const trendChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'],
    datasets: [
      {
        label: '매출',
        data: [4000, 6000, 5500, 8000, 4500, 9000, 7000, 8500],
        backgroundColor: 'rgba(16, 185, 129, 0.6)', 
        borderRadius: 4,
      },
      {
        label: '수금',
        data: [3500, 5000, 4800, 7200, 4000, 8200, 6500, 7800],
        backgroundColor: 'rgba(59, 130, 246, 0.6)', 
        borderRadius: 4,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          font: { size: 12, weight: 'bold' },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // --- 차트 데이터: 미수금 추이 (Line) ---
  const receivableChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'],
    datasets: [
      {
        label: '누적 미수금',
        data: [500, 1000, 700, 800, 500, 800, 500, 700],
        borderColor: 'rgb(239, 68, 68)', 
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
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
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-1">
          <img src={logo} alt="SoSo Logo" className="w-12 h-12 object-contain relative top-[5px]" />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto">
          <a href="#" className="px-4 py-1.5 text-sm font-semibold bg-white text-gray-900 rounded shadow-sm border border-gray-200">홈</a>
          {['발주 관리', '수금 관리', '공동 발주', '업체 홍보', '통계'].map(m => (
            <a key={m} href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">{m}</a>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-4">
          <button className="text-gray-400 hover:text-emerald-600 relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          {/* 프로필 및 드롭다운 컨테이너 */}
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white hover:bg-emerald-50 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">김</div>
              <span className="text-sm font-semibold whitespace-nowrap text-gray-700">김민준 <span className="text-xs text-gray-400 font-normal">거래처 관리자</span></span>
            </div>

            {/* 프로필 드롭다운 메뉴 */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-[60] animate-fade-in-up">
                <div className="p-3 border-b border-gray-50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">관리 업체</span>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl mb-1 flex justify-between items-center">
                    한빛 식품 유통
                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">Main</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    대성 식자재
                  </button>
                </div>
                <div className="border-t border-gray-50 pt-2 mt-2">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full text-center py-3 text-sm font-black text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                  >
                    마이페이지
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogOut} className="text-xs text-gray-400 hover:underline">/로그아웃</button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-8 py-8 space-y-8 w-full">
        {/* Summary Cards */}
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

        {/* Charts Section */}
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

        {/* Bottom Grid Section */}
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

      <MainFooter />
    </div>
  );
}

export default PartnerMain;
