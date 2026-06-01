import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import logo from '../../assets/soso로고.png';
import MainFooter from '../../components/layout/MainFooter';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function GuestMain({ setRole }) {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);

  // --- 더미 데이터 영역 ---
  const stockData = {
    labels: ['소고기', '돼지고기', '닭고기', '양파', '마늘', '대파'],
    datasets: [{
      label: '현재고',
      data: [45, 12, 33, 8, 2, 15],
      backgroundColor: [
        'rgba(16,185,129,0.6)', 'rgba(239,68,68,0.6)',
        'rgba(16,185,129,0.6)', 'rgba(245,158,11,0.6)',
        'rgba(239,68,68,0.6)', 'rgba(16,185,129,0.6)'
      ],
      borderWidth: 1,
    }],
  };

  const trendData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      { label: '입고', data: [12, 19, 3, 5, 2, 3, 10], borderColor: 'rgb(16, 185, 129)', tension: 0.3 },
      { label: '출고', data: [8, 11, 5, 8, 3, 5, 12], borderColor: 'rgb(59, 130, 246)', tension: 0.3 },
    ],
  };

  const groupPurchases = [
    { id: 1, title: '양파(국산) 20kg 공동구매하실분!', author: '맛나식당', deadline: 'D-2', progress: 75, price: '18,000원' },
    { id: 2, title: '냉동 삼겹살 대량 발주 참여자 모집', author: '고기마을', deadline: 'D-1', progress: 40, price: '12,500원/kg' },
    { id: 3, title: '깐마늘 10kg 박스 단위 묶음 배송', author: '싱싱채소', deadline: 'D-5', progress: 90, price: '45,000원' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col">
      {/* grid 대신 flex와 justify-between을 사용해서 양 끝으로 배치 */}
      <header className="flex justify-between items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">

        {/* Left: Logo (왼쪽 끝에 고정) */}
        <div className="flex items-center gap-1">
          <img
            src={logo}
            alt="SoSo Logo"
            className="w-12 h-12 object-contain relative top-[5px]"
          />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">
            SoSo
          </div>
        </div>

        {/* Right: Auth Actions (오른쪽 끝에 고정) */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            로그인
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all shadow-md active:scale-95 transition-colors cursor-pointer"
          >
            회원가입
          </button>
        </div>

      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-10 overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-block px-5 py-2 mb-8 text-xs font-black text-emerald-700 bg-emerald-100 rounded-full uppercase tracking-widest">
            Smart Stock Management Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-10">
            재고 관리의 정석, <br />
            <span className="text-emerald-600">SoSo와 함께하세요.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-14 max-w-2xl mx-auto leading-relaxed">
            복잡한 재고 파악부터 스마트한 공동 발주까지,<br />
            한 화면에서 모든 관리가 가능해집니다.
          </p>
          <button
            onClick={() => setRole('business')}
            className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-2xl shadow-emerald-200 hover:-translate-y-1 transition-all text-lg"
          >
            지금 무료로 시작하기 →
          </button>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="pt-10 pb-2 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-emerald-600 mb-4 uppercase tracking-[0.3em]">Core Features</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">핵심 기능 미리보기</h3>
            <p className="text-base text-gray-400 max-w-xl mx-auto">기능 카드를 클릭하여 SoSo가 제공하는 스마트한 화면을 체험해보세요.</p>
          </div>

          {/* 주요 기능 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { id: 'stock', title: '실시간 재고 현황', icon: '📊', desc: '품목별 현재 보유량 시각화' },
              { id: 'stats', title: '입출고 데이터 분석', icon: '📈', desc: '주간/월간 흐름 완벽 분석' },
              { id: 'alarm', title: '스마트 알림 시스템', icon: '🔔', desc: '부족 및 기한 임박 즉시 알림' },
              { id: 'group', title: '공동 구매/발주', icon: '🤝', desc: '거래처 연결 및 비용 절감' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFeature(selectedFeature === f.id ? null : f.id)}
                className={`text-left p-10 rounded-[2.5rem] border-4 transition-all ${selectedFeature === f.id
                  ? 'border-emerald-500 bg-emerald-50/30 shadow-2xl shadow-emerald-100'
                  : 'border-gray-50 hover:border-emerald-100 hover:bg-gray-50'
                  }`}
              >
                <div className="text-5xl mb-6">{f.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                <div className={`mt-6 text-xs font-black uppercase tracking-widest ${selectedFeature === f.id ? 'text-emerald-600' : 'text-gray-200'}`}>
                  {selectedFeature === f.id ? 'Viewing Details' : 'Click to preview'}
                </div>
              </button>
            ))}
          </div>

          {/* 빨간색 박스: 오늘 등록 재고 / 오늘 알림 / 이번 주 입출고 현황 바 */}
          <div className="border border-gray-200 rounded-2xl p-6 mb-16 flex flex-col md:flex-row justify-around items-center gap-6 bg-white shadow-sm">
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
              <span className="text-3xl">📦</span>
              <div>
                <div className="text-xs font-bold text-gray-400">오늘 등록 재고</div>
                <div className="text-xl font-black text-gray-900">6종</div>
                <div className="text-xs text-gray-500">안전 재고 미달 품목</div>
              </div>
            </div>
            <div className="hidden md:block h-10 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
              <span className="text-3xl">🔔</span>
              <div>
                <div className="text-xs font-bold text-gray-400">오늘 알림</div>
                <div className="text-xl font-black text-gray-900">3건</div>
                <div className="text-xs text-gray-500">알림을 확인하세요</div>
              </div>
            </div>
            <div className="hidden md:block h-10 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
              <span className="text-3xl">🚚</span>
              <div>
                <div className="text-xs font-bold text-gray-400">이번 주 입출</div>
                <div className="text-xl font-black text-gray-900">12건</div>
                <div className="text-xs text-gray-500">예정된 발주 건수</div>
              </div>
            </div>
          </div>

          {/* 상세 기능 컴포넌트 출력 영역 */}
          {selectedFeature && (
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-10 md:p-16 mb-16 animate-fade-in-up">
              {selectedFeature === 'stock' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="lg:col-span-2">
                    <h5 className="text-xl font-bold mb-10 flex items-center gap-3 text-emerald-600">
                      <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                      현재고 상세 대시보드
                    </h5>
                    <div className="h-80"><Bar data={stockData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
                  </div>
                  <div className="flex flex-col justify-center bg-gray-50 p-10 rounded-3xl border border-gray-100">
                    <p className="text-sm text-gray-500 mb-6 font-black uppercase tracking-widest">⚠️ Critical Stock Status</p>
                    <div className="space-y-6">
                      {['마늘 (2kg)', '돼지고기 등심 (12kg)', '양파 (국산 8kg)'].map(item => (
                        <div key={item} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
                          <span className="text-base font-bold text-gray-700">{item}</span>
                          <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-black rounded-full uppercase">Danger</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedFeature === 'stats' && (
                <div>
                  <h5 className="text-xl font-bold mb-10 text-emerald-600 flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    주간 입/출고 트렌드 분석
                  </h5>
                  <div className="h-96">
                    <Line data={trendData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: 'top', align: 'end', labels: { font: { weight: 'bold' } } } }
                    }} />
                  </div>
                </div>
              )}

              {selectedFeature === 'alarm' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <h5 className="text-xl font-bold mb-8 text-emerald-600 text-center">실시간 스마트 알림 로그</h5>
                  {[
                    { m: '🚨 부족 재고: 소고기 등심 임계치 도달', t: '방금 전', c: 'border-red-100 bg-red-50 text-red-700' },
                    { m: '⚠️ 유통기한 임박: 양파(국산) 소진 권장', t: '15분 전', c: 'border-amber-100 bg-amber-50 text-amber-700' },
                    { m: '📩 신규 파트너 요청이 도착했습니다', t: '1시간 전', c: 'border-blue-100 bg-blue-50 text-blue-700' },
                  ].map((item, i) => (
                    <div key={i} className={`p-6 rounded-2xl border-2 font-bold flex justify-between items-center ${item.c}`}>
                      <span className="text-base">{item.m}</span>
                      <span className="text-[10px] opacity-60 uppercase tracking-widest">{item.t}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedFeature === 'group' && (
                <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <h5 className="text-xl font-bold text-emerald-600">실시간 공동구매/발주 현황</h5>
                    <span className="text-sm font-bold text-gray-400 tracking-wider">Active Boards: 3</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {groupPurchases.map(post => (
                      <div key={post.id} className="p-8 border-2 border-gray-50 rounded-[2rem] hover:border-emerald-100 hover:shadow-xl transition-all group bg-white">
                        <div className="flex justify-between items-start mb-6">
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg">{post.deadline}</span>
                          <span className="text-xs font-bold text-gray-300 group-hover:text-gray-500">{post.author}</span>
                        </div>
                        <h6 className="text-lg font-bold text-gray-900 mb-4 leading-snug">{post.title}</h6>
                        <div className="flex justify-between text-sm mb-3 font-black text-emerald-600">
                          <span>{post.price}</span>
                          <span>{post.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${post.progress}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Why SoSo? Section (Value Proposition) */}
      <section className="py-10 bg-emerald-600 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-0 relative z-10">
          <div className="text-center mb-5">
            <h2 className="text-4xl md:text-5xl font-black mb-6">왜 소소를 써야할까요?</h2>
            <p className="text-emerald-100 text-lg md:text-xl">소상공인의 성공을 돕는 가장 스마트한 방법</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {[
              { t: '획기적인 비용 절감', d: '공동 구매와 효율적인 재고 관리를 통해\n불필요한 지출을 최대 20% 줄입니다.', i: '💰' },
              { t: '업무 시간 단축', d: 'AI 자동 알림과 간편 기록 시스템으로\n매일 반복되는 업무 시간을 절반으로 단축합니다.', i: '⏱️' },
              { t: '강력한 협업 시너지', d: '거래처와의 투명한 연결과 데이터 공유로\n더욱 견고한 파트너십을 구축합니다.', i: '🚀' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 text-center hover:bg-white/20 transition-all">
                <div className="text-5xl mb-8">{item.i}</div>
                <h4 className="text-2xl font-bold mb-4">{item.t}</h4>
                <p className="text-base text-emerald-50 leading-relaxed whitespace-pre-line">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setRole('business')}
              className="px-16 py-6 bg-white text-emerald-600 text-xl rounded-2xl font-black hover:scale-105 transition-transform shadow-2xl"
            >
              지금 바로 무료로 시작하기
            </button>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-60 h-60 border-[12px] border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 border-[12px] border-white rounded-full"></div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}

export default GuestMain;
