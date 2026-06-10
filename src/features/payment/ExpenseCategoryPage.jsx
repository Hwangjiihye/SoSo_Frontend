import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
import authStore from '../../store/authStore';
import { useStores } from '../../hooks/useStores';
import { useExpenseCategory } from './hooks/useExpenseCategory';

// Chart.js 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

/**
 * @file ExpenseCategoryPage.jsx
 * @description 비용 카테고리 관리 페이지 (payment 도메인)
 * '카테고리1.jpg' 디자인 참고 반영 및 지출 분포 차트 추가
 */
const ExpenseCategoryPage = () => {
  const navigate = useNavigate();
  const { logout, user_nickname, bizname, selectedStoreSeq, setSelectedStore } = authStore();
  const { stores, isLoading: isStoresLoading } = useStores();
  const { categories, isLoading, formatCurrency } = useExpenseCategory();

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

  const getColorClass = (color) => {
    const classes = {
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      pink: 'bg-pink-50 text-pink-600 border-pink-100',
      gray: 'bg-gray-50 text-gray-600 border-gray-100',
    };
    return classes[color] || classes.gray;
  };

  const getChartColors = (color) => {
    const colors = {
      emerald: 'rgba(16, 185, 129, 0.8)',
      blue: 'rgba(59, 130, 246, 0.8)',
      orange: 'rgba(245, 158, 11, 0.8)',
      purple: 'rgba(139, 92, 246, 0.8)',
      pink: 'rgba(236, 72, 153, 0.8)',
      gray: 'rgba(107, 114, 128, 0.8)',
    };
    return colors[color] || colors.gray;
  };

  const chartData = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.amount),
        backgroundColor: categories.map(c => getChartColors(c.color)),
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const totalExpense = categories.reduce((acc, cat) => acc + cat.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="SoSo Logo" className="w-12 h-12 object-contain relative top-[5px]" />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto relative">
          <Link to="/" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">홈</Link>
          <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">발주 관리</a>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsSettlementMenuOpen(true)}
            onMouseLeave={() => setIsSettlementMenuOpen(false)}
          >
            <div 
              onClick={() => navigate("/settlement")}
              className={`px-4 py-1.5 text-sm font-bold rounded shadow-sm border cursor-pointer transition-all whitespace-nowrap ${isSettlementMenuOpen ? 'bg-white text-emerald-600 border-gray-100' : 'bg-white text-emerald-600 border-gray-200'}`}
            >
              수금 관리
            </div>
            
            <div className={`absolute top-full left-0 w-40 pt-2 z-[60] transition-all duration-200 ${isSettlementMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-2">
                {['이체 관리', '비용 카테고리', '결제 요약', '내보내기'].map((sub) => (
                  <button 
                    key={sub} 
                    onClick={() => {
                      if (sub === '이체 관리') navigate("/transfer-management");
                      else if (sub === '비용 카테고리') navigate("/expense-category");
                      else if (sub === '결제 요약') navigate("/settlement");
                    }}
                    className={`w-full text-left px-3 py-2 text-[11px] font-bold rounded-lg transition-all ${sub === '비용 카테고리' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
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
              </span>
            </div>
          </div>
          <button onClick={handleLogOut} className="text-xs text-gray-400 hover:underline">/로그아웃</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">비용 카테고리 관리</h2>
            <p className="text-sm text-gray-500">매장의 지출 항목을 체계적으로 분류하고 관리하세요.</p>
          </div>
          <button 
            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            + 새 카테고리 추가
          </button>
        </div>

        {/* 지출 분포 요약 차트 섹션 추가 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-64 h-64 relative">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">총 지출액</span>
              <span className="text-xl font-black text-gray-900">{formatCurrency(totalExpense)}</span>
            </div>
          </div>
          
          <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getChartColors(cat.color) }}></div>
                <div>
                  <div className="text-xs font-bold text-gray-700">{cat.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {((cat.amount / totalExpense) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 카테고리 그리드 (디자인 참고) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getColorClass(cat.color)}`}>
                  {cat.name}
                </div>
                <button className="text-gray-300 hover:text-emerald-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{formatCurrency(cat.amount)}</div>
                <div className="text-xs font-bold text-gray-400 mt-1">이번 달 누적 지출 · {cat.count}건</div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">전월 대비 +4.2%</span>
                <button className="text-xs font-black text-emerald-600 group-hover:underline flex items-center gap-1">
                  상세보기
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* 추가 카드 */}
          <button className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all group">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <span className="text-2xl font-bold">+</span>
            </div>
            <span className="text-sm font-bold">카테고리 추가</span>
          </button>
        </div>

        {/* 하단 안내 섹션 */}
        <div className="mt-12 bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100 flex items-center gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm shadow-emerald-200/50">💡</div>
          <div>
            <h4 className="font-black text-emerald-800 mb-1">스마트 비용 관리 팁</h4>
            <p className="text-sm text-emerald-600/70 font-medium leading-relaxed">
              카테고리별로 예산을 설정하면 지출이 예산을 초과할 때 실시간 알림을 받을 수 있습니다.<br />
              정기적인 비용(임대료, 인건비 등)은 자동이체와 연결하여 더욱 편리하게 관리해 보세요.
            </p>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default ExpenseCategoryPage;
