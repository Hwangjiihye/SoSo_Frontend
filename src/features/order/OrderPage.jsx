import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';
import authStore from '../../store/authStore';
import { useOrder } from './hooks/useOrder';

/**
 * @file OrderPage.jsx
 * @description 사업자 발주 관리 메인 화면입니다.
 * 발주 목록 조회, 기간/상태 필터링, 엑셀 다운로드 등 상세 기능을 포함합니다.
 */
function OrderPage() {
  const { orders, keyword, filterStatus, dateRange, handleKeywordChange, fetchSearch, reset, handleFilterChange, handleDateRangeChange } = useOrder();
  const logout = authStore((state) => state.logout);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // 발주 상태별 컬러 매핑
  const statusColors = {
    '배송중': 'text-blue-600 bg-blue-50 border-blue-100',
    '배송완료': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    '주문취소': 'text-red-500 bg-red-50 border-red-100',
    '대기중': 'text-orange-500 bg-orange-50 border-orange-100',
  };

  // 결제 상태별 컬러 매핑
  const paymentColors = {
    '결제완료': 'text-gray-700 bg-gray-100 border-gray-200',
    '미결제': 'text-red-600 bg-red-50 border-red-100',
    '환불완료': 'text-gray-400 bg-gray-50 border-gray-100',
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
                <Link to="/orders" className="block w-full text-left px-4 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl mb-1">
                  일반 발주 현황
                </Link>
                <Link to="/group-orders" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  공동 발주 현황
                </Link>
                <Link to="/orders/new" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  발주 신청
                </Link>
              </div>
            </div>
          </div>
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
        {/* Page Title & Main Action */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">일반 발주 현황</h2>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-wider">Business Mode</span>
              <p className="text-gray-500 font-semibold text-sm">매장의 발주 상태를 실시간으로 모니터링하세요.</p>
            </div>
          </div>
        </div>

        {/* 발주 현황 타이틀 추가 */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            발주 현황
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-400">최근 업데이트: 2024.06.01 14:30</span>
            <button className="text-xs font-bold text-emerald-600 hover:underline">🔄 새로고침</button>
          </div>
        </div>

        {/* Status Summary - 더 상세한 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: '전체 발주', value: '156', color: 'border-gray-200', text: 'text-gray-900' },
            { label: '승인 대기', value: '2', color: 'border-orange-200', text: 'text-orange-600'},
            { label: '배송 중', value: '4', color: 'border-blue-200', text: 'text-blue-600'},
            { label: '배송 완료', value: '142', color: 'border-emerald-200', text: 'text-emerald-600' },
            { label: '취소/반품', value: '8', color: 'border-red-200', text: 'text-red-600' },
          ].map((item, idx) => (
            <div key={idx} className={`bg-white p-7 rounded-3xl border shadow-sm transition-transform hover:-translate-y-1 ${item.color}`}>
              <div className="text-gray-600 text-[12px] font-black uppercase tracking-[0.2em] mb-3">{item.label}</div>
              <div className={`text-3xl font-black mb-1 ${item.text}`}>{item.value}건</div>
              {item.sub && <div className="text-[10px] font-bold text-gray-400">{item.sub}</div>}
            </div>
          ))}
        </div>

        {/* 주문 프로세스 바 - 초기 이모티콘 스타일 복구 */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm mb-10">
          <div className="flex justify-between items-center max-w-5xl mx-auto relative">
            {/* 연결 선 */}
            <div className="absolute top-8 left-0 w-full h-1 bg-gray-50 -z-0 rounded-full"></div>

            {[
              { label: '발주신청', icon: '📝', count: 0, active: true },
              { label: '접수완료', icon: '📩', count: 2, active: true },
              { label: '상품준비', icon: '📦', count: 1, active: false },
              { label: '배송중', icon: '🚚', count: 4, active: false },
              { label: '배송완료', icon: '✅', count: 142, active: false },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-5 relative z-10 bg-white px-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm transition-all ${step.active ? 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-100' : 'bg-gray-50 text-gray-300 grayscale border border-gray-100'}`}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <div className={`text-base font-black mb-1 ${step.active ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</div>
                  <div className={`text-sm font-bold ${step.active ? 'text-emerald-500' : 'text-gray-300'}`}>{step.count}건</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Section - 상세 검색 및 기간 설정 */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-4 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 기간 필터 */}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl">
              <span className="text-xs font-black text-gray-600 px-3 uppercase tracking-tighter">조회 기간</span>
              {['오늘', '7일', '1개월', '3개월'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleDateRangeChange(range)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    dateRange === range 
                    ? 'bg-white text-emerald-600 shadow-sm border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
              <div className="h-4 w-px bg-gray-200 mx-2"></div>
              <input type="date" className="bg-transparent border-none text-xs font-bold text-gray-500 focus:ring-0 cursor-pointer" />
              <span className="text-gray-300">~</span>
              <input type="date" className="bg-transparent border-none text-xs font-bold text-gray-500 focus:ring-0 cursor-pointer" />
            </div>

            {/* 상태 필터 */}
            <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl flex-grow">
              <span className="text-xs font-black text-gray-600 px-3 uppercase tracking-tighter">발주 상태</span>
              {[
                { name: '전체', activeClass: 'bg-gray-900 text-white shadow-lg shadow-gray-200' },
                { name: '대기중', activeClass: 'bg-orange-500 text-white shadow-lg shadow-orange-100' },
                { name: '배송중', activeClass: 'bg-blue-600 text-white shadow-lg shadow-blue-100' },
                { name: '배송완료', activeClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' },
                { name: '주문취소', activeClass: 'bg-red-500 text-white shadow-lg shadow-red-100' },
              ].map((status) => (
                <button
                  key={status.name}
                  onClick={() => handleFilterChange(status.name)}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all transform active:scale-95 ${
                    filterStatus === status.name 
                    ? status.activeClass 
                    : 'text-gray-400 hover:bg-white hover:text-gray-600'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex gap-4">
            <div className="relative flex-grow">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input 
                type="text" 
                value={keyword}
                onChange={handleKeywordChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchSearch();
                  }
                }}
                placeholder="발주 번호, 공급업체, 또는 품목명을 입력하세요" 
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
            <button onClick={fetchSearch} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black transition-all">검색하기</button>
            <button onClick={reset} className="bg-white border border-gray-200 text-gray-400 px-4 py-4 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">🔄 초기화</button>
          </div>
        </div>

        {/* Data List - 더 많은 정보를 담은 테이블 */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
              발주 상세 목록 <span className="text-gray-500 font-medium ml-1 text-sm">{orders.length}건</span>
            </h3>
            <div className="flex gap-4">
               <select className="text-xs font-bold text-gray-500 bg-gray-50 border-none rounded-lg px-3 py-1.5 outline-none">
                 <option>최신순</option>
                 <option>금액 높은순</option>
                 <option>금액 낮은순</option>
               </select>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-18 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">발주번호</th>
                <th className="px-16 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">공급업체</th>
                <th className="px-15 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">발주 품목</th>
                <th className="px-7 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">결제 금액/수단</th>
                <th className="px-12 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50">상태</th>
                <th className="px-8 py-5 text-[12px] font-black text-gray-600 uppercase tracking-widest border-b border-gray-50 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.orderSeq} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-gray-900 mb-1">{order.orderNo}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs">🏢</div>
                      <div className="text-sm font-bold text-gray-700">{order.companyName || '-'}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm text-gray-600 font-medium">{order.itemSummary || '-'}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-emerald-600 mb-1">
                      {order.totalAmount != null ? `${order.totalAmount.toLocaleString()}원` : '-'}
                    </div>
                  </td>
                  {/* <td className="px-8 py-6">
                    <div className="text-sm font-black text-emerald-600 mb-1">{order.totalAmount ? order.totalAmount.toLocaleString() + '원' : '-'}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-gray-400">{order.paymentMethod}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${paymentColors[order.paymentStatus]}`}>{order.paymentStatus}</span>
                    </div>
                  </td> */}
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border shadow-sm inline-block ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-emerald-600 shadow-sm" title="상세보기">📄</button>
                      <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 text-gray-400 hover:text-red-500 shadow-sm" title="발주취소">✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Placeholder */}
          <div className="px-8 py-6 bg-gray-50/50 flex justify-center border-t border-gray-50">
             <div className="flex gap-2">
               {[1, 2, 3, 4, 5].map(n => (
                 <button key={n} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${n === 1 ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}>{n}</button>
               ))}
             </div>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}

export default OrderPage;
