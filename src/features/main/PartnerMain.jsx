/**
 * @file PartnerMain.jsx
 * @description '거래처(공급사/협력업체)' 권한을 가진 사용자가 로그인 후 보게 되는 메인 대시보드입니다.
 * 사업자 대시보드와 유사하지만, 주요 관심사인 발주 접수, 배송 상태, 수금/미수금 관리에
 * 초점이 맞춰져 있습니다. 테마 색상은 사업자(블루)와 구별되게 그린(초록) 계열을 사용합니다.
 */
import React from 'react';

function PartnerMain({ setRole }) {
  // 알림 리스트 (거래처 시점의 데이터)
  const notifications = [
    {
      id: 1,
      type: 'danger',
      title: '신규 발주 접수 - 강남 본점',
      desc: '냉동삼겹살 10kg x 5 총 37만원',
      time: '방금 전',
      color: 'bg-red-500' // 중요/긴급 액션 필요
    },
    {
      id: 2,
      type: 'success',
      title: '미수금 결제 완료 - 홍대 2호점',
      desc: '210만원 입금 확인, 잔액 0원',
      time: '8분 전',
      color: 'bg-green-500' // 정상/해결됨
    },
    {
      id: 3,
      type: 'warning',
      title: '재고 임박 - 참치캔 150g',
      desc: '잔여 재고 30개, 평균 소진 3일',
      time: '34분 전',
      color: 'bg-orange-500'
    },
    {
      id: 4,
      type: 'info',
      title: '납품 예정일 - 신촌 3호점',
      desc: '내일 오전 10시, 건어물류 4종',
      time: '1시간 전',
      color: 'bg-blue-500'
    },
    {
      id: 5,
      type: 'yellow',
      title: '미수금 연체 - 이태원 직영점',
      desc: 'D+15, 840만원, 독촉 알림 발송',
      time: '2시간 전',
      color: 'bg-yellow-400'
    }
  ];

  // 하단 3분할 영역 좌측에 표시될 '사업자별 매출 요약' 리스트 데이터
  const businessSales = [
    {
      id: 1,
      name: '강남 본점',
      desc: '이번 달 12건, 미수금 없음',
      amount: '1,240만원',
      trend: '↑ +8.2%',
      trendColor: 'text-green-500',
      progress: 100, // 미수금이 없으므로 100% 정상 수금 막대
      progressColor: 'bg-green-500'
    },
    {
      id: 2,
      name: '홍대 2호점',
      desc: '이번 달 9건, 입금 완료',
      amount: '980만원',
      trend: '↑ +3.1%',
      trendColor: 'text-green-500',
      progress: 100,
      progressColor: 'bg-green-500'
    },
    {
      id: 3,
      name: '신촌 3호점',
      desc: '이번 달 7건, 미수금 340만원',
      amount: '740만원',
      trend: '↓ -2.4%',
      trendColor: 'text-red-500',
      progress: 65, // 수금률 65% 막대 (일부 미수금 존재)
      progressColor: 'bg-orange-400'
    },
    {
      id: 4,
      name: '이태원 직영점',
      desc: '이번 달 5건, 미수금 840만원',
      amount: '620만원',
      trend: '연체 D+15',
      trendColor: 'text-red-600 font-bold',
      progress: 30, // 수금률 저조, 강한 경고 색상
      progressColor: 'bg-red-500'
    },
    {
      id: 5,
      name: '마포 가맹점',
      desc: '이번 달 4건, 미수금 없음',
      amount: '410만원',
      trend: '↑ +1.8%',
      trendColor: 'text-green-500',
      progress: 100,
      progressColor: 'bg-green-500'
    }
  ];

  // 거래처가 참여/납품하는 '공동 발주 현황' 데이터
  const groupOrders = [
    {
      id: 1,
      title: '참치캔 (동원 150g X 48)',
      status: '발주 완료',
      statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
      progress: 100,
      progressColor: 'bg-blue-500',
      current: 25,
      min: 25,
      dDay: '배송 준비 중',
      btnText: '배송 현황 보기',
      btnColor: 'text-blue-600 bg-white hover:bg-blue-50 border border-blue-200'
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
      dDay: '마감 D-4',
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
      dDay: '마감 오늘',
      btnText: '수량 수정 / 취소',
      btnColor: 'text-red-600 bg-white hover:bg-red-50 border border-red-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* 
        Header 영역:
        거래처에 맞는 탭 구성(발주, 수금 등) 및 그린 컬러 톤 적용.
      */}
      <header className="flex justify-between items-center py-3 px-6 md:px-8 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <div className="text-xl font-bold text-gray-900 tracking-tighter">SoSo</div>
          </div>
          
          <nav className="hidden md:flex gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50">
            <a href="#" className="px-4 py-1.5 text-sm font-semibold bg-white text-gray-900 rounded shadow-sm border border-gray-200">홈</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">발주 관리</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">수금 관리</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">공동 발주</a>
            <a href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded">업체 홍보</a>
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
            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
              백
            </div>
            <span className="text-sm font-semibold text-gray-700">백서연 <span className="font-normal text-gray-500 text-xs">한빛 식품 유통</span></span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        
        {/* 
          1. 상단 요약 카드 (3개):
          신규 발주, 배송 현황, 입금 대기 금액을 강조하여 표시 
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 신규 발주 */}
          <div className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium text-sm">신규 발주 (오늘)</span>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black text-gray-900">12</span>
              <span className="text-sm font-medium text-gray-500">건 접수</span>
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-200">
                ↑ 어제 대비 +3건
              </span>
            </div>
          </div>

          {/* 배송 중 */}
          <div className="bg-white p-5 rounded-2xl border-2 border-red-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-sm">배송 중</span>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black text-gray-900">7</span>
              <span className="text-sm font-medium text-gray-500">건 진행 중</span>
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-200">
                정상 배송
              </span>
            </div>
          </div>

          {/* 입금 대기 (도형 백그라운드를 이용해 강조 디자인 적용) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-yellow-300 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-sm">입금 대기</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-gray-900">1,200</span>
                <span className="text-sm font-medium text-gray-500">만원</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">미수금 총액</div>
              <div>
                <span className="inline-block px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded border border-yellow-300">
                  이번 달 기준
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 
          2. 대형 차트 영역 (월별 매출/수금 현황):
          사업자 대시보드와 달리 가로로 긴 형태의 차트를 단독으로 배치함. 
        */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <h3 className="font-bold text-gray-900">월별 매출/수금 현황</h3>
            </div>
            <div className="flex gap-1 border border-gray-200 rounded p-0.5 bg-gray-50">
              <button className="px-3 py-1 text-xs font-semibold bg-white border border-gray-200 rounded shadow-sm text-gray-800">6개월</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-800">1년</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-800">상세</button>
            </div>
          </div>
          
          {/* Chart Mockup (이중 막대 + 꺾은선 혼합 그래프) */}
          <div className="h-64 flex items-end justify-between px-4 pb-2 border-b border-gray-100 mb-6 gap-2 relative mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((month, i) => {
              // 임시 데이터로 막대 높이를 다르게 설정
              const blueH = [40, 55, 60, 50, 70, 85, 65, 80][i]; // 매출액 막대
              const greenH = [35, 50, 50, 45, 60, 65, 55, 75][i]; // 수금액 막대
              return (
                <div key={i} className="w-full flex justify-center items-end gap-1 relative z-10 h-full">
                  <div className="w-4 sm:w-8 bg-green-200 border border-green-400 rounded-t-sm" style={{ height: `${greenH}%` }}></div>
                  <div className="w-4 sm:w-8 bg-blue-300 border border-blue-400 rounded-t-sm" style={{ height: `${blueH}%` }}></div>
                  <div className="absolute -bottom-6 text-xs text-gray-400 w-full text-center">{month}월</div>
                </div>
              );
            })}
            
            {/* 꺾은선 그래프: 빨간 선 (미수금 추이) */}
            <svg className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline fill="none" stroke="#ef4444" strokeWidth="1.5" points="6,65 18,55 31,60 43,55 56,65 68,50 81,60 93,50" />
              {[6, 18, 31, 43, 56, 68, 81, 93].map((cx, i) => {
                const cy = [65, 55, 60, 55, 65, 50, 60, 50][i];
                return <circle key={i} cx={cx} cy={cy} r="1.5" fill="#ef4444" />;
              })}
            </svg>
          </div>
          
          <div className="flex flex-wrap justify-start sm:justify-start gap-6 text-xs text-gray-500 mb-8 px-4">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-300 border border-blue-400"></div> 매출액</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-200 border border-green-400"></div> 수금액</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> 미수금</div>
          </div>

          {/* 차트 하단: 4개의 요약 수치 데이터 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100 divide-x divide-gray-100 text-center">
            <div>
              <div className="text-xs text-gray-500 mb-1">이번 달 매출</div>
              <div className="text-xl font-bold text-gray-900 mb-1">8,340만</div>
              <div className="text-xs text-green-500 font-semibold">↑ +12.4%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">이번 달 수금</div>
              <div className="text-xl font-bold text-gray-900 mb-1">3,520만</div>
              <div className="text-xs text-red-500 font-semibold">↓ -3.1%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">누적 미수금</div>
              <div className="text-xl font-bold text-gray-900 mb-1">4,820만</div>
              <div className="text-xs text-orange-500 font-semibold">주의 필요</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">수금률</div>
              <div className="text-xl font-bold text-gray-900 mb-1">73%</div>
              <div className="text-xs text-red-500 font-semibold">↓ 전월 81%</div>
            </div>
          </div>
        </div>

        {/* 
          3. 하단 3분할 영역: 
          사업자별 매출 내역, 공동 발주 리스트, 실시간 알림을 각각 1/3 너비의 카드로 배치
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 사업자별 매출 요약 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm lg:col-span-1 flex flex-col h-full">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="font-bold text-gray-900">사업자별 매출 요약</h3>
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-900">전체 보기 &gt;</button>
            </div>

            <div className="space-y-5 flex-grow">
              {businessSales.map(biz => (
                <div key={biz.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        {/* 임시 로고 아이콘 영역 */}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">{biz.name}</div>
                        <div className="text-xs text-gray-500">{biz.desc}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-gray-900">{biz.amount}</div>
                      <div className={`text-[10px] ${biz.trendColor}`}>{biz.trend}</div>
                    </div>
                  </div>
                  {/* 개별 수금률 진행 바 */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 ml-11" style={{ width: 'calc(100% - 44px)' }}>
                    <div className={`${biz.progressColor} h-1.5 rounded-full`} style={{ width: `${biz.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 공동 발주 현황 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm lg:col-span-1 flex flex-col h-full">
            <div className="flex justify-between items-center mb-5">
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
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1 flex items-center">
                    <div className={`${order.progressColor} h-1.5 rounded-full`} style={{ width: `${order.progress}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[10px] text-gray-500">{order.current} / {order.min} 업체 참여</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-gray-700">{order.progress}%</span>
                      <span className="text-[10px] font-medium text-gray-400">{order.dDay}</span>
                    </div>
                  </div>
                  
                  <button className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${order.btnColor}`}>
                    {order.btnText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 실시간 알림 (거래처용) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm lg:col-span-1 flex flex-col h-full">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="font-bold text-gray-900">실시간 알림</h3>
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-900">전체 보기 &gt;</button>
            </div>

            <div className="space-y-4 flex-grow">
              {notifications.map(notif => (
                <div key={notif.id} className="flex gap-2.5">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.color}`}></div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-1">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">{notif.desc}</p>
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
