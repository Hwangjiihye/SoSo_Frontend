/**
 * @file BusinessMain.jsx
 * @description '사업자' 대시보드 메인 페이지입니다.
 * useNavigate 훅을 사용하여 프로필 클릭 시 마이페이지로 이동하는 기능을 추가했습니다.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';

function BusinessMain({ setRole }) {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleProfileClick = () => {
    navigate('/business-mypage'); // 지정된 경로로 이동
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
        <div className="flex items-center gap-2">
          <img src={logo} alt="SoSo Logo" className="w-8 h-8 object-contain" />
          <div className="text-2xl font-black text-emerald-600 tracking-tighter">SoSo</div>
        </div>
        <nav className="hidden md:flex justify-center">
          {/* ... 네비게이션 메뉴 ... */}
        </nav>
        <div className="flex items-center justify-end gap-4">
          <button className="text-gray-400 hover:text-emerald-600 relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          {/* 프로필 클릭 시 handleProfileClick 함수 실행 */}
          <div
            onClick={handleProfileClick}
            className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white hover:bg-emerald-50 cursor-pointer transition-colors"
          >
            <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">김</div>
            <span className="text-sm font-semibold whitespace-nowrap text-gray-700">김민준 <span className="text-xs text-gray-400 font-normal">강남 본점</span></span>
          </div>
          <button onClick={() => setRole('guest')} className="text-xs text-gray-400 hover:underline">로그아웃</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* ... 페이지 나머지 콘텐츠 ... */}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
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
