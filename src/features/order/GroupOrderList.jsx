import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
import authStore from '../../store/authStore';
import { useGroupOrder } from './hooks/useGroupOrderList';

/**
 * @file GroupOrderList.jsx
 * @description 사업자 공동 발주 현황 리스트 페이지입니다.
 * 모집 진척도 시각화, 상태 필터링 및 참여 상세 정보 기능을 제공합니다.
 */
function GroupOrderList() {
  const { groupOrders, filterStatus, handleFilterChange } = useGroupOrder();
  const logout = authStore((state) => state.logout);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // 상태별 컬러 매핑
  const statusColors = {
    '모집중': 'bg-emerald-500 text-white',
    '모집완료': 'bg-blue-600 text-white',
    '모집실패': 'bg-gray-400 text-white',
    '배송준비': 'bg-orange-500 text-white',
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans">
      {/* Header */}
      <header className="grid grid-cols-3 items-center py-4 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="SoSo Logo" className="w-10 h-10 object-contain" />
          <div className="text-[32px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-xl p-1 bg-gray-50 w-fit mx-auto relative">
          <Link to="/" className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">홈</Link>
          
          {/* 발주 관리 드롭다운 메뉴 */}
          <div 
            className="relative"
            onMouseEnter={() => setIsOrderDropdownOpen(true)}
            onMouseLeave={() => setIsOrderDropdownOpen(false)}
          >
            <div className={`px-5 py-2 text-sm font-bold rounded-lg shadow-sm border cursor-pointer transition-all whitespace-nowrap ${isOrderDropdownOpen ? 'bg-white text-emerald-600 border-gray-100' : 'bg-white text-emerald-600 border-gray-100'}`}>
              발주 관리
            </div>
            
            {/* 드롭다운 컨테이너 (투명 브릿지 포함) */}
            <div className={`absolute top-full left-0 w-48 pt-2 z-[60] transition-all duration-200 ${isOrderDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2">
                <Link to="/orders" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl mb-1">
                  일반 발주 현황
                </Link>
                <Link to="/group-orders" className="block w-full text-left px-4 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl transition-colors">
                  공동 발주 현황
                </Link>
              </div>
            </div>
          </div>

          {['수금 관리', '업체 홍보', '통계'].map(m => (
            <span key={m} className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap cursor-pointer">{m}</span>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-5">
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-emerald-600 relative">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white hover:border-emerald-200 cursor-pointer transition-all"
            >
              <div className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">김</div>
              <span className="text-sm font-bold text-gray-700">김민준</span>
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-[60]">
                <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">마이페이지</button>
                <button onClick={handleLogOut} className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">로그아웃</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">공동 발주 현황</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black uppercase tracking-wider">Group Buying</span>
              <p className="text-gray-500 font-semibold text-sm">함께 주문하고 더 큰 할인 혜택을 누리세요.</p>
            </div>
          </div>
          <button className="bg-gray-900 text-white px-6 py-2 rounded-2xl font-black hover:bg-black transition-all shadow-lg flex items-center gap-2">
            <span className="text-xl">+</span> 공동 발주 개설
          </button>
        </div>

        {/* 공동발주 7단계 프로세스 바 */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm mb-10 overflow-x-auto">
          <div className="flex justify-between items-center min-w-[800px] max-w-6xl mx-auto relative px-4">
            {/* 연결 선 */}
            <div className="absolute top-8 left-0 w-full h-1 bg-gray-50 -z-0 rounded-full"></div>
            {[
              { label: '모집중', icon: '📢', count: 2, active: true },
              { label: '마감', icon: '⏰', count: 1, active: false },
              { label: '발주완료', icon: '📝', count: 0, active: false },
              { label: '배송중', icon: '🚚', count: 0, active: false },
              { label: '검수중', icon: '🔍', count: 0, active: false },
              { label: '배분중', icon: '📦', count: 0, active: false },
              { label: '완료', icon: '✅', count: 142, active: false },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-4 relative z-10 bg-white px-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm transition-all ${step.active ? 'bg-blue-50 text-blue-600 ring-4 ring-blue-50' : 'bg-gray-50 text-gray-300 grayscale border border-gray-100'}`}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <div className={`text-[13px] font-black mb-0.5 whitespace-nowrap ${step.active ? 'text-blue-800' : 'text-gray-400'}`}>{step.label}</div>
                  <div className={`text-xs font-bold ${step.active ? 'text-blue-500' : 'text-gray-300'}`}>{step.count}건</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-4 shadow-sm mb-8 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl">
            {['전체', '모집중', '모집완료', '모집실패'].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                  filterStatus === status 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="품목명 또는 업체명 검색" className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-black">검색</button>
          </div>
        </div>

        {/* 공동 발주 상세 목록 테이블 - 레이아웃 및 간격 최적화 */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-12 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 whitespace-nowrap">발주 번호</th>
                <th className="px-15 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 whitespace-nowrap">품목 정보</th>
                <th className="px-5 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 whitespace-nowrap">공급업체</th>
                <th className="px-16 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 whitespace-nowrap">모집 현황</th>
                <th className="px-5 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 whitespace-nowrap">공동 구매가</th>
                <th className="px-7 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 whitespace-nowrap">상태</th>
                <th className="px-4 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 whitespace-nowrap">마감 기한</th>
                <th className="px-4 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 text-center whitespace-nowrap">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {groupOrders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-5 py-6 text-xs font-black text-gray-900 whitespace-nowrap uppercase">
                    {order.id}
                  </td>
                  <td className="px-5 py-6">
                    <div className="flex flex-col min-w-[180px]">
                      <span className="text-[9px] font-black text-blue-500 mb-0.5 uppercase tracking-tighter">{order.category}</span>
                      <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{order.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <div className="text-xs font-bold text-gray-700">{order.supplier}</div>
                  </td>
                  <td className="px-5 py-6">
                    <div className="w-40">
                      <div className="flex justify-between items-end mb-1.5 text-[10px] font-black">
                        <span className="text-blue-600">{order.currentCount}/{order.minCount}개</span>
                        <span className="text-blue-600">{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-300 font-bold line-through leading-none mb-1">₩{order.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-gray-900 leading-none">₩{order.discountPrice.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-red-500 italic">-{Math.round((1 - order.discountPrice / order.price) * 100)}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black border shadow-sm inline-block ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-black text-red-600 mb-0.5">{order.dDay}</span>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{order.deadline} 마감</span>
                    </div>
                  </td>
                  <td className="px-5 py-6 text-center whitespace-nowrap">
                    <button className={`px-4 py-1.5 rounded-lg font-black text-[10px] transition-all ${order.status === '모집중' ? 'bg-gray-900 text-white hover:bg-black shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                      {order.status === '모집중' ? '참여하기' : '상세보기'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Placeholder */}
          <div className="px-8 py-6 bg-gray-50/50 flex justify-center border-t border-gray-50">
             <div className="flex gap-2">
               {[1, 2, 3, 4, 5].map(n => (
                 <button key={n} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${n === 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}>{n}</button>
               ))}
             </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}

export default GroupOrderList;
