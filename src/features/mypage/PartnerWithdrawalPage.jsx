/**
 * @file PartnerWithdrawalPage.jsx
 * @description 거래처 회원 탈퇴 페이지 (사업자 마이페이지 UI 레이아웃 통일 적용)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerWithdrawal } from './hooks/usePartnerWithdrawal';
import { usePartnerInfo } from './hooks/usePartnerInfo';
import authStore from '../../store/authStore';

// 회원 탈퇴 탭 콘텐츠
const WithdrawalTab = ({
  reason, 
  setReason, 
  customReason, 
  setCustomReason, 
  isChecked, 
  setIsChecked, 
  isSubmitting, 
  reasons, 
  handleWithdrawal 
}) => {
  return (
    <div className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-2">회원 탈퇴</h2>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">SoSo 서비스를 탈퇴하시기 전 아래 내용을 확인해 주세요.</p>
      
      <div className="space-y-8">
        {/* 유의사항 카드 */}
        <div className="bg-white rounded-xl border border-red-100 p-6 shadow-sm">
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
        <div>
          <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
            <span className="text-emerald-600">📝</span>
            탈퇴하시는 사유가 무엇인가요?
          </div>
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
        <div className="pt-4 flex flex-col gap-4">
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
        </div>
      </div>
    </div>
  );
};

const PartnerWithdrawalPage = () => {
  const { bizname } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('회원 탈퇴');

  const partnerInfo = usePartnerInfo();
  const ceoName = partnerInfo.profile?.repName || partnerInfo.profile?.ceoName || '';

  const { 
    reason, setReason, customReason, setCustomReason, isChecked, setIsChecked, 
    isSubmitting, reasons, handleWithdrawal 
  } = usePartnerWithdrawal();

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
          {activeTab === '회원 탈퇴' ? (
            <WithdrawalTab 
              reason={reason} setReason={setReason} customReason={customReason} setCustomReason={setCustomReason} 
              isChecked={isChecked} setIsChecked={setIsChecked} isSubmitting={isSubmitting} 
              reasons={reasons} handleWithdrawal={handleWithdrawal}
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

export default PartnerWithdrawalPage;
