/**
 * @file BusinessMain.jsx
 * @description '사업자' 전역 대시보드 메인 페이지입니다.
 * 에메랄드 테마를 적용하고, 각 알림 및 발주 데이터를 카드와 차트 형태로 시각화합니다.
 */
import React from 'react';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';

function BusinessMain({ setRole }) {
  // 알림 데이터
  const notifications = [
    { id: 1, title: '부족 재고 - 냉동삼겹살 1kg', desc: '현재 재고 3개 · 안전 재고 기준 20개 미달', time: '방금 전', color: 'bg-red-500' },
    { id: 2, title: '유통기한 임박 - 두부 (면두부)', desc: 'D-3 · 12개 남음 · 즉시 처리 권장', time: '8분 전', color: 'bg-orange-500' },
    { id: 3, title: '발주 도착 예정 - 식용유 18L X 6', desc: '오늘 오후 2시~4시 배송 예정', time: '34분 전', color: 'bg-emerald-500' },
    { id: 4, title: '안전 재고 회복 - 간장 1.8L', desc: '입고 완료 · 현재 재고 45개 (기준 30개 이상)', time: '1시간 전', color: 'bg-emerald-500' },
    { id: 5, title: '공구 미수령 - 참치캔 공동 발주', desc: '미수령 인원 5명 · 마감 D-1', time: '2시간 전', color: 'bg-yellow-400' }
  ];

  // 공동 발주 데이터
  const groupOrders = [
    { id: 1, title: '참치캔 (동원 150g X 48)', status: '모집 중', progress: 72, color: 'bg-emerald-500', current: 18, min: 25, dDay: 'D-1', btn: '참여하기' },
    { id: 2, title: '냉동만두 (비비고 2kg X 12)', status: '모집 중', progress: 48, color: 'bg-emerald-500', current: 12, min: 25, dDay: 'D-4', btn: '참여하기' },
    { id: 3, title: '식용유 (CJ 18L X 4)', status: '마감 임박', progress: 95, color: 'bg-red-500', current: 24, min: 25, dDay: '오늘', btn: '마지막 1자리' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        {/* Left: Logo (GuestMain과 위치 통일) */}
        <div className="flex items-center gap-1">
                    {/* 🛠️ relative와 top-[1px] 또는 top-[2px]를 주어 눈대중으로 완벽히 맞추기 */}
                    <img
                      src={logo}
                      alt="SoSo Logo"
                      className="w-12 h-12 object-contain relative top-[5px]"
                    />
                    <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">
                      SoSo
                    </div>
                  </div>

        {/* Center: Navigation (가운데 정렬) */}
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto">
          <a href="#" className="px-4 py-1.5 text-sm font-semibold bg-white text-gray-900 rounded shadow-sm border border-gray-200">홈</a>
          {['재고 관리', '입/출고', '공동 발주', '공고', '통계'].map(m => (
            <a key={m} href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">{m}</a>
          ))}
        </nav>

        {/* Right: Profile & Actions */}
        <div className="flex items-center justify-end gap-4">
          <button className="text-gray-400 hover:text-emerald-600 relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          <div className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white">
            <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">김</div>
            <span className="text-sm font-semibold whitespace-nowrap text-gray-700">김민준 <span className="text-xs text-gray-400 font-normal">강남 본점</span></span>
          </div>
          <button onClick={() => setRole('guest')} className="text-xs font-bold text-gray-300 hover:text-emerald-600 hover:underline border-l border-gray-200 pl-4 ml-2 whitespace-nowrap transition-colors">로그아웃</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Summary Cards */}
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

        {/* Middle Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-700 font-bold uppercase tracking-widest text-[10px] text-gray-400 uppercase tracking-widest text-[10px] text-gray-400">월별 입/출고 현황</h3>
            <div className="h-40 flex items-end justify-around gap-2 mb-4 px-4 border-b border-gray-100">
               {[40, 60, 80, 100, 85, 95].map((h, i) => (
                 <div key={i} className="bg-emerald-300 w-full max-w-[35px] rounded-t-sm" style={{ height: `${h}%` }}></div>
               ))}
            </div>
            <div className="flex justify-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> 입고</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-300"></div> 출고</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold mb-6 text-gray-700 font-bold uppercase tracking-widest text-[10px] text-gray-400 uppercase tracking-widest text-[10px] text-gray-400">월별 매출 현황</h3>
            <div className="h-40 relative flex items-end justify-around gap-2 mb-4 px-4 border-b border-gray-100">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100"><polyline fill="none" stroke="#10b981" strokeWidth="1.5" points="5,80 25,40 45,60 65,20 85,50 95,10" /></svg>
              {[80, 30, 60, 40, 90, 20].map((h, i) => (
                 <div key={i} className="bg-gray-50 w-full max-w-[20px] rounded-t-sm" style={{ height: `${h}%` }}></div>
               ))}
            </div>
             <div className="flex justify-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> 매출액</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-200"></div> 목표</span>
            </div>
          </div>
        </div>

        {/* Bottom Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold mb-6 text-gray-700 font-bold uppercase tracking-widest text-[10px] text-gray-400 uppercase tracking-widest text-[10px] text-gray-400">실시간 알림</h3>
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
            <h3 className="font-bold mb-6 text-gray-700 font-bold uppercase tracking-widest text-[10px] text-gray-400 uppercase tracking-widest text-[10px] text-gray-400">공동 발주 현황</h3>
            <div className="space-y-4">
              {groupOrders.map(o => (
                <div key={o.id} className="border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all">
                  <div className="flex justify-between mb-4"><h4 className="text-sm font-bold text-gray-900 font-bold uppercase tracking-widest text-[10px] text-gray-400">{o.title}</h4><span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${o.status === '모집 중' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-red-500 border-red-100 bg-red-50'}`}>{o.status}</span></div>
                  <div className="w-full bg-gray-50 h-1.5 rounded-full mb-3"><div className={`${o.color} h-full rounded-full`} style={{ width: `${o.progress}%` }}></div></div>
                  <div className="flex justify-between items-center mb-6 text-[10px] text-gray-400 font-bold uppercase tracking-tight"><span>참여 {o.current} / {o.min}개</span><span>{o.progress}% · {o.dDay}</span></div>
                  <button className="w-full py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-100/50">{o.btn}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* 공통 푸터 */}
      <MainFooter />
    </div>
  );
}

export default BusinessMain;
