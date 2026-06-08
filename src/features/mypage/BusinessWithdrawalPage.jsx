/**
 * @file BusinessWithdrawalPage.jsx
 * @description 사업자 회원 탈퇴 페이지
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainFooter from '../../components/layout/MainFooter';
import logo from "../../assets/soso로고.png";
import authStore from "../../store/authStore";
import { useBusinessWithdrawal } from './hooks/useBusinessWithdrawal';

const WithdrawalSection = () => {
  const navigate = useNavigate();
  const { 
    reason, 
    setReason, 
    customReason, 
    setCustomReason, 
    isChecked, 
    setIsChecked, 
    isSubmitting, 
    reasons, 
    handleWithdrawal 
  } = useBusinessWithdrawal();

  return (
    <div className="bg-white border border-red-100 rounded-lg p-8 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-900">회원 탈퇴</h2>
        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">주의 사항 확인 필수</span>
      </div>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">SoSo 서비스를 탈퇴하시기 전 아래 내용을 확인해 주세요.</p>
      
      <div className="space-y-8">
        {/* 유의사항 섹션 */}
        <div className="bg-red-50/30 rounded-2xl p-6 border border-red-100">
          <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4 text-base">
            <span className="w-1.5 h-6 bg-red-500 rounded-full inline-block"></span>
            탈퇴 시 유의사항
          </h3>
          <ul className="text-sm text-gray-600 space-y-3 list-disc pl-5">
            <li>탈퇴 시 계정 정보 및 SoSo에서 제공하는 모든 서비스 이용 기록이 즉시 삭제됩니다.</li>
            <li>진행 중인 발주, 수금 건이 있는 경우 탈퇴가 불가능할 수 있으니 확인 후 진행해 주세요.</li>
            <li>탈퇴한 계정의 데이터(매장 정보, 통계 데이터 등)는 복구가 불가능합니다.</li>
            <li>관련 법령에 따라 일정 기간 보관이 필요한 정보는 별도로 보관될 수 있습니다.</li>
          </ul>
        </div>

        {/* 탈퇴 사유 섹션 */}
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6 text-base">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
            탈퇴 사유 선택
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reasons.map((r) => (
              <label 
                key={r} 
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  reason === r 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                  : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <input 
                  type="radio" 
                  name="reason" 
                  value={r} 
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <span className="text-sm font-medium">{r}</span>
              </label>
            ))}
          </div>

          {reason === '기타 (직접 입력)' && (
            <textarea 
              placeholder="탈퇴하시는 사유를 상세히 적어주시면 서비스 개선에 큰 도움이 됩니다." 
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 min-h-[120px] transition-all"
            />
          )}
        </div>

        {/* 최종 동의 섹션 */}
        <div className="pt-6 border-t border-gray-50">
          <label className="flex items-center gap-3 cursor-pointer group mb-8">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-6 h-6 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded-lg cursor-pointer"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
              안내사항을 모두 확인하였으며, 이에 동의합니다.
            </span>
          </label>

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => navigate("/business-mypage")}
              className="px-8 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button 
              type="button"
              onClick={handleWithdrawal}
              disabled={isSubmitting || !isChecked || !reason}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${
                isChecked && reason && !isSubmitting
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-100' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting ? '탈퇴 처리 중...' : '회원 탈퇴하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function BusinessWithdrawalPage() {
  const { logout, user_type, user_nickname, bizname } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('회원 탈퇴');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const menuGroups = [
    { title: '계정', items: ['개인정보 확인', '개인정보 수정', '회원 탈퇴'] },
    { title: '설정', items: ['스마트 알림 설정'] },
    { title: '운영', items: ['다중 매장 관리', '직원 근태 관리'] }
  ];

  const handleProfileClick = () => {
    if (user_type === 'BUSINESS') {
      navigate('/business-mypage');
      setIsProfileOpen(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="SoSo Logo" className="w-12 h-12 object-contain relative top-[5px]" />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
        </div>
        <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto">
          <a href="/" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">홈</a>
          {['발주 관리', '수금 관리', '공동 발주', '업체 홍보', '통계'].map(m => (
            <a key={m} href="#" className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">{m}</a>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-4">
          <button className="text-gray-400 hover:text-emerald-600 relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          <div className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white hover:bg-emerald-50 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                {user_nickname ? user_nickname.substring(0, 1) : 'G'}
              </div>
              <span className="text-sm font-semibold whitespace-nowrap text-gray-700">
                {user_nickname || '회원님'} 
                <span className="text-xs text-gray-400 font-normal ml-1">
                  {bizname || '상호명 미등록'}
                </span>
              </span>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-[60] animate-fade-in-up">
                <div className="p-3 border-b border-gray-50">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">나의 매장</span>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl mb-1 flex justify-between items-center">
                    {bizname || '강남 본점'}
                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">Main</span>
                  </button>
                </div>
                <div className="border-t border-gray-50 pt-2 mt-2">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full text-center py-3 text-sm font-black text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                  >
                    마이페이지
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="text-xs text-gray-400 hover:underline">/로그아웃</button>
        </div>
      </header>
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-10 flex gap-8">
        {/* 사이드바 */}
        <aside className="w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">{bizname || '소소마을'}</h2>
            <p className="text-xs text-gray-500 mt-1">사업자 회원</p>
          </div>

          {menuGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-gray-400 mb-2 px-2">{group.title}</h4>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        if (item === '개인정보 확인') navigate("/business-mypage");
                        else if (item === '개인정보 수정') navigate("/business-update-mypage");
                        else if (item === '다중 매장 관리') navigate("/business-multiprofile");
                        else if (item === '회원 탈퇴') navigate("/business-withdrawal");
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
          {activeTab === '회원 탈퇴' ? (
            <WithdrawalSection />
          ) : (
            <div className="bg-white border border-gray-100 rounded-lg p-12 text-center text-gray-400">
              <h2 className="font-bold text-lg mb-2">{activeTab}</h2>
              <p>콘텐츠 준비 중입니다.</p>
            </div>
          )}
        </section>
      </main>
      <MainFooter />
    </div>
  );
}

export default BusinessWithdrawalPage;
