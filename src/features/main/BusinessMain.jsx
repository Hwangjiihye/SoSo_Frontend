/**
 * @file BusinessMain.jsx
 * @description '사업자' 대시보드 메인 페이지입니다.
 * authStore에서 실제 회원 정보를 가져와 프로필 영역에 표시하며, 훅 사용을 최적화했습니다.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

import { useStores } from '../../hooks/useStores';

function BusinessMain({ setRole }) {
  // authStore에서 필요한 상태와 매장 전환 함수를 가져옵니다.
  const { logout, user_type, user_nickname, bizname, selectedStoreSeq, setSelectedStore } = authStore();
  const navigate = useNavigate();

  // 🏪 [멀티 프로필] 사장님의 모든 매장 목록을 가져옵니다.
  const { stores, isLoading: isStoresLoading } = useStores();

  // 프로필 드롭다운 상태
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 마이페이지 이동 핸들러
  const handleProfileClick = () => {
    if (user_type === 'BUSINESS') {
      navigate('/business-mypage');
      setIsProfileOpen(false); // 이동 시 드롭다운 닫기
    } else {
      alert("사업자 전용 마이페이지입니다.");
    }
  };

  /**
   * 🔄 매장 전환 핸들러
   * 클릭한 매장으로 프로필을 전환하고 마이페이지로 이동합니다.
   */
  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    navigate('/business-mypage');
    setIsProfileOpen(false);
  };

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // --- 차트 데이터 영역 (기존과 동일) ---
  const stockChartData = {
    labels: ['소고기', '돼지고기', '닭고기', '양파', '마늘', '식용유'],
    datasets: [{
        label: '현재 재고',
        data: [45, 12, 33, 8, 2, 28],
        backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)'],
        borderColor: ['rgb(16, 185, 129)', 'rgb(239, 68, 68)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)', 'rgb(16, 185, 129)'],
        borderWidth: 1,
        borderRadius: 8,
    }]
  };

  const salesChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [{
        label: '매출액 (만원)',
        data: [1200, 1900, 1500, 2100, 2400, 1800],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
  };

  const notifications = [
    { id: 1, title: '부족 재고 - 냉동삼겹살 1kg', desc: '현재 재고 3개 · 안전 재고 기준 20개 미달', time: '방금 전', color: 'bg-red-500' },
    { id: 2, title: '유통기한 임박 - 두부 (면두부)', desc: 'D-3 · 12개 남음 · 즉시 처리 권장', time: '8분 전', color: 'bg-orange-500' },
    { id: 3, title: '발주 도착 예정 - 식용유 18L X 6', desc: '오늘 오후 2시~4시 배송 예정', time: '34분 전', color: 'bg-emerald-500' },
  ];

  const groupOrders = [
    { id: 1, title: '참치캔 (동원 150g X 48)', status: '모집 중', progress: 72, color: 'bg-emerald-500', current: 18, min: 25, dDay: 'D-1', btn: '참여하기' },
    { id: 2, title: '냉동만두 (비비고 2kg X 12)', status: '모집 중', progress: 48, color: 'bg-emerald-500', current: 12, min: 25, dDay: 'D-4', btn: '참여하기' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="SoSo Logo" className="w-12 h-12 object-contain relative top-[5px]" />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto">
          <a href="/" className="px-4 py-1.5 text-sm font-semibold bg-white text-gray-900 rounded shadow-sm border border-gray-200">홈</a>
          <Link to="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">발주 관리</Link>
          <Link to="/settlement" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">수금 관리</Link>
          {['공동 발주', '업체 홍보', '통계'].map(m => (
            <a key={m} href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">{m}</a>
          ))}
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
                          // 현재 선택된 매장인지 확인하여 스타일 차별화
                          (selectedStoreSeq == store.storeSeq || (!selectedStoreSeq && stores[0].storeSeq === store.storeSeq))
                            ? 'bg-emerald-50 text-emerald-600 font-bold border border-emerald-100' 
                            : 'text-gray-600 hover:bg-gray-50 font-medium'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm">{store.companyName}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{store.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}</span>
                        </div>
                        {(selectedStoreSeq == store.storeSeq || (!selectedStoreSeq && stores[0].storeSeq === store.storeSeq)) && (
                          <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">Active</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-xs text-gray-400">등록된 매장이 없습니다.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-50 pt-2 mt-2">
                  <button 
                    onClick={() => { navigate("/business-multiprofile"); setIsProfileOpen(false); }}
                    className="w-full text-center py-2 text-[11px] font-bold text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all mb-1"
                  >
                    + 새 매장 추가하기
                  </button>
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

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { t: '총 재고', v: '1,284', u: '개 품목', b: '전주 대비 +3.2%', c: 'border-emerald-100' },
            { t: '부족 재고', v: '17', u: '개 품목', b: '즉시 발주 필요', c: 'border-red-100', tc: 'text-red-600' },
            { t: '유통기한 임박', v: '8', u: '개 품목', b: '주의 필요', c: 'border-orange-100', tc: 'text-orange-600' },
            { t: '공동 발주', v: '3', u: '건 진행 중', b: '참여 가능 2건', c: 'border-emerald-100', tc: 'text-emerald-600' }
          ].map((s, i) => (
            <div key={i} className={`bg-white p-5 rounded-2xl border-2 shadow-sm ${s.c}`}>
              <div className="text-gray-500 text-sm mb-2">{s.t}</div>
              <div className="text-3xl font-extrabold mb-4">{s.v}<span className="text-sm font-medium text-gray-400 ml-1">{s.u}</span></div>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold bg-gray-50 ${s.tc || 'text-emerald-600 border-emerald-100'}`}>{s.b}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                현재 재고 현황
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">기준: 오늘 실시간</span>
            </div>
            <div className="h-64">
              <Bar data={stockChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                월별 매출 현황
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">단위: 만원</span>
            </div>
            <div className="h-64">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-700">실시간 알림</h3>
            <div className="space-y-6">
              {notifications.map(n => (
                <div key={n.id} className="flex gap-4 group cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${n.color}`}></div>
                  <div className="flex-grow border-b border-gray-50 pb-4 group-last:border-0">
                    <div className="flex justify-between items-start mb-0.5"><h4 className="text-sm font-bold text-gray-800">{n.title}</h4><span className="text-[10px] text-gray-300 font-bold">{n.time}</span></div>
                    <p className="text-xs text-gray-400 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-700">공동 발주 현황</h3>
            <div className="space-y-4">
              {groupOrders.map(o => (
                <div key={o.id} className="border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all">
                  <div className="flex justify-between mb-4"><h4 className="text-sm font-bold text-gray-900">{o.title}</h4><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${o.status === '모집 중' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-red-500 border-red-100 bg-red-50'}`}>{o.status}</span></div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full mb-3"><div className={`${o.color} h-full rounded-full`} style={{ width: `${o.progress}%` }}></div></div>
                  <div className="flex justify-between items-center mb-6 text-[10px] text-gray-400 font-bold uppercase tracking-tight"><span>참여 {o.current} / {o.min}개</span><span>{o.progress}% · {o.dDay}</span></div>
                  <button className="w-full py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-100/50">{o.btn}</button>
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

export default BusinessMain;
