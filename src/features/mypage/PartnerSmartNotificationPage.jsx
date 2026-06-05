import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerSmartNotification } from './hooks/usePartnerSmartNotification';
import logo from "../../assets/soso로고.png";
import authStore from '../../store/authStore';

/**
 * @file PartnerSmartNotificationPage.jsx
 * @description 스마트 알림 설정 페이지
 */
const PartnerSmartNotificationPage = () => {
  const navigate = useNavigate();
  const logout = authStore((state) => state.logout);
  const { settings, isSubmitting, toggleSetting, handleSave } = usePartnerSmartNotification();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-12">
      {/* 1. 상단 탑바 */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SoSo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-black text-emerald-600 tracking-tighter">SoSo</span>
        </Link>
        <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors">
          <span>로그아웃</span>
        </button>
      </header>

      {/* 2. 네비게이션 탭 */}
      <nav className="bg-white border-b border-gray-200 flex px-6 overflow-x-auto scrollbar-hide">
        {[
          { name: '업체 정보 확인', icon: '🏢', path: '/partner-info' },
          { name: '업체 정보 수정', icon: '📝', path: '/partner-edit' },
          { name: '회원 탈퇴', icon: '👤', path: '/partner-withdrawal' },
          { name: '스마트 알림 설정', icon: '🔔', path: '/partner-notification' }
        ].map(tab => (
          <div
            key={tab.name}
            onClick={() => tab.path !== '#' && navigate(tab.path)}
            className={`px-4 py-4 text-sm font-bold flex items-center gap-2 cursor-pointer border-b-2 transition-all whitespace-nowrap ${
              tab.path === '/partner-notification' 
              ? 'text-emerald-600 border-emerald-600' 
              : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </div>
        ))}
      </nav>

      {/* 3. 페이지 헤더 */}
      <div className="max-w-[600px] w-full mx-auto mt-8 px-4">
        <h2 className="text-xl font-bold text-gray-900">스마트 알림 설정</h2>
        <p className="text-sm text-gray-500 mt-1">꼭 필요한 소식만 스마트하게 받아보세요.</p>
      </div>

      {/* 4. 메인 콘텐츠 */}
      <div className="max-w-[600px] w-full mx-auto mt-6 px-4 flex flex-col gap-4">
        
        {/* 전체 푸시 알림 마스터 스위치 */}
        <div className="bg-emerald-600 rounded-2xl p-6 shadow-md shadow-emerald-100 flex items-center justify-between transition-all active:scale-[0.99]">
          <div className="text-white">
            <h3 className="font-bold text-lg">전체 푸시 알림</h3>
            <p className="text-emerald-50 text-xs mt-1">앱에서 보내는 모든 알림을 제어합니다.</p>
          </div>
          <ToggleSwitch 
            isOn={settings.pushEnabled} 
            onToggle={() => toggleSetting('pushEnabled')} 
            theme="white"
          />
        </div>

        {/* 서비스별 세부 알림 설정 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <span className="text-emerald-600">🔔</span>
            서비스별 세부 설정
          </div>
          <div className="h-px bg-gray-100"></div>

          <div className="space-y-4">
            <NotificationRow 
              title="주문 상태 알림" 
              desc="주문 접수, 배송 시작 등 상태 변화를 알려드려요." 
              isOn={settings.orderAlert} 
              onToggle={() => toggleSetting('orderAlert')}
              disabled={!settings.pushEnabled}
            />
            <NotificationRow 
              title="채팅 및 상담 알림" 
              desc="거래처와의 채팅 메시지 및 문의 답변을 알려드려요." 
              isOn={settings.chatAlert} 
              onToggle={() => toggleSetting('chatAlert')}
              disabled={!settings.pushEnabled}
            />
            <NotificationRow 
              title="재고 부족 알림" 
              desc="즐겨찾는 상품의 재고가 부족할 때 알려드려요." 
              isOn={settings.stockAlert} 
              onToggle={() => toggleSetting('stockAlert')}
              disabled={!settings.pushEnabled}
            />
          </div>
        </div>

        {/* 혜택 및 기타 설정 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <span className="text-emerald-600">🎁</span>
            혜택 및 에티켓 설정
          </div>
          <div className="h-px bg-gray-100"></div>

          <div className="space-y-4">
            <NotificationRow 
              title="마케팅 혜택 알림" 
              desc="할인 쿠폰, 특가 상품 등 다양한 혜택을 알려드려요." 
              isOn={settings.marketingAlert} 
              onToggle={() => toggleSetting('marketingAlert')}
              disabled={!settings.pushEnabled}
            />
            <NotificationRow 
              title="야간 수신 제한" 
              desc="밤 9시 ~ 아침 8시 사이에는 알림을 받지 않습니다." 
              isOn={settings.nightAlert} 
              onToggle={() => toggleSetting('nightAlert')}
              disabled={!settings.pushEnabled}
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4 disabled:bg-gray-300"
        >
          {isSubmitting ? '저장 중...' : '💾 설정 완료'}
        </button>
      </div>
    </div>
  );
};

/**
 * 알림 항목 행 컴포넌트
 */
const NotificationRow = ({ title, desc, isOn, onToggle, disabled }) => (
  <div className={`flex items-center justify-between py-1 transition-opacity ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
    <div className="flex-1 pr-4">
      <h4 className="text-sm font-bold text-gray-800">{title}</h4>
      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
    </div>
    <ToggleSwitch isOn={isOn} onToggle={onToggle} />
  </div>
);

/**
 * 토글 스위치 컴포넌트
 */
const ToggleSwitch = ({ isOn, onToggle, theme = "emerald" }) => {
  const bgColor = theme === "white" 
    ? (isOn ? "bg-white" : "bg-emerald-700") 
    : (isOn ? "bg-emerald-500" : "bg-gray-200");
  
  const circleColor = theme === "white"
    ? (isOn ? "bg-emerald-600" : "bg-emerald-200")
    : "bg-white";

  return (
    <div 
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${bgColor}`}
    >
      <div 
        className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${circleColor} ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  );
};

export default PartnerSmartNotificationPage;
