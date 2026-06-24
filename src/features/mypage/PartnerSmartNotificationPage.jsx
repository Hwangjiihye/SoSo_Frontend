/**
 * @file PartnerSmartNotificationPage.jsx
 * @description 거래처 스마트 알림 설정 페이지 (사업자 마이페이지 UI 레이아웃 통일 적용)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerSmartNotification } from './hooks/usePartnerSmartNotification';
import { usePartnerInfo } from './hooks/usePartnerInfo';
import authStore from '../../store/authStore';

// 토글 스위치 컴포넌트
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

// 알림 항목 행 컴포넌트
const NotificationRow = ({ title, desc, isOn, onToggle, disabled }) => (
  <div className={`flex items-center justify-between py-1 transition-opacity ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
    <div className="flex-1 pr-4">
      <h4 className="text-sm font-bold text-gray-800">{title}</h4>
      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
    </div>
    <ToggleSwitch isOn={isOn} onToggle={onToggle} />
  </div>
);

// 알림 설정 탭 콘텐츠
const NotificationTab = ({ settings, isSubmitting, toggleSetting, handleSave }) => {
  return (
    <div className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-2">스마트 알림 설정</h2>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">꼭 필요한 소식만 스마트하게 받아보세요.</p>
      
      <div className="space-y-6">
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
            <span className="text-emerald-600">🔔</span>
            서비스별 세부 설정
          </div>
          <div className="space-y-4">
            <NotificationRow 
              title="주문 상태 알림" 
              desc="주문 접수, 배송 시작 등 상태 변화를 알려드려요." 
              isOn={settings.orderAlert} 
              onToggle={() => toggleSetting('orderAlert')}
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
            <span className="text-emerald-600">🎁</span>
            혜택 및 에티켓 설정
          </div>
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
        <div className="pt-4">
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:bg-gray-300"
          >
            {isSubmitting ? '저장 중...' : '💾 설정 완료'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PartnerSmartNotificationPage = () => {
  const { bizname } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('스마트 알림 설정');

  const partnerInfo = usePartnerInfo();
  const ceoName = partnerInfo.profile?.repName || partnerInfo.profile?.ceoName || '';

  const { settings, isSubmitting, toggleSetting, handleSave } = usePartnerSmartNotification();

  const menuGroups = [
    { title: '계정', items: ['업체 정보 확인', '업체 정보 수정', '회원 탈퇴'] },
    { title: '설정', items: ['스마트 알림 설정'] }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-10 flex gap-8">
        {/* 사이드바 */}
        <aside className="w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">{bizname || '거래처 업체'}</h2>
            <p className="text-xs text-gray-500 mt-1">거래처 회원 {ceoName && `| ${ceoName} 대표`}</p>
          </div>
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-gray-400 mb-2 px-2">{group.title}</h4>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        if (item === '업체 정보 확인') navigate("/partner-info");
                        else if (item === '업체 정보 수정') navigate("/partner-edit");
                        else if (item === '회원 탈퇴') navigate("/partner-withdrawal");
                        else if (item === '스마트 알림 설정') navigate("/partner-notification");
                        else setActiveTab(item);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                        activeTab === item ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
        
        {/* 콘텐츠 영역 */}
        <section className="flex-grow">
          {activeTab === '스마트 알림 설정' ? (
            <NotificationTab 
              settings={settings} isSubmitting={isSubmitting} toggleSetting={toggleSetting} handleSave={handleSave} 
            />
          ) : (
            <div className="bg-white border border-gray-100 rounded-lg p-12 text-center text-gray-400">
              <h2 className="font-bold text-lg mb-2">{activeTab}</h2>
              <p>콘텐츠 준비 중입니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PartnerSmartNotificationPage;
