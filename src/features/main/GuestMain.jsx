/**
 * @file GuestMain.jsx
 * @description 로그인 전 비회원 사용자에게 보여지는 서비스 소개(랜딩) 페이지입니다.
 * 사업자와 거래처 각각이 얻을 수 있는 이점을 탭(Tab)으로 나누어 소개하고, 
 * 하단에 가상의 대시보드 화면을 목업(Mockup)으로 제공하여 서비스 이해도를 높입니다.
 */
import { useState } from 'react';

function GuestMain({ setRole }) {
  // 활성화된 탭 상태 ('business' 또는 'partner')
  const [activeTab, setActiveTab] = useState('business');

  // 사업자 탭 선택 시 보여줄 주요 기능 소개 데이터
  const businessFeatures = [
    {
      title: '실시간 재고 현황',
      desc: '품목별 재고 수량을 실시간으로 확인하고 부족 재고를 즉시 파악',
      btn: '현황 보기',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: '입/출고 통계',
      desc: '일별/기간별 입출고 흐름을 차트로 분석하고 추세 예측',
      btn: '통계 보기',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: '스마트 알림',
      desc: '재고 임계치 도달, 거래처 요청 등 알림 자동화',
      btn: '알림 설정',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: '공고 관리',
      desc: '구매 공고, 판매 공고를 등록하고 거래처와 빠르게 연결',
      btn: '공고 보기',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  // 거래처 탭 선택 시 보여줄 주요 기능 소개 데이터
  const partnerFeatures = [
    {
      title: '재고 관리',
      desc: '거래처로 연결된 사업자의 재고를 함께 조회하고 발주 요청',
      btn: '재고 확인',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: '업체 홍보',
      desc: '업체 프로필 페이지로 취급 품목, 단가, 신상품을 효과적으로 홍보',
      btn: '홍보 등록',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      title: '공동 구매',
      desc: '여러 업체와 묶음 발주로 단가를 낮추고 배송비를 절감',
      btn: '공구 참여',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  // 활성화된 탭에 따라 렌더링할 데이터 배열 결정
  const currentFeatures = activeTab === 'business' ? businessFeatures : partnerFeatures;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans overflow-x-hidden">
      {/* 
        Header 영역: 
        상단 고정 네비게이션 바. 로그인/회원가입 메뉴 및 권한 테스트용 버튼 배치.
      */}
      <header className="flex justify-between items-center py-4 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <div className="text-xl font-bold text-gray-900 tracking-tighter">SoSo</div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600 mr-4">
            <a href="#" className="hover:text-blue-600">서비스 소개</a>
            <a href="#" className="hover:text-blue-600">로그인</a>
            <a href="#" className="hover:text-blue-600">회원가입</a>
          </div>
          {/* 테스트용: 로그인 없이 권한을 즉시 변경하는 버튼들 */}
          <div className="flex gap-2 border-l border-gray-300 pl-4">
            <button 
              onClick={() => setRole('business')}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
            >
              사업자 테스트
            </button>
            <button 
              onClick={() => setRole('partner')}
              className="px-3 py-1.5 text-xs font-medium text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors"
            >
              거래처 테스트
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* 
          1. Hero Section: 
          가장 크게 시선을 끄는 캐치프레이즈와 가입 유도 버튼이 위치하는 영역 
        */}
        <section className="flex flex-col items-center text-center mb-16">
          <span className="px-5 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-full mb-6 shadow-sm">
            AI 기반 스마트 재고 관리 플랫폼
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            재고 관리, 이제 더 스마트하게
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mb-8 leading-relaxed">
            실시간 재고 현황부터 입/출고 통계, 스마트 알림까지<br/>
            사업자와 거래처를 연결하는 올인원 재고 솔루션
          </p>
          <button 
            onClick={() => setRole('business')}
            className="px-8 py-3 bg-white text-gray-800 border border-gray-300 text-lg rounded-full font-semibold shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            무료로 시작하기
          </button>
        </section>

        {/* 
          2. Tab System: 
          사업자와 거래처 기능 소개를 전환하는 탭 버튼 영역 
        */}
        <section className="mb-12">
          <div className="border-b border-gray-300 flex justify-center mb-8 gap-12">
            <button
              onClick={() => setActiveTab('business')}
              className={`pb-4 text-lg font-bold px-4 transition-all duration-200 border-b-4 ${
                activeTab === 'business'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              사업자
            </button>
            <button
              onClick={() => setActiveTab('partner')}
              className={`pb-4 text-lg font-bold px-4 transition-all duration-200 border-b-4 ${
                activeTab === 'partner'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              거래처
            </button>
          </div>

          {/* 
            3. Features Cards Section: 
            현재 활성화된 탭(currentFeatures)의 데이터를 순회(map)하여 기능 소개 카드로 렌더링
          */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-500 mb-4 px-2">주요 기능</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentFeatures.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:border-gray-400 transition-colors"
                >
                  <div className="text-gray-700 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 mb-6 flex-grow text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-auto">
                    <button className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 w-full">
                      {feature.btn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center mt-8 text-gray-400 text-sm">
              <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <p>주요 기능을 누르면 스마트재고의 위엄이 아래로 내려가고</p>
              <p>'실시간 재고 현황'이 아래에 자세히 설명된다.</p>
            </div>
          </div>
        </section>

        {/* 
          4. Dashboard Mockup UI: 
          실제 서비스 가입 시 보게 될 화면을 미리보기 형식으로 제공하는 목업 테이블
        */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">현재 재고 현황</h2>
              <p className="text-xs text-gray-400">기준일 2025-07-21 · 전년도 동월대비</p>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="품목 검색" 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:border-gray-400"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {/* 요약 통계 박스 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 min-w-[120px] flex-1">
              <div className="text-xs text-gray-500 mb-2">전체 품목</div>
              <div className="text-xl font-bold text-gray-900">24<span className="text-sm font-normal">품</span></div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 min-w-[120px] flex-1">
              <div className="text-xs text-orange-600 mb-2">임박 품목</div>
              <div className="text-xl font-bold text-orange-600">3<span className="text-sm font-normal">품</span></div>
              <div className="text-[10px] text-orange-400 mt-1">안전 재고 미달</div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 min-w-[120px] flex-1">
              <div className="text-xs text-red-600 mb-2">소진 품목</div>
              <div className="text-xl font-bold text-red-600">1<span className="text-sm font-normal">품</span></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {/* 데이터 테이블 목업 */}
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-3 px-4 font-medium">품목명</th>
                  <th className="py-3 px-4 font-medium text-center">현재고</th>
                  <th className="py-3 px-4 font-medium text-center">안전재고</th>
                  <th className="py-3 px-4 font-medium text-center">재고 상태</th>
                  <th className="py-3 px-4 font-medium">재고 바</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">소고기</span>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-900 font-semibold">20개</td>
                  <td className="py-4 px-4 text-center text-gray-400">100개</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-xs font-bold text-red-500">경고</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      {/* 인라인 스타일로 임시 진행률(width) 지정 */}
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium text-gray-900">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">냉동 닭</span>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-900 font-semibold">48개</td>
                  <td className="py-4 px-4 text-center text-gray-400">30개</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-xs font-bold text-green-500">정상</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-xs">마늘</span>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-900 font-semibold">0개</td>
                  <td className="py-4 px-4 text-center text-gray-400">10개</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-xs font-bold text-red-500">소진</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-gray-800 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 
          5. Stats Section: 
          서비스의 신뢰도를 높여주는 통계 수치 표시 배너 
        */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-8">스마트재고의 위엄</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-2">[3,842명]의</div>
              <p className="text-gray-500 text-sm">소상공인과 거래처가 함께<br/>숨 쉬고 있습니다.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-2">[22% 감소]</div>
              <p className="text-gray-500 text-sm">식자재 폐기율 평균<br/>시뮬레이션 결과</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-2">18% 절감</div>
              <p className="text-gray-500 text-sm">공동구매 발주 비용 평균</p>
            </div>
          </div>
        </section>
      </main>
      
      {/* 
        Footer: 
        페이지 최하단 저작권 및 링크 영역 
      */}
      <footer className="border-t border-gray-200 bg-white py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        <div>
          © 2026 스마트 재고. 모든 권리 보유.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-600">이용약관</a>
          <a href="#" className="hover:text-gray-600">개인정보처리방침</a>
          <a href="#" className="hover:text-gray-600">고객지원</a>
        </div>
      </footer>
    </div>
  );
}

export default GuestMain;
