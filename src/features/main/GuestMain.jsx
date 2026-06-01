/**
 * @file GuestMain.jsx
 * @description 비회원 사용자용 메인(랜딩) 페이지입니다.
 * 주요 기능 클릭 시 서비스 사용 흐름이 노출되며, 재고 현황은 Chart.js를 사용한 더미 데이터로 구성됩니다.
 */
import { useState } from 'react';
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
import { Bar, Pie, Line } from 'react-chartjs-2';
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
  const [showServiceFlow, setShowServiceFlow] = useState(false);

  // --- 더미 데이터: 재고 현황 (Bar Chart) ---
  const stockData = {
    labels: ['소고기', '돼지고기', '닭고기', '양파', '마늘', '대파'],
    datasets: [
      {
        label: '현재 재고량 (kg)',
        data: [45, 12, 33, 8, 2, 15],
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)', // emerald-500
          'rgba(239, 68, 68, 0.6)',  // red-500 (low stock)
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)', // amber-500 (warning)
          'rgba(239, 68, 68, 0.6)',  // red-500 (low stock)
          'rgba(16, 185, 129, 0.6)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(16, 185, 129)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // --- 더미 데이터: 입출고 추세 (Line Chart) ---
  const trendData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        label: '입고',
        data: [12, 19, 3, 5, 2, 3, 10],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
      {
        label: '출고',
        data: [8, 11, 5, 8, 3, 5, 12],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // --- 더미 데이터: 카테고리 비중 (Pie Chart) ---
  const categoryData = {
    labels: ['육류', '채소', '가공식품', '기타'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(107, 114, 128, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 md:px-12 bg-white sticky top-0 z-50 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="SoSo Logo" className="w-10 h-10 object-contain" />
          <div className="text-3xl font-black text-[#1d9e75] tracking-tighter">SoSo</div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
          <button onClick={() => setShowServiceFlow(!showServiceFlow)} className="hover:text-emerald-600 transition-colors">주요기능</button>
          <a href="#" className="hover:text-emerald-600 transition-colors">서비스 소개</a>
          <a href="#" className="hover:text-emerald-600 transition-colors">고객지원</a>
        </nav>
        <div className="flex gap-3">
          <button onClick={() => setRole('business')} className="px-4 py-2 text-xs font-bold text-emerald-600 border border-emerald-100 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-all">사업자 체험</button>
          <button onClick={() => setRole('partner')} className="px-4 py-2 text-xs font-bold text-blue-600 border border-blue-100 bg-blue-50 rounded-full hover:bg-blue-100 transition-all">거래처 체험</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black text-emerald-700 bg-emerald-100 rounded-full">
            ✦ AI 기반 스마트 재고 관리 파트너
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
            복잡한 재고 관리를<br />
            <span className="text-emerald-600">더 쉽고 빠르게.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            실시간 재고 추적, 자동 발주 예측, 그리고 거래처와의 협업까지.<br />
            SoSo와 함께라면 비즈니스가 더 효율적으로 변합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setShowServiceFlow(true)}
              className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
            >
              주요기능 살펴보기
            </button>
            <button 
              onClick={() => setRole('business')}
              className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              무료로 시작하기
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Service Flow Section (Shown when clicked) */}
      {showServiceFlow && (
        <section className="py-20 bg-gray-50 animate-fade-in-up">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-gray-900 mb-4">서비스 사용 흐름</h2>
              <p className="text-gray-500">SoSo가 제공하는 직관적인 재고 관리 프로세스를 확인하세요.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: '재고 등록', desc: '바코드 또는 직접 입력을 통해 간편하게 품목을 등록합니다.', icon: '📥' },
                { step: '02', title: '실시간 모니터링', desc: '입출고 내역이 즉시 반영되어 언제 어디서든 확인 가능합니다.', icon: '📱' },
                { step: '03', title: '자동 알림', desc: '설정된 임계치 미달 시 AI가 재발주 시점을 알려줍니다.', icon: '🔔' },
                { step: '04', title: '거래처 협업', desc: '클릭 한 번으로 발주 요청을 보내고 상태를 추적합니다.', icon: '🤝' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                  <div className="text-4xl mb-6">{item.icon}</div>
                  <div className="text-xs font-black text-emerald-500 mb-2 uppercase tracking-widest">Step {item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button 
                onClick={() => setShowServiceFlow(false)}
                className="text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors"
              >
                닫기 ✕
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Inventory Status (Chart Section) */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">실시간 재고 통계</h2>
              <p className="text-gray-500">현재 창고 상황을 한눈에 파악할 수 있는 시각화 데이터를 제공합니다.</p>
            </div>
            <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
              마지막 업데이트: 방금 전
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Bar Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                주요 품목 재고 현황
              </h3>
              <div className="h-64">
                <Bar 
                  data={stockData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                  }} 
                />
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                카테고리별 비중
              </h3>
              <div className="h-64 flex items-center justify-center">
                <Pie 
                  data={categoryData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
                  }} 
                />
              </div>
            </div>

            {/* Trend Line Chart */}
            <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                주간 입/출고 추세
              </h3>
              <div className="h-64">
                <Line 
                  data={trendData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', align: 'end' } },
                    scales: { y: { beginAtZero: true } }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-600 text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-8">지금 바로 스마트한 관리의 차이를 경험하세요.</h2>
          <p className="text-emerald-100 mb-12 text-lg">별도의 설치 없이 브라우저에서 즉시 시작할 수 있습니다.</p>
          <button 
            onClick={() => setRole('business')}
            className="px-12 py-5 bg-white text-emerald-600 text-xl rounded-2xl font-black shadow-xl hover:scale-105 transition-transform"
          >
            시작하기 무료로 시작하기
          </button>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-8 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 border-8 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white rotate-45"></div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}

export default GuestMain;
