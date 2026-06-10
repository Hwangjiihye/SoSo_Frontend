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

  const salesChartData = {
    labels: settlementData.monthlySales.map(d => d.month),
    datasets: [
      {
        label: '총 매출액',
        data: settlementData.monthlySales.map(d => d.amount),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: '정산 예정액',
        data: settlementData.monthlySales.map(d => d.amount * 0.9),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 10, font: { size: 11, weight: 'bold' } }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { t: '이번 달 총 매출', v: formatCurrency(settlementData.summary.totalSales), b: '지난 달 대비 +12%', c: 'border-emerald-100', tc: 'text-emerald-600' },
            { t: '정산 예정 금액', v: formatCurrency(settlementData.summary.expectedSettlement), b: '차주 월요일 정산 예정', c: 'border-blue-100', tc: 'text-blue-600' },
            { t: '정산 완료 금액', v: formatCurrency(settlementData.summary.completedSettlement), b: '2024년 누적 기준', c: 'border-gray-100', tc: 'text-gray-600' },
            { t: '결제 수수료(합계)', v: formatCurrency(settlementData.summary.fees), b: '평균 수수료율 2.3%', c: 'border-red-100', tc: 'text-red-600' }
          ].map((s, i) => (
            <div key={i} className={`bg-white p-6 rounded-2xl border-2 shadow-sm ${s.c}`}>
              <div className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-tight">{s.t}</div>
              <div className="text-2xl font-black mb-4">{s.v}</div>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold bg-gray-50 ${s.tc}`}>{s.b}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                매출 및 정산 추이
              </h3>
            </div>
            <div className="h-80">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              지출 항목 분석
            </h3>
            <div className="space-y-5">
              {[
                { label: '카드 결제 수수료', amount: 840000, color: 'bg-red-400' },
                { label: '플랫폼 이용료', amount: 350000, color: 'bg-orange-400' },
                { label: '기타 운영 비용', amount: 380000, color: 'bg-gray-400' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-bold">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${item.color} h-full`} 
                      style={{ width: `${(item.amount / settlementData.summary.fees) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400">총 합계</span>
                  <span className="text-xl font-black text-red-500">{formatCurrency(settlementData.summary.fees)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
