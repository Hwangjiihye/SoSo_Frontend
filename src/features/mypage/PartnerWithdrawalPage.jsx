import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerWithdrawal } from './hooks/usePartnerWithdrawal';
import logo from "../../assets/soso로고.png";
import authStore from '../../store/authStore';

/**
 * @file PartnerWithdrawalPage.jsx
 * @description 거래처 회원 탈퇴 페이지
 */
const PartnerWithdrawalPage = () => {
  const navigate = useNavigate();
  const logout = authStore((state) => state.logout);
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
  } = usePartnerWithdrawal();

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
              tab.path === '/partner-withdrawal' 
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
        <h2 className="text-xl font-bold text-gray-900">회원 탈퇴</h2>
        <p className="text-sm text-gray-500 mt-1">SoSo 서비스를 탈퇴하시기 전 아래 내용을 확인해 주세요.</p>
      </div>

      {/* 4. 메인 콘텐츠 */}
      <div className="max-w-[600px] w-full mx-auto mt-6 px-4 flex flex-col gap-6">
        
        {/* 유의사항 카드 */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
            <span>⚠️</span>
            탈퇴 시 유의사항
          </div>
          <ul className="text-sm text-gray-600 space-y-3 list-disc pl-4">
            <li>탈퇴 시 계정 정보 및 SoSo에서 제공하는 모든 서비스 이용 기록이 즉시 삭제됩니다.</li>
            <li>진행 중인 거래 건이 있는 경우 탈퇴가 불가능할 수 있으니 확인 후 진행해 주세요.</li>
            <li>탈퇴한 계정의 데이터(거래 내역, 업체 정보 등)는 복구가 불가능합니다.</li>
            <li>관련 법령에 따라 일정 기간 보관이 필요한 정보는 별도로 보관될 수 있습니다.</li>
          </ul>
        </div>

        {/* 탈퇴 사유 선택 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
            <span className="text-emerald-600">📝</span>
            탈퇴하시는 사유가 무엇인가요?
          </div>
          <div className="h-px bg-gray-100 mb-6"></div>
          
          <div className="space-y-3">
            {reasons.map((r) => (
              <label key={r} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                <input 
                  type="radio" 
                  name="reason" 
                  value={r} 
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">{r}</span>
              </label>
            ))}
          </div>

          {reason === '기타 (직접 입력)' && (
            <textarea 
              placeholder="사유를 입력해 주세요." 
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full mt-4 p-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 min-h-[100px] transition-colors"
            />
          )}
        </div>

        {/* 동의 및 버튼 영역 */}
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 cursor-pointer group px-1">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
              안내사항을 모두 확인하였으며, 이에 동의합니다.
            </span>
          </label>

          <button 
            onClick={handleWithdrawal}
            disabled={isSubmitting || !isChecked || !reason}
            className={`w-full h-12 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] ${
              isChecked && reason && !isSubmitting
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '탈퇴 처리 중...' : '👤 회원 탈퇴하기'}
          </button>

          <button 
            onClick={() => navigate('/partner-info')}
            className="w-full h-12 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
          >
            취소하고 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerWithdrawalPage;
