import React, { useState, useEffect } from 'react';
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

  const [localCategories, setLocalCategories] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettlementMenuOpen, setIsSettlementMenuOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false); // 비용 등록 모달 상태
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false); // 카테고리 추가 모달 상태
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // 지출 상세 모달 상태 추가
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태 추가

  // 지출 내역 예시 데이터 상태
  const [expenses, setExpenses] = useState([
    { id: 1, categoryId: 1, date: '2026-06-10', title: '양파 및 대파 대량 도매 구매', amount: 120000, memo: '신선 청과물 시장 지출' },
    { id: 2, categoryId: 1, date: '2026-06-08', title: '냉동 삼겹살 및 정육 원육 구매', amount: 3200000, memo: '동원 유통 정육 발주' },
    { id: 3, categoryId: 1, date: '2026-06-05', title: '소스 및 기본 식자재 조미료 납부', amount: 1180000, memo: '하나 식자재 마트' },
    { id: 4, categoryId: 2, date: '2026-06-01', title: '6월 본사 상가 임대료 정기 납부', amount: 2500000, memo: '건물주 계좌 자동 이체' },
    { id: 5, categoryId: 3, date: '2026-06-10', title: '주말 아르바이트 직원 3인 주급 정산', amount: 800000, memo: '철수, 영희, 민수' },
    { id: 6, categoryId: 3, date: '2026-06-05', title: '5월 정직원 급여 일괄 지급', amount: 7600000, memo: '총 3명 급여 대장' },
    { id: 7, categoryId: 4, date: '2026-06-07', title: '5월 매장 전력 전기요금 납부', amount: 620000, memo: '한국전력공사 지출' },
    { id: 8, categoryId: 4, date: '2026-06-07', title: '5월 매장 상하수도요금 납부', amount: 230000, memo: '상수도사업본부 지출' },
    { id: 9, categoryId: 5, date: '2026-06-09', title: '인스타그램 인근 상권 스폰서 광고', amount: 350000, memo: '메타 광고 집행' },
    { id: 10, categoryId: 5, date: '2026-06-02', title: '매장 홍보용 전단지 디자인 및 인쇄 제작', amount: 850000, memo: '나래 디자인' },
    { id: 11, categoryId: 6, date: '2026-06-08', title: '매장 청소 세제 및 화장지 위생 비품 구입', amount: 150000, memo: '이마트 트레이더스' },
    { id: 12, categoryId: 6, date: '2026-06-03', title: '정수기 및 식기세척기 렌탈 관리비 납부', amount: 300000, memo: '코웨이 렌탈 지출' },
  ]);
  
  // 비용 등록 폼 상태
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    categoryId: '',
    amount: '',
    title: '',
    memo: ''
  });

  // 카테고리 추가 폼 상태
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    color: 'emerald'
  });

  // 초기 데이터 연동
  useEffect(() => {
    if (categories && categories.length > 0) {
      setLocalCategories(categories);
    }
  }, [categories]);

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

  // 비용 등록 핸들러 (지출 비용 입력 폼 저장 로직)
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.categoryId) {
      alert("지출 카테고리를 선택해 주세요.");
      return;
    }
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      alert("올바른 지출 금액을 입력해 주세요.");
      return;
    }
    if (!expenseForm.title) {
      alert("지출 내역을 입력해 주세요.");
      return;
    }

    const updated = localCategories.map(cat => {
      if (cat.id === Number(expenseForm.categoryId)) {
        return {
          ...cat,
          amount: cat.amount + Number(expenseForm.amount),
          count: cat.count + 1
        };
      }
      return cat;
    });

    // 지출 세부 내역 상태에 항목 추가
    const newExpenseItem = {
      id: expenses.length > 0 ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1,
      categoryId: Number(expenseForm.categoryId),
      date: expenseForm.date,
      title: expenseForm.title,
      amount: Number(expenseForm.amount),
      memo: expenseForm.memo || '-'
    };
    setExpenses([newExpenseItem, ...expenses]);

    setLocalCategories(updated);
    setIsExpenseModalOpen(false);
    
    // 폼 초기화
    setExpenseForm({
      date: new Date().toISOString().substring(0, 10),
      categoryId: '',
      amount: '',
      title: '',
      memo: ''
    });
    alert("지출 비용이 성공적으로 등록되었습니다!");
  };

  // 새 카테고리 추가 핸들러
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryForm.name) {
      alert("카테고리 이름을 입력해 주세요.");
      return;
    }

    const colors = ['emerald', 'blue', 'orange', 'purple', 'pink', 'gray'];
    const randomColor = colors[localCategories.length % colors.length];

    const newCat = {
      id: localCategories.length + 1,
      name: newCategoryForm.name,
      count: 0,
      amount: 0,
      color: newCategoryForm.color || randomColor
    };

    setLocalCategories([...localCategories, newCat]);
    setIsAddCategoryModalOpen(false);
    setNewCategoryForm({ name: '', color: 'emerald' });
    alert("새 카테고리가 추가되었습니다.");
  };

  const handleOpenDetails = (cat) => {
    setSelectedCategory(cat);
    setIsDetailsModalOpen(true);
  };

  const chartData = {
    labels: localCategories.map(c => c.name),
    datasets: [
      {
        data: localCategories.map(c => c.amount),
        backgroundColor: localCategories.map(c => getChartColors(c.color)),
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
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return ` ${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const totalExpense = localCategories.reduce((acc, cat) => acc + cat.amount, 0);

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
          <div className="flex gap-3">
            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              + 지출 비용 등록
            </button>
            <button 
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="px-6 py-3 bg-white text-emerald-600 border border-emerald-200 rounded-2xl text-sm font-black hover:bg-emerald-50 transition-all shadow-sm"
            >
              + 새 카테고리 추가
            </button>
          </div>
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
            {localCategories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getChartColors(cat.color) }}></div>
                <div>
                  <div className="text-xs font-bold text-gray-700">{cat.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {totalExpense > 0 ? ((cat.amount / totalExpense) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 카테고리 그리드 (디자인 참고) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localCategories.map((cat) => (
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
                <button 
                  onClick={() => handleOpenDetails(cat)}
                  className="text-xs font-black text-emerald-600 group-hover:underline flex items-center gap-1"
                >
                  상세보기
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}


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
      {/* 지출 비용 등록 모달 (카테고리입력.jpg 디자인 참고) */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsExpenseModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">지출 비용 등록</h3>
                <p className="text-xs text-gray-400 mt-1">매장에서 발생한 비용 명세를 정확히 입력해 주세요.</p>
              </div>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <form onSubmit={handleAddExpense} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">지출 일자</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">지출 카테고리</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={expenseForm.categoryId}
                  onChange={(e) => setExpenseForm({...expenseForm, categoryId: e.target.value})}
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  {localCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">지출 금액 (원)</label>
                <input 
                  type="number" 
                  placeholder="금액 입력"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">지출 내역</label>
                <input 
                  type="text" 
                  placeholder="예: 양파 구매, 5월 임대료 납부"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({...expenseForm, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">메모 (선택, 최대 150자)</label>
                <textarea 
                  placeholder="추가 세부 사항 입력 (최대 150자)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all min-h-[80px] resize-none"
                  value={expenseForm.memo}
                  onChange={(e) => setExpenseForm({...expenseForm, memo: e.target.value})}
                  maxLength={150}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="flex-grow py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 새 카테고리 추가 모달 */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddCategoryModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">새 카테고리 추가</h3>
              <button onClick={() => setIsAddCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">카테고리 이름</label>
                <input 
                  type="text" 
                  placeholder="예: 마케팅비, 차량유지비"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={newCategoryForm.name}
                  onChange={(e) => setNewCategoryForm({...newCategoryForm, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">대표 색상</label>
                <div className="grid grid-cols-6 gap-2">
                  {['emerald', 'blue', 'orange', 'purple', 'pink', 'gray'].map((col) => {
                    let colBg = 'bg-gray-500';
                    if (col === 'emerald') colBg = 'bg-emerald-500';
                    else if (col === 'blue') colBg = 'bg-blue-500';
                    else if (col === 'orange') colBg = 'bg-orange-500';
                    else if (col === 'purple') colBg = 'bg-purple-500';
                    else if (col === 'pink') colBg = 'bg-pink-500';
                    
                    const isSelected = newCategoryForm.color === col;
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewCategoryForm({...newCategoryForm, color: col})}
                        className={`w-10 h-10 rounded-full ${colBg} flex items-center justify-center transition-all ${isSelected ? 'ring-4 ring-offset-2 ring-emerald-500 scale-105' : 'hover:scale-105'}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="flex-grow py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                >
                  추가 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 지출 상세 내역 풀 스크린 오버레이 UI (텍스트 잘림 방지 최적화) */}
      {isDetailsModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="상세 내역 닫기"
            onClick={() => setIsDetailsModalOpen(false)}
            className="absolute inset-0 bg-gray-950/45 backdrop-blur-sm"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-detail-title"
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl animate-fade-in-up"
          >
            <header className="border-b border-gray-100 px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-black tracking-wider ${getColorClass(selectedCategory.color)}`}>
                    {selectedCategory.name}
                  </div>
                  <h3 id="expense-detail-title" className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                    지출 상세 내역
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    카테고리에 등록된 지출 내역을 확인할 수 있습니다.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="닫기"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
                  <span className="block text-[11px] font-bold text-gray-400">총 지출 건수</span>
                  <strong className="mt-1 block text-xl font-black text-gray-900">
                    {expenses.filter(exp => exp.categoryId === selectedCategory.id).length}건
                  </strong>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
                  <span className="block text-[11px] font-bold text-emerald-600/70">누적 지출 금액</span>
                  <strong className="mt-1 block truncate text-xl font-black text-emerald-700">
                    {formatCurrency(selectedCategory.amount)}
                  </strong>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-gray-50/70 px-4 py-4 sm:px-8 sm:py-6">
              {expenses.filter(exp => exp.categoryId === selectedCategory.id).length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                  {expenses
                    .filter(exp => exp.categoryId === selectedCategory.id)
                    .map((item, index, filteredItems) => (
                      <article
                        key={item.id}
                        className={`p-5 transition-colors hover:bg-gray-50/70 sm:p-6 ${
                          index < filteredItems.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 gap-4">
                            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-900 text-white">
                              <span className="text-[9px] font-bold leading-none text-gray-300">
                                {item.date.split('-')[1]}월
                              </span>
                              <span className="mt-1 text-lg font-black leading-none">
                                {item.date.split('-')[2]}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h4 className="break-words text-base font-black leading-snug text-gray-900 sm:text-lg">
                                {item.title}
                              </h4>
                              <p className="mt-1 text-xs font-semibold text-gray-400">
                                {item.date.replaceAll('-', '.')}
                              </p>
                            </div>
                          </div>
                          <strong className="shrink-0 text-lg font-black text-emerald-600 sm:text-xl">
                            {formatCurrency(item.amount)}
                          </strong>
                        </div>

                        <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
                          <span className="mb-1 block text-[10px] font-bold text-gray-400">메모</span>
                          <p className="break-words text-sm font-medium leading-relaxed text-gray-600">
                            {item.memo && item.memo !== '-' ? item.memo : '등록된 메모가 없습니다.'}
                          </p>
                        </div>
                      </article>
                    ))}
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6M9 8h2m-5 13h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h5 className="mt-4 text-lg font-black text-gray-900">등록된 지출 내역이 없습니다</h5>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    이 카테고리에 지출을 등록하면 상세 내역이 표시됩니다.
                  </p>
                </div>
              )}
            </div>

            <footer className="border-t border-gray-100 bg-white px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-black text-white transition-colors hover:bg-gray-800"
              >
                닫기
              </button>
            </footer>
          </section>
        </div>
      )}

      {false && isDetailsModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[150] bg-gray-50 flex flex-col animate-fade-in-up overflow-hidden">
          {/* 상단 내비게이션 바 */}
          <header className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="group flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-all"
              >
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="font-bold text-sm">목록으로 돌아가기</span>
              </button>
              <div className="h-8 w-[1px] bg-gray-100"></div>
              <div>
                <div className={`w-fit px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border mb-1 ${getColorClass(selectedCategory.color)}`}>
                  {selectedCategory.name}
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">상세 지출 내역 리포트</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-8 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">총 지출 건수</span>
                <span className="text-xl font-black text-gray-800">{selectedCategory.count}건</span>
              </div>
              <div className="w-[1px] h-6 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">누적 합계 금액</span>
                <span className="text-2xl font-black text-emerald-600">{formatCurrency(selectedCategory.amount)}</span>
              </div>
            </div>
          </header>

          {/* 메인 컨텐츠 영역 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50">
            <div className="max-w-6xl mx-auto px-8 py-12">
              <div className="grid grid-cols-1 gap-8">
                {expenses.filter(exp => exp.categoryId === selectedCategory.id).length > 0 ? (
                  expenses
                    .filter(exp => exp.categoryId === selectedCategory.id)
                    .map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-emerald-100 transition-all group"
                      >
                        <div className="p-8 md:p-10">
                          {/* 상단 정보: 날짜 및 금액 */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-50 pb-8">
                            <div className="flex items-center gap-5">
                              <div className="bg-emerald-600 text-white rounded-2xl px-6 py-3 text-center shadow-lg shadow-emerald-100">
                                <div className="text-xs font-bold opacity-80 uppercase tracking-tighter mb-0.5">
                                  {item.date.split('-')[0]}년 {item.date.split('-')[1]}월
                                </div>
                                <div className="text-3xl font-black leading-none">
                                  {item.date.split('-')[2]}일
                                </div>
                              </div>
                              <div>
                                <h4 className="text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
                                  {item.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                  <span className="text-sm font-bold text-gray-400">지출 정산 승인 완료</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-8 py-4 rounded-3xl border border-gray-100 text-right self-start md:self-center">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">지출 금액</span>
                              <div className="text-3xl font-black text-emerald-600">
                                {formatCurrency(item.amount)}
                              </div>
                            </div>
                          </div>

                          {/* 메모 영역 (공간을 최대한 활용) */}
                          <div className="relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-50 rounded-full"></div>
                            <div className="pl-8">
                              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                                <span className="text-lg">📋</span> 비고 및 상세 메모
                              </span>
                              <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-50 text-lg font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {item.memo && item.memo !== '-' ? item.memo : "등록된 추가 메모 사항이 없습니다."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-white rounded-[40px] border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                      <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h5 className="text-2xl font-black text-gray-900 mb-2">지출 내역이 비어있습니다</h5>
                    <p className="text-gray-400 font-bold text-lg">해당 카테고리에 등록된 상세 지출 데이터가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 하단 푸터 (플로팅 버튼 느낌) */}
          <footer className="p-8 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center sticky bottom-0">
            <button 
              onClick={() => setIsDetailsModalOpen(false)}
              className="w-full max-w-md py-5 bg-gray-900 text-white hover:bg-black rounded-[24px] font-black text-lg shadow-2xl shadow-gray-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              확인 완료 및 닫기
            </button>
          </footer>
        </div>
      )}

      <MainFooter />
    </div>
  );
};

export default ExpenseCategoryPage;
