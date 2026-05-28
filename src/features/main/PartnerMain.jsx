/**
 * @file PartnerMain.jsx
 * @description '거래처' 대시보드 페이지입니다. 
 * 에메랄드 테마를 바탕으로 수금 관리 및 사업자별 요약 정보를 시각화합니다.
 */
import React from 'react';
import logo from '../../assets/soso로고.png';

function PartnerMain({ setRole }) {
  // 알림 데이터 (거래처 시점)
  const notifications = [
    {
      id: 1,
      title: '신규 발주 접수 - 강남 본점',
      desc: '냉동삼겹살 10kg x 5 총 37만원',
      time: '방금 전',
      color: 'bg-red-500'
    },
    {
      id: 2,
      title: '미수금 결제 완료 - 홍대 2호점',
      desc: '210만원 입금 확인, 잔액 0원',
      time: '8분 전',
      color: 'bg-emerald-500'
    },
    {
      id: 3,
      title: '재고 임박 - 참치캔 150g',
      desc: '잔여 재고 30개, 평균 소진 3일',
      time: '34분 전',
      color: 'bg-orange-500'
    },
    {
      id: 4,
      title: '납품 예정일 - 신촌 3호점',
      desc: '내일 오전 10시, 건어물류 4종',
      time: '1시간 전',
      color: 'bg-blue-500'
    },
    {
      id: 5,
      title: '미수금 연체 - 이태원 직영점',
      desc: 'D+15, 840만원, 독촉 알림 발송',
      time: '2시간 전',
      color: 'bg-yellow-400'
    }
  ];

  // 사업자별 매출 요약
  const businessSales = [
    { name: '강남 본점', desc: '이번 달 12건, 미수금 없음', amount: '1,240만', trend: '↑ +8.2%', progress: 100, color: 'bg-emerald-500' },
    { name: '홍대 2호점', desc: '이번 달 9건, 입금 완료', amount: '980만', trend: '↑ +3.1%', progress: 100, color: 'bg-emerald-500' },
    { name: '신촌 3호점', desc: '이번 달 7건, 미수금 340만', amount: '740만', trend: '↓ -2.4%', progress: 65, color: 'bg-orange-400' },
    { name: '이태원 직영점', desc: '이번 달 5건, 미수금 840만', amount: '620만', trend: '연체 D+15', progress: 30, color: 'bg-red-500' }
  ];

  // 공동 발주 데이터
  const groupOrders = [
    {
      id: 1,
      title: '참치캔 (동원 150g X 48)',
      status: '발주 완료',
      progress: 100,
      color: 'bg-blue-500',
      dDay: '배송 준비 중',
      btn: '배송 현황 보기'
    },
    {
      id: 2,
      title: '냉동만두 (비비고 2kg X 12)',
      status: '모집 중',
      progress: 48,
      color: 'bg-emerald-500',
      dDay: '마감 D-4',
      btn: '참여하기'
    },
    {
      id: 3,
      title: '식용유 (CJ 18L X 4)',
      status: '마감 임박',
      progress: 95,
      color: 'bg-red-500',
      dDay: '마감 오늘',
      btn: '수량 수정 / 취소'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* Header 영역 */}
      <header className="flex justify-between items-center py-3 px-8 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
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
          <nav className="hidden md:flex gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50">
            <a href="#" className="px-4 py-1.5 text-sm font-semibold bg-white text-gray-900 rounded shadow-sm border border-gray-200">홈</a>
            {['발주 관리', '수금 관리', '공동 발주', '업체 홍보', '통계'].map(m => (
              <a key={m} href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors">{m}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white">
            <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">백</div>
            <span className="text-sm font-semibold">백서연 <span className="text-xs text-gray-400 font-normal">한빛 식품 유통</span></span>
          </div>
          <button onClick={() => setRole('guest')} className="text-xs text-gray-400 hover:underline border-l border-gray-200 pl-4 ml-2">로그아웃</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* 상단 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: '신규 발주 (오늘)', v: '12', u: '건', b: '↑ 어제 대비 +3건', c: 'border-emerald-100' },
            { t: '배송 중', v: '7', u: '건', b: '정상 배송 중', c: 'border-emerald-100' },
            { t: '입금 대기', v: '1,200', u: '만원', b: '이번 달 기준', c: 'border-orange-100' }
          ].map((s, i) => (
            <div key={i} className={`bg-white p-6 rounded-2xl border-2 shadow-sm ${s.c}`}>
              <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider font-semibold">{s.t}</div>
              <div className="text-4xl font-black mb-4 tracking-tight">{s.v}<span className="text-sm font-normal text-gray-400 ml-1">{s.u}</span></div>
              <span className="px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-[10px] font-bold text-emerald-600">{s.b}</span>
            </div>
          ))}
        </div>

        {/* 차트 영역 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h3 className="font-bold mb-8">월별 매출/수금 추이</h3>
          <div className="h-60 relative flex items-end justify-around border-b border-gray-100 mb-6 px-4">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
               <polyline fill="none" stroke="#ef4444" strokeWidth="1" points="0,70 15,50 30,60 45,40 60,65 75,30 90,50 100,40" />
            </svg>
            {[40, 60, 55, 80, 45, 90, 70, 85].map((h, i) => (
               <div key={i} className="flex gap-1 items-end w-full max-w-[40px] h-full">
                  <div className="bg-emerald-200 w-1/2 rounded-t-sm" style={{ height: `${h-15}%` }}></div>
                  <div className="bg-emerald-400 w-1/2 rounded-t-sm" style={{ height: `${h}%` }}></div>
               </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-gray-100 pt-4">
             <div><div className="text-xs text-gray-400 mb-1 font-medium">이번 달 매출</div><div className="text-lg font-bold">8,340만</div></div>
             <div><div className="text-xs text-gray-400 mb-1 font-medium">이번 달 수금</div><div className="text-lg font-bold">3,520만</div></div>
             <div><div className="text-xs text-gray-400 mb-1 font-medium">누적 미수금</div><div className="text-lg font-bold text-red-500">4,820만</div></div>
             <div><div className="text-xs text-gray-400 mb-1 font-medium">수금률</div><div className="text-lg font-bold">73%</div></div>
          </div>
        </div>

        {/* 하단 3분할 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* 사업자별 매출 요약 */}
           <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold mb-6 flex justify-between items-center">
                사업자별 매출 요약
                <span className="text-[10px] text-gray-400 font-normal cursor-pointer hover:text-emerald-600 transition-colors">전체 보기 &gt;</span>
              </h3>
              <div className="space-y-6">
                {businessSales.map(b => (
                   <div key={b.name} className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 items-center">
                          <div className="w-6 h-6 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] text-gray-400">CI</div>
                          <div><div className="font-bold text-sm">{b.name}</div><div className="text-[10px] text-gray-400 tracking-tight">{b.desc}</div></div>
                        </div>
                        <div className="text-right"><div className="font-bold text-sm tracking-tighter">{b.amount}</div><div className="text-[10px] text-emerald-500 font-bold">{b.trend}</div></div>
                      </div>
                      <div className="w-full bg-gray-50 h-1 rounded-full overflow-hidden ml-8" style={{ width: 'calc(100% - 32px)' }}><div className={`${b.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${b.progress}%` }}></div></div>
                   </div>
                ))}
              </div>
           </div>

           {/* 공동 발주 현황 */}
           <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold mb-6 flex justify-between items-center">
                공동 발주 현황
                <span className="text-[10px] text-gray-400 font-normal cursor-pointer hover:text-emerald-600 transition-colors">발주 개설 +</span>
              </h3>
              <div className="space-y-4">
                {groupOrders.map(o => (
                  <div key={o.id} className="border border-gray-100 rounded-xl p-4 hover:border-emerald-100 transition-colors">
                    <div className="flex justify-between mb-2">
                      <h4 className="text-xs font-bold text-gray-900">{o.title}</h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${o.status === '모집 중' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : (o.status === '발주 완료' ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-red-500 bg-red-50 border-red-100')}`}>{o.status}</span>
                    </div>
                    <div className="w-full bg-gray-50 h-1.5 rounded-full mb-2"><div className={`${o.color} h-full rounded-full`} style={{ width: `${o.progress}%` }}></div></div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-3 font-medium"><span>{o.progress}% 완료</span><span>{o.dDay}</span></div>
                    <button className="w-full py-1.5 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">{o.btn}</button>
                  </div>
                ))}
              </div>
           </div>

           {/* 실시간 알림 (요청하신 부분 추가) */}
           <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold mb-6 flex justify-between items-center">
                실시간 알림
                <span className="text-[10px] text-gray-400 font-normal cursor-pointer hover:text-emerald-600 transition-colors">전체 보기 &gt;</span>
              </h3>
              <div className="space-y-5">
                {notifications.map(n => (
                  <div key={n.id} className="flex gap-3 items-start group cursor-pointer">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.color}`}></div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="text-[11px] font-bold text-gray-800 group-hover:text-emerald-600 transition-colors tracking-tight">{n.title}</h4>
                        <span className="text-[9px] text-gray-300 whitespace-nowrap ml-1">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

export default PartnerMain;
