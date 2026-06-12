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
import { Line } from 'react-chartjs-2';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
import authStore from '../../store/authStore';
import { useStores } from '../../hooks/useStores';
import { useSettlement } from './hooks/useSettlement';

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

/**
 * @file SettlementPage.jsx
 * @description 사업자 매출 및 정산 페이지 (payment 도메인)
 */
const SettlementPage = () => {
  const navigate = useNavigate();
  const { logout, user_nickname, bizname, selectedStoreSeq, setSelectedStore } = authStore();
  const { stores, isLoading: isStoresLoading } = useStores();
  const { settlementData, isLoading, formatCurrency } = useSettlement();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettlementMenuOpen, setIsSettlementMenuOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    setIsProfileOpen(false);
  };

  const chartMonthlySales = settlementData.monthlySales;

  const paymentChartData = {
    labels: chartMonthlySales.map(d => d.month),
    datasets: [
      {
        label: '결제 금액',
        data: chartMonthlySales.map((item, index, monthlySales) =>
          index === monthlySales.length - 1 ? item.amount : item.amount * 0.82
        ),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return 'rgba(37, 99, 235, 0.12)';
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.32)');
          gradient.addColorStop(0.55, 'rgba(59, 130, 246, 0.12)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

          return gradient;
        },
        borderWidth: 2,
        fill: 'origin',
        tension: 0.35,
        pointBackgroundColor: 'rgb(37, 99, 235)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 6,
      }
    ]
  };

  const paymentValueLabelPlugin = {
    id: 'paymentValueLabel',
    afterDatasetsDraw: (chart) => {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);

      ctx.save();
      ctx.font = '700 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      meta.data.forEach((point, index) => {
        const value = chart.data.datasets[0].data[index];
        const label = `${Number(value).toLocaleString('ko-KR')}원`;
        const labelWidth = ctx.measureText(label).width + 14;
        const labelX = point.x;
        const labelY = point.y - 24;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
        ctx.beginPath();
        ctx.roundRect(labelX - labelWidth / 2, labelY - 10, labelWidth, 20, 6);
        ctx.fill();

        ctx.fillStyle = '#1d4ed8';
        ctx.fillText(label, labelX, labelY);

        ctx.beginPath();
        ctx.moveTo(labelX, labelY + 10);
        ctx.lineTo(labelX, point.y - 7);
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      ctx.restore();
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    layout: {
      padding: {
        top: 38,
        right: 20,
        bottom: 8,
        left: 8,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const isCurrentMonth =
              context.dataIndex === chartMonthlySales.length - 1;
            const label = isCurrentMonth ? '결제 예정 금액' : '결제 완료 금액';

            return `${label}: ${formatCurrency(context.parsed.y)}`;
          },
        },
      }
    },
    scales: {
      y: {
        display: true,
        beginAtZero: true,
        min: 0,
        max: 20000000,
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.8)',
          drawTicks: false,
        },
        ticks: {
          stepSize: 5000000,
          padding: 12,
          color: '#64748b',
          font: { size: 11, weight: '600' },
          callback: (value) => `${Math.round(value / 10000).toLocaleString('ko-KR')}만원`,
        },
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          padding: 18,
          color: '#111827',
          font: { size: 12, weight: 'bold' },
        },
      }
    }
  };

  const settlementProducts = [
    { name: '친환경 양파', detail: '20kg · 2망' },
    { name: '국내산 감자', detail: '10kg · 3박스' },
    { name: '대파', detail: '5kg · 4단' },
    { name: '계란 특란', detail: '30구 · 10판' },
    { name: '쌀', detail: '20kg · 3포' },
  ];

  const paymentStatusStyles = {
    미결제: {
      badge: 'bg-red-50 text-red-600',
      dot: 'bg-red-500',
    },
    '결제 예정': {
      badge: 'bg-blue-50 text-blue-600',
      dot: 'bg-blue-500',
    },
    '결제 완료': {
      badge: 'bg-emerald-50 text-emerald-600',
      dot: 'bg-emerald-500',
    },
  };

  const paymentStatuses = ['미결제', '결제 예정', '결제 완료'];
  const settlementsPerPage = 5;
  const settlementStartIndex = 0;
  const visibleSettlements = settlementData.history.slice(0, settlementsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="SoSo Logo" className="w-12 h-12 object-contain relative top-[5px]" />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto relative">
          <a href="/" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">홈</a>
          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">발주 관리</a>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsSettlementMenuOpen(true)}
            onMouseLeave={() => setIsSettlementMenuOpen(false)}
          >
            <div className={`px-4 py-1.5 text-sm font-bold rounded shadow-sm border cursor-pointer transition-all whitespace-nowrap ${isSettlementMenuOpen ? 'bg-white text-emerald-600 border-gray-100' : 'bg-white text-emerald-600 border-gray-200'}`}>
              수금 관리
            </div>
            
            {/* 드롭다운 컨테이너 (투명 브릿지 포함 및 부드러운 전환) */}
            <div className={`absolute top-full left-0 w-40 pt-2 z-[60] transition-all duration-200 ${isSettlementMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-2">
                {['이체 관리', '비용 카테고리', '결제 요약', '내보내기'].map((sub) => (
                  <button 
                    key={sub} 
                    onClick={() => {
                      if (sub === '이체 관리') navigate("/transfer-management");
                      else if (sub === '결제 요약') navigate("/settlement");
                    }}
                    className={`w-full text-left px-3 py-2 text-[11px] font-bold rounded-lg transition-all ${sub === '결제 요약' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">공동 발주</a>
          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">업체 홍보</a>
          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">통계</a>
        </nav>

        <div className="flex items-center justify-end gap-4">
          <button className="text-gray-400 hover:text-emerald-600 relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white hover:bg-emerald-50 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                {user_nickname ? user_nickname.substring(0, 1) : 'G'}
              </div>
              <span className="text-sm font-semibold whitespace-nowrap text-gray-700">
                {user_nickname || '회원님'}
                <span className="text-xs text-gray-400 font-normal ml-1">
                  {bizname || '상호명 미등록'}
                </span>
              </span>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-[60] animate-fade-in-up">
                <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">나의 매장 목록</span>
                  {isStoresLoading && <span className="text-[10px] text-emerald-500 animate-pulse">로딩 중...</span>}
                </div>
                
                <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {stores.length > 0 ? (
                    stores.map((store) => (
                      <button 
                        key={store.storeSeq}
                        onClick={() => handleStoreSwitch(store.storeSeq, store.companyName)}
                        className={`w-full text-left px-4 py-3 rounded-xl mb-1 flex justify-between items-center transition-all ${
                          (selectedStoreSeq == store.storeSeq || (!selectedStoreSeq && stores[0].storeSeq === store.storeSeq))
                            ? 'bg-emerald-50 text-emerald-600 font-bold border border-emerald-100' 
                            : 'text-gray-600 hover:bg-gray-50 font-medium'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm">{store.companyName}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{store.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-xs text-gray-400">등록된 매장이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button onClick={handleLogOut} className="text-xs text-gray-400 hover:underline">/로그아웃</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-1">매출 및 정산 현황</h2>
          <p className="text-sm text-gray-500">매장의 실시간 매출 데이터와 정산 내역을 확인하세요.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: '이번 달 결제 예정액',
              value: formatCurrency(settlementData.summary.expectedSettlement),
              description: '이번 달 전체 결제 예정',
              cardStyle: 'border-blue-100',
              iconStyle: 'bg-blue-50 text-blue-600',
              valueStyle: 'text-blue-600',
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              title: '오늘 결제 예정',
              value: formatCurrency(settlementData.history[0]?.amount ?? 0),
              description: `${settlementData.history.length > 0 ? 1 : 0}건 결제 예정`,
              cardStyle: 'border-orange-100',
              iconStyle: 'bg-orange-50 text-orange-500',
              valueStyle: 'text-orange-500',
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              title: '미결제 금액',
              value: formatCurrency(
                settlementData.history
                  .filter((_, index) => paymentStatuses[index % paymentStatuses.length] === '미결제')
                  .reduce((total, item) => total + item.amount, 0)
              ),
              description: '확인이 필요한 결제 내역',
              cardStyle: 'border-red-100',
              iconStyle: 'bg-red-50 text-red-500',
              valueStyle: 'text-red-500',
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3 2.8 19a1.4 1.4 0 0 0 1.2 2h16a1.4 1.4 0 0 0 1.2-2L12 3Z" strokeLinejoin="round" />
                  <path d="M12 9v5M12 17.5v.1" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              title: '결제 완료 금액',
              value: formatCurrency(settlementData.summary.completedSettlement),
              description: '이번 달 결제 완료 기준',
              cardStyle: 'border-emerald-100',
              iconStyle: 'bg-emerald-50 text-emerald-600',
              valueStyle: 'text-emerald-600',
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8 12 2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl border-2 bg-white p-5 shadow-sm ${s.cardStyle}`}>
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="text-xs font-bold tracking-tight text-gray-500">{s.title}</div>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.iconStyle}`}>
                  {s.icon}
                </span>
              </div>
              <div className={`mb-2 text-2xl font-black tracking-tight ${s.valueStyle}`}>{s.value}</div>
              <p className="text-[11px] font-medium text-gray-400">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  월별 결제 금액 추이
                </h3>
                <p className="mt-1.5 text-xs font-medium text-gray-400">
                  지난달까지는 결제 완료 금액, 이번 달은 결제 예정 금액입니다.
                </p>
              </div>
            </div>
            <div className="h-80">
              <Line
                data={paymentChartData}
                options={chartOptions}
                plugins={[paymentValueLabelPlugin]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <h3 className="flex items-center gap-2 font-bold text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  거래처별 결제 예정 금액
                </h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-600">
                  4개 거래처
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-100">
                <div className="grid grid-cols-[160px_1fr] gap-6 bg-gray-50 px-4 py-3 text-[10px] font-black text-gray-400">
                  <span>거래처</span>
                  <span>비중</span>
                </div>
                {[
                  { label: '소소마을 1호점', amount: 380000 },
                  { label: '신선유통', amount: 230000 },
                  { label: '농산물센터', amount: 150000 },
                  { label: '기타', amount: 70000 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[160px_1fr] items-center gap-6 border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50"
                  >
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-600">
                          {Math.round((item.amount / 830000) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${(item.amount / 830000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <h3 className="flex items-center gap-2 font-bold text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  월별 결제 완료 상세
                </h3>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-600">
                  최근 4개월
                </span>
              </div>

              <div className="mb-5 flex items-end justify-between rounded-xl bg-gray-50 px-5 py-4">
                <div>
                  <p className="mb-1 text-[11px] font-bold text-gray-400">최근 4개월 결제 완료</p>
                  <p className="text-2xl font-black tracking-tight text-gray-900">
                    {formatCurrency(46900000)}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-blue-500">월평균 11,725,000원</span>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-100">
                <div className="grid grid-cols-[54px_1fr_auto] gap-3 bg-gray-50 px-4 py-3 text-[10px] font-black text-gray-400">
                  <span>월</span>
                  <span className="text-right">지출 금액</span>
                  <span className="min-w-24 text-right">전월 대비</span>
                </div>
                {[
                  { month: '6월', amount: 12640000, difference: 1480000, rate: 13.3 },
                  { month: '5월', amount: 11160000, difference: -920000, rate: -7.6 },
                  { month: '4월', amount: 12080000, difference: 730000, rate: 6.4 },
                  { month: '3월', amount: 11020000, difference: -580000, rate: -5.0 },
                ].map((item) => {
                  const isIncrease = item.difference > 0;

                  return (
                    <div
                      key={item.month}
                      className="grid grid-cols-[54px_1fr_auto] items-center gap-3 border-t border-gray-100 px-4 py-4 transition-colors hover:bg-gray-50"
                    >
                      <span className="text-sm font-black text-gray-700">{item.month}</span>
                      <span className="text-right text-sm font-black text-gray-900">
                        {formatCurrency(item.amount)}
                      </span>
                      <span
                        className={`min-w-24 rounded-lg px-2 py-1.5 text-right text-[10px] font-black ${
                          isIncrease
                            ? 'bg-red-50 text-red-500'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {isIncrease ? '▲' : '▼'} {formatCurrency(Math.abs(item.difference))} ({Math.abs(item.rate)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-600">
                  월별 결제 예정
                </span>
                <span className="text-xs font-medium text-gray-400">
                  해당 월에 결제해야 할 내역입니다.
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900">최근 정산 상세 내역</h3>
            </div>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                aria-label="이전 달"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-emerald-600"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="min-w-28 px-3 text-center text-sm font-black text-gray-800">
                {settlementData.history[0]?.date
                  ? `${settlementData.history[0].date.slice(0, 4)}년 ${Number(settlementData.history[0].date.slice(5, 7))}월`
                  : '정산 월'}
              </span>
              <button
                type="button"
                aria-label="다음 달"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-emerald-600"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid gap-3 border-b border-gray-100 bg-gray-50/70 p-6 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="mb-2 text-xs font-bold text-gray-400">결제 예정 건수</p>
              <p className="text-xl font-black text-gray-900">
                {settlementData.history.length}
                <span className="ml-1 text-sm font-bold text-gray-500">건</span>
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="mb-2 text-xs font-bold text-gray-400">총 결제 예정 금액</p>
              <p className="text-xl font-black text-emerald-600">
                {formatCurrency(settlementData.history.reduce((total, item) => total + item.amount, 0))}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="mb-2 text-xs font-bold text-gray-400">정산 기준</p>
              <p className="text-sm font-black text-gray-800">월 결제 예정 내역</p>
              <p className="mt-1 text-[11px] font-medium text-gray-400">결제일 순으로 확인하세요.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="border-b border-gray-100 bg-white text-[10px] font-black uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-6 py-4">결제 대상</th>
                  <th className="px-6 py-4">거래 식품</th>
                  <th className="px-6 py-4">결제 항목</th>
                  <th className="px-6 py-4">결제 예정일</th>
                  <th className="px-6 py-4 text-right">결제 금액</th>
                  <th className="px-6 py-4 text-center">결제 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visibleSettlements.map((item, index) => {
                  const itemIndex = settlementStartIndex + index;
                  const product = settlementProducts[itemIndex % settlementProducts.length];
                  const paymentStatus = paymentStatuses[itemIndex % paymentStatuses.length];
                  const statusStyle = paymentStatusStyles[paymentStatus];

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-emerald-50/30">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-600">
                            {item.store?.substring(0, 1)}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{item.store}</p>
                            <p className="mt-0.5 text-[11px] text-gray-400">정산 번호 #{String(item.id).padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M5 8.5 12 5l7 3.5v7L12 19l-7-3.5v-7Z" strokeLinejoin="round" />
                              <path d="m5 8.5 7 3.5 7-3.5M12 12v7" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{product.name}</p>
                            <p className="mt-0.5 text-[11px] font-medium text-gray-400">{product.detail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-bold text-gray-600">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-gray-600">{item.date}</td>
                      <td className="px-6 py-5 text-right text-sm font-black text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${statusStyle.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}></span>
                          {paymentStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50/50 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs font-medium text-gray-400">
              총 <span className="font-black text-gray-700">{settlementData.history.length}건</span>의 결제 내역
            </p>
            <p className="whitespace-nowrap text-sm font-bold text-gray-500">
              합계
              <span className="ml-3 text-lg font-black text-emerald-600">
                {formatCurrency(settlementData.history.reduce((total, item) => total + item.amount, 0))}
              </span>
            </p>
          </div>
        </section>

        <div className="hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-700">최근 정산 상세 내역</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">거래 일시</th>
                  <th className="px-6 py-4">매장명</th>
                  <th className="px-6 py-4">결제 수단</th>
                  <th className="px-6 py-4 text-right">금액</th>
                  <th className="px-6 py-4 text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {settlementData.history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.store}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold">{item.type}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-right">{formatCurrency(item.amount)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black ${
                        item.status === '정산완료' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-blue-50 text-blue-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default SettlementPage;
