/**
 * @file GuestMain.jsx
 * @description 비회원 사용자용 랜딩 페이지입니다.
 * 에메랄드 테마를 적용하였으며, 주요 기능의 버튼을 클릭하면 해당 기능의 실제 화면 목업이 
 * 중앙 영역에 동적으로 나타나거나 사라지는 토글 기능을 포함합니다.
 */
import { useState } from 'react';
import logo from '../../assets/soso로고.png';

function GuestMain({ setRole }) {
  // 활성화된 탭 상태 ('business' 또는 'partner')
  const [activeTab, setActiveTab] = useState('business');

  // 현재 어떤 기능의 프리뷰(목업)를 보여줄지 관리하는 상태
  const [selectedFeature, setSelectedFeature] = useState(null);

  // 프리뷰 영역 전체 노출 여부
  const [showPreview, setShowPreview] = useState(false);

  // --- 기능별 데이터 정의 ---
  const businessFeatures = [
    { id: 'stock', title: '실시간 재고 현황', desc: '품목별 재고 수량을 실시간으로 확인하고 부족 재고를 즉시 파악', btn: '현황 보기', icon: '📦' },
    { id: 'stats', title: '입/출고 통계', desc: '일별/기간별 입출고 흐름을 차트로 분석하고 추세 예측', btn: '통계 보기', icon: '📊' },
    { id: 'alarm', title: '스마트 알림', desc: '재고 임계치 도달, 거래처 요청 등 알림 자동화', btn: '알림 설정', icon: '🔔' },
    { id: 'notice', title: '공고 관리', desc: '구매 공고, 판매 공고를 등록하고 거래처와 빠르게 연결', btn: '공고 보기', icon: '📢' }
  ];

  const partnerFeatures = [
    { id: 'stock', title: '재고 관리', desc: '거래처로 연결된 사업자의 재고를 함께 조회하고 발주 요청', btn: '재고 확인', icon: '🏢' },
    { id: 'promo', title: '업체 홍보', desc: '업체 프로필 페이지로 취급 품목, 단가, 신상품을 효과적으로 홍보', btn: '홍보 등록', icon: '✨' },
    { id: 'group', title: '공동 구매', desc: '여러 업체와 묶음 발주로 단가를 낮추고 배송비를 절감', btn: '공구 참여', icon: '🤝' }
  ];

  const currentFeatures = activeTab === 'business' ? businessFeatures : partnerFeatures;

  // --- 기능 버튼 클릭 핸들러 (토글 로직) ---
  const handleFeatureClick = (id) => {
    if (selectedFeature === id && showPreview) {
      // 이미 열려있는 기능을 다시 누르면 닫음
      setShowPreview(false);
      setSelectedFeature(null);
    } else {
      // 새로운 기능을 누르거나 닫혀있을 때 누르면 해당 기능으로 교체 후 열음
      setSelectedFeature(id);
      setShowPreview(true);
    }
  };

  // --- [목업 컴포넌트들] ---

  // 1. 실시간 재고 현황 목업
  const StockMockup = () => (
    <div className="animate-fade-in">
      <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
        <h3 className="font-bold">현재 재고 현황</h3>
        <span className="text-xs opacity-80">기준일 2025-07-21</span>
      </div>
      <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-100 text-center">
        <div><div className="text-[10px] text-gray-400 mb-1">전체 품목</div><div className="text-xl font-bold">24품</div></div>
        <div><div className="text-[10px] text-orange-400 mb-1">임박 품목</div><div className="text-xl font-bold text-orange-500">3품</div></div>
        <div><div className="text-[10px] text-red-400 mb-1">소진 품목</div><div className="text-xl font-bold text-red-500">1품</div></div>
      </div>
      <div className="p-6 space-y-4">
        {['소고기', '냉동 닭', '마늘'].map((name, i) => (
          <div key={name} className="flex justify-between items-center">
            <span className="text-sm font-bold w-16">{name}</span>
            <span className="text-xs text-gray-500">{i === 2 ? 0 : 20 + i * 28}개</span>
            <div className="flex-grow mx-4 bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className={`h-full ${i === 1 ? 'bg-emerald-500' : 'bg-red-400'}`} style={{ width: i === 2 ? '0%' : (i === 1 ? '100%' : '20%') }}></div>
            </div>
            <span className={`text-[10px] font-bold ${i === 1 ? 'text-emerald-500' : 'text-red-500'}`}>{i === 1 ? '정상' : (i === 2 ? '소진' : '경고')}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. 입출고 통계 목업
  const StatsMockup = () => (
    <div className="animate-fade-in p-8 text-center">
      <h3 className="font-bold text-gray-800 mb-8 text-left">월별 입/출고 현황</h3>
      <div className="h-48 flex items-end justify-between gap-2 px-4 border-b border-gray-100 mb-4">
        {[40, 70, 55, 90, 60, 85].map((h, i) => (
          <div key={i} className="flex gap-1 items-end h-full w-full max-w-[25px]">
            <div className="bg-emerald-200 w-1/2 rounded-t-sm" style={{ height: `${h - 15}%` }}></div>
            <div className="bg-emerald-500 w-1/2 rounded-t-sm" style={{ height: `${h}%` }}></div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 px-2 uppercase font-bold tracking-tighter">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );

  // 3. 스마트 알림 목업
  const AlarmMockup = () => (
    <div className="animate-fade-in p-8">
      <h3 className="font-bold text-gray-800 mb-6">실시간 알림</h3>
      <div className="space-y-5">
        {[
          { t: '부족 재고 알림', d: '냉동삼겹살 1kg의 재고가 부족합니다.', c: 'bg-red-500' },
          { t: '유통기한 경고', d: '두부(면두부)의 유통기한이 3일 남았습니다.', c: 'bg-orange-500' },
          { t: '발주 접수 알림', d: '강남 본점으로부터 신규 발주가 접수되었습니다.', c: 'bg-emerald-500' }
        ].map((n, i) => (
          <div key={i} className="flex gap-4 items-start border-b border-gray-50 pb-4 last:border-0">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.c}`}></div>
            <div>
              <div className="text-xs font-bold text-gray-900">{n.t}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{n.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">

      {/* --- Header & Hero Section (Emerald Soft Background) --- */}
      <div className="bg-[#F2FBFA]">
        <header className="flex justify-between items-center py-5 px-6 md:px-12">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SoSo Logo" className="w-7 h-7 object-contain" />
            <div className="text-2xl font-black text-emerald-600 tracking-tighter">SoSo</div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden md:flex gap-8 text-sm font-bold text-gray-500 mr-4">
              <a href="#" className="hover:text-emerald-600 transition-colors">서비스 소개</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">로그인</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">회원가입</a>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRole('business')} className="px-4 py-2 text-xs font-bold text-gray-400 border border-gray-200 bg-white rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm">사업자 테스트</button>
              <button onClick={() => setRole('partner')} className="px-4 py-2 text-xs font-bold text-gray-400 border border-gray-200 bg-white rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm">거래처 테스트</button>
            </div>
          </div>
        </header>

        <section className="flex flex-col items-center text-center pt-20 pb-32 px-4">
          <span className="px-5 py-2 text-xs font-bold text-emerald-700 bg-emerald-100/50 rounded-full mb-10 shadow-sm">✦ AI 기반 스마트 재고 관리 플랫폼</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-8 leading-[1.1]">
            재고 관리,<br />이제 더 <span className="text-emerald-600 relative inline-block underline underline-offset-8 decoration-emerald-100">스마트</span>하게
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mb-12 leading-relaxed">
            실시간 재고 현황부터 입/출고 통계, 스마트 알림까지<br />사업자와 거래처를 연결하는 올인원 재고 솔루션
          </p>
          <button
            onClick={() => setRole('business')}
            className="px-10 py-5 bg-white text-emerald-600 text-lg rounded-full font-black shadow-xl shadow-emerald-100 hover:scale-105 transition-transform border border-emerald-50"
          >
            무료로 시작하기 →
          </button>
        </section>
      </div>

      {/* --- Main Contents Area --- */}
      <main className="max-w-[90rem] mx-auto px-4 pt-14 pb-0">

        {/* Tab Selection */}
        <div className="flex justify-center gap-10 mb-10">
          {['business', 'partner'].map(type => (
            <button
              key={type}
              onClick={() => { setActiveTab(type); setShowPreview(false); }}
              className={`px-10 py-4 rounded-full text-lg font-black transition-all border-2 ${activeTab === type
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                : 'border-gray-100 text-gray-300 hover:text-gray-500'
                }`}
            >
              {type === 'business' ? '사업자' : '거래처'}
            </button>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="mb-15">
          <h2 className="text-xs font-black text-emerald-600 mb-8 uppercase tracking-[0.2em] px-2 text-center">Main Features</h2>

          {/* 🛠️ 모바일에선 1열, 태블릿에선 2열 grid를 쓰다가 lg 화면부턴 flex 중앙정렬로 스위칭! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-8 w-full max-w-[1280px] mx-auto">
            {currentFeatures.map((f) => (
              <div
                key={f.id}
                onClick={() => handleFeatureClick(f.id)}
                // 🛠️ 각 카드가 일정한 크기(예: 280px)를 유지하도록 lg:w-[280px] sm:w-full 설정 추가
                className={`bg-white border-2 rounded-[2.5rem] p-10 shadow-sm transition-all cursor-pointer flex flex-col items-center text-center group w-full lg:w-[280px] ${selectedFeature === f.id && showPreview
                    ? 'border-emerald-500 shadow-emerald-100 shadow-2xl'
                    : 'border-gray-50 hover:border-emerald-100 hover:shadow-lg'
                  }`}
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-10 flex-grow">{f.desc}</p>
                <div className={`text-sm font-black flex items-center gap-2 transition-colors ${selectedFeature === f.id && showPreview ? 'text-emerald-600' : 'text-gray-200'}`}>
                  {f.btn} {selectedFeature === f.id && showPreview ? '↑' : '→'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Dynamic Preview Section (Toggled by Card Clicks) --- */}
        {showPreview && (
          <section className="mb-32 animate-fade-in-up flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border-4 border-emerald-50 shadow-[0_20px_50px_rgba(16,185,129,0.1)] overflow-hidden">
              {selectedFeature === 'stock' && <StockMockup />}
              {selectedFeature === 'stats' && <StatsMockup />}
              {selectedFeature === 'alarm' && <AlarmMockup />}
              {selectedFeature === 'notice' || selectedFeature === 'group' ? (
                <div className="p-10 text-center">
                  <h3 className="font-bold text-gray-800 mb-6 text-left">공고/공구 관리</h3>
                  <div className="bg-emerald-50 rounded-2xl p-6 text-emerald-700 text-sm font-bold border border-emerald-100">
                    준비 중인 목업 화면입니다. <br />실제 서비스에서 만나보실 수 있습니다.
                  </div>
                </div>
              ) : null}
              {selectedFeature === 'promo' && <div className="p-20 text-center text-gray-300 font-bold">업체 홍보 페이지 목업 준비 중...</div>}
            </div>
            <p className="mt-8 text-emerald-600/40 text-xs font-bold animate-pulse">CLiCK CARD TO CLOSE PREViEW</p>
          </section>
        )}

      </main>

      {/* --- Stats Banner (Emerald Soft Background) --- */}
      <div className="bg-[#F2FBFA] py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-16">스마트재고의 위엄</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { v: '[3,842명]의', d: '소상공인과 거래처가 함께\n쓰고 있습니다.' },
              { v: '[22%] 감소', d: '식자재 폐기율 평균\n시뮬레이션 결과' },
              { v: '18% 절감', d: '공동구매 발주 비용\n평균' }
            ].map((stat, i) => (
              // 🛠️ 패딩을 좌우만 px-6으로 줄여서 내부 공간 확보
              <div key={i} className="bg-white py-12 px-6 rounded-[2rem] text-center shadow-sm hover:shadow-xl transition-all border border-emerald-50">
                {/* 🛠️ text-3xl~4xl 정도로 크기 최적화 및 줄바꿈 방지(whitespace-nowrap) */}
                <div className="text-3xl xl:text-4xl font-black text-emerald-600 mb-6 whitespace-nowrap">{stat.v}</div>
                {/* 🛠️ break-keep을 추가해 단어 단위로 예쁘게 떨어지도록 설정 */}
                <p className="text-gray-500 text-sm font-bold leading-relaxed whitespace-pre-line break-keep">{stat.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <footer className="bg-white py-12 border-t border-gray-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-black text-gray-200">SoSo.</div>
          <div className="flex gap-8 text-xs font-bold text-gray-300">
            <a href="#" className="hover:text-emerald-500 transition-colors">이용약관</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">고객지원</a>
          </div>
          <div className="text-[10px] text-gray-200">© 2026 SMART STOCK ALL RiGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
}

export default GuestMain;
