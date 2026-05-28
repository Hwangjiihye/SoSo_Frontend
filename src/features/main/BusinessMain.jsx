import React from 'react';

function BusinessMain({ setRole }) {
  // 알림 데이터 Mock
  const notifications = [
    {
      id: 1,
      type: 'danger',
      title: '부족 재고 - 냉동삼겹살 1kg',
      desc: '현재 재고 3개 · 안전 재고 기준 20개 미달',
      time: '방금 전',
      color: 'bg-red-500'
    },
    {
      id: 2,
      type: 'warning',
      title: '유통기한 임박 - 두부 (면두부)',
      desc: 'D-3 · 12개 남음 · 즉시 처리 권장',
      time: '8분 전',
      color: 'bg-orange-500'
    },
    {
      id: 3,
      type: 'success',
      title: '발주 도착 예정 - 식용유 18L X 6',
      desc: '오늘 오후 2시~4시 배송 예정',
      time: '34분 전',
      color: 'bg-green-500'
    },
    {
      id: 4,
      type: 'info',
      title: '안전 재고 회복 - 간장 1.8L',
      desc: '입고 완료 · 현재 재고 45개 (기준 30개 이상)',
      time: '1시간 전',
      color: 'bg-blue-500'
    },
    {
      id: 5,
      type: 'yellow',
      title: '공구 미수령 - 참치캔 공동 발주',
      desc: '미수령 인원 5명 · 마감 D-1 · 재촉 알림 발송 가능',
      time: '2시간 전',
      color: 'bg-yellow-400'
    }
  ];

  // 공동 발주 데이터 Mock
  const groupOrders = [
    {
      id: 1,
      title: '참치캔 (동원 150g X 48)',
      status: '모집 중',
      statusColor: 'text-green-600 bg-green-50 border-green-200',
      progress: 72,
      progressColor: 'bg-blue-500',
      current: 18,
      min: 25,
      dDay: 'D-1',
      btnText: '참여하기',
      btnColor: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200'
    },
    {
      id: 2,
      title: '냉동만두 (비비고 2kg X 12)',
      status: '모집 중',
      statusColor: 'text-green-600 bg-green-50 border-green-200',
      progress: 48,
      progressColor: 'bg-green-500',
      current: 12,
      min: 25,
      dDay: 'D-4',
      btnText: '참여하기',
      btnColor: 'text-green-600 bg-green-50 hover:bg-green-100 border border-green-200'
    },
    {
      id: 3,
      title: '식용유 (CJ 18L X 4)',
      status: '마감 임박',
      statusColor: 'text-red-600 bg-red-50 border-red-200',
      progress: 95,
      progressColor: 'bg-red-500',
      current: 24,
      min: 25,
      dDay: '오늘',
      btnText: '마지막 1자리',
      btnColor: 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center py-3 px-6 md:px-8 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <div className="text-xl font-bold text-gray-900 tracking-tighter">SoSo</div>
          </div>
          
          <nav className="hidden md:flex gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <a href="#" className="px-4 py-1.5 text-sm font-semibold bg-white text-gray-900 rounded shadow-sm border border-gray-200">홈</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">재고 관리</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">입/출고</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">공동 발주</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">공고</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">통계</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-900 relative">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          <div className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white cursor-pointer hover:bg-gray-50">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
              김
            </div>
            <span className="text-sm font-semibold text-gray-700">김민준 <span className="font-normal text-gray-500 text-xs">강남 본점</span></span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <button 
            onClick={() => setRole('guest')}
            className="text-xs font-medium text-gray-400 hover:text-gray-700 underline ml-2"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* 1. 상단 요약 카드 (Summary Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* 총 재고 */}
          <div className="bg-white p-5 rounded-2xl border-2 border-green-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-medium text-sm">총 재고</span>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-extrabold text-gray-900">1,284</span>
              <span className="text-sm font-medium text-gray-500">개 품목</span>
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded border border-green-200">
                전주 대비 +3.2%
              </span>
            </div>
          </div>

          {/* 부족 재고 */}
          <div className="bg-white p-5 rounded-2xl border-2 border-red-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium text-sm text-red-600">부족 재고</span>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-extrabold text-gray-900">17</span>
              <span className="text-sm font-medium text-gray-500">개 품목</span>
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-200">
                즉시 발주 필요
              </span>
            </div>
          </div>

          {/* 유통기한 임박 */}
          <div className="bg-white p-5 rounded-2xl border-2 border-yellow-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-sm text-yellow-600">유통기한 임박</span>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-extrabold text-gray-900">8</span>
              <span className="text-sm font-medium text-gray-500">개 품목 <span className="text-xs font-normal">(7일 이내)</span></span>
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded border border-yellow-300">
                주의 필요
              </span>
            </div>
          </div>

          {/* 공동 발주 */}
          <div className="bg-white p-5 rounded-2xl border-2 border-blue-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium text-sm text-blue-600">공동 발주</span>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-extrabold text-gray-900">3</span>
              <span className="text-sm font-medium text-gray-500">건 진행 중</span>
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded border border-blue-200">
                참여 가능 2건
              </span>
            </div>
          </div>
        </div>

        {/* 2. 차트 영역 (Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 월별 입/출고 현황 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <h3 className="font-bold text-gray-900">월별 입/출고 현황</h3>
              </div>
              <div className="flex gap-1 border border-gray-200 rounded p-0.5 bg-gray-50">
                <button className="px-3 py-1 text-xs font-semibold bg-white border border-gray-200 rounded shadow-sm text-gray-800">6개월</button>
                <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-800">1년</button>
              </div>
            </div>
            
            {/* Bar Chart Mockup */}
            <div className="h-48 flex items-end justify-between px-4 pb-2 border-b border-gray-100 mb-4 gap-2">
              {[40, 60, 80, 100, 85, 95].map((height, i) => (
                <div key={i} className="w-full max-w-[40px] flex flex-col items-center group cursor-pointer">
                  <div className="w-full bg-gray-300 rounded-t-sm hover:bg-blue-400 transition-colors" style={{ height: `${height}%` }}></div>
                  <div className="text-xs text-gray-400 mt-2">{i + 1}월</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> 입고</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div> 출고</div>
            </div>
          </div>

          {/* 월별 매출 현황 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <h3 className="font-bold text-gray-900">월별 매출 현황</h3>
            </div>

            {/* Line/Bar Chart Mockup */}
            <div className="h-48 flex items-end justify-between px-4 pb-2 border-b border-gray-100 mb-4 gap-2 relative">
              {[80, 30, 20, 40, 60, 50, 90, 70, 30, 10].map((height, i) => (
                <div key={i} className="w-full max-w-[20px] bg-gray-100 border border-gray-300 rounded-t-sm" style={{ height: `${height}%` }}></div>
              ))}
              {/* Fake Line */}
              <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polyline fill="none" stroke="#3b82f6" strokeWidth="1" points="5,20 15,70 25,80 35,60 45,40 55,50 65,10 75,30 85,70 95,90" />
                <circle cx="5" cy="20" r="1.5" fill="#3b82f6" />
                <circle cx="25" cy="80" r="1.5" fill="#3b82f6" />
                <circle cx="45" cy="40" r="1.5" fill="#3b82f6" />
                <circle cx="65" cy="10" r="1.5" fill="#3b82f6" />
                <circle cx="85" cy="70" r="1.5" fill="#3b82f6" />
              </svg>
            </div>
            <div className="flex justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> 매출액</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> 목표</div>
            </div>
          </div>
        </div>

        {/* 3. 하단 알림 및 발주 현황 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 실시간 알림 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="font-bold text-gray-900">실시간 알림</h3>
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-900">전체 보기 &gt;</button>
            </div>

            <div className="space-y-5 flex-grow">
              {notifications.map(notif => (
                <div key={notif.id} className="flex gap-3">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.color}`}></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-500">{notif.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 공동 발주 현황 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="font-bold text-gray-900">공동 발주 현황</h3>
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-900 font-medium">발주 개설 +</button>
            </div>

            <div className="space-y-4 flex-grow">
              {groupOrders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-900 text-sm">{order.title}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5 flex items-center">
                    <div className={`${order.progressColor} h-1.5 rounded-full`} style={{ width: `${order.progress}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs text-gray-500">참여 {order.current} / 최소 {order.min}개 연</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">{order.progress}%</span>
                      <span className="text-xs font-medium text-gray-400">마감 {order.dDay}</span>
                    </div>
                  </div>
                  
                  <button className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${order.btnColor}`}>
                    {order.btnText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default BusinessMain;
