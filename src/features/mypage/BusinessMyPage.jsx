/**
 * @file BusinessMyPage.jsx
 * @description 사업자 전용 마이페이지 컴포넌트입니다.
 * '마이페이지 사업자.png' 디자인을 기반으로, 사이드바와 콘텐츠 영역을 구현합니다.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/soso로고.png";
import authStore from "../../store/authStore";
import { useBusinessInfo } from './hooks/useBusinessInfo';

// '개인정보 확인' 탭에 대한 상세 콘텐츠
const UserProfileTab = () => {
  const { profile, isLoading, error, formattedDate, formattedOpeningDate, fullAddress, storeImg1, storeImg2 } = useBusinessInfo();

  if (isLoading) return <div className="p-8 text-center text-gray-500">정보를 불러오는 중입니다...</div>;
  if (error) return <div className="p-8 text-center text-red-500">정보를 불러오는데 실패했습니다.</div>;

  // 데이터가 없을 경우를 대비한 초기값 설정
  const userData = {
    id: profile?.userId || '정보 없음',
    nickname: profile?.nickname || '정보 없음',
    name: profile?.name || '정보 없음',
    joinDate: formattedDate, 
    phone: profile?.phone || '정보 없음',
    email: profile?.email || '정보 없음',
    bizNumber: profile?.bizNumber?.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') || '정보 없음',
    bizName: profile?.companyName || '정보 없음',
    ceoName: profile?.ceoName || '정보 없음', // 👤 실제 대표자명 추가
    address: fullAddress,
    openDate: formattedOpeningDate
  };

  return (
    <div className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-2">개인정보 확인</h2>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">가입 시 등록한 정보를 확인합니다.</p>
      
      {/* 기본 계정 정보 */}
      <div className="mb-10">
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          기본 계정 정보
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">아이디</label>
            <div className="p-2 border-b">{userData.id}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">닉네임</label>
            <div className="p-2 border-b">{userData.nickname}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">이름 (서비스 실명)</label>
            <div className="p-2 border-b">{userData.name}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">가입 일자</label>
            <div className="p-2 border-b">{userData.joinDate}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">전화번호</label>
            <div className="p-2 border-b">{userData.phone}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">이메일</label>
            <div className="p-2 border-b">{userData.email}</div>
          </div>
        </div>
      </div>
      
      {/* 사업자 정보 */}
      <div className="mb-10">
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          사업자 정보
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">대표자명 (실명)</label>
            <div className="p-2 border-b">{userData.ceoName}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">사업자 번호</label>
            <div className="p-2 border-b">{userData.bizNumber}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">상호명</label>
            <div className="p-2 border-b">{userData.bizName}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">오픈일자</label>
            <div className="p-2 border-b">{userData.openDate}</div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">가게 주소</label>
            <div className="p-2 border-b">{userData.address}</div>
          </div>
        </div>
      </div>

      {/* 가게 사진 정보 */}
      <div>
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          가게 사진
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">가게 외관</label>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              <img src={storeImg1} alt="가게 외관" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">가게 내관</label>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              <img src={storeImg2} alt="가게 내관" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useStores } from '../../hooks/useStores';

function BusinessMyPage() {
  const { logout, user_type, user_nickname, bizname, selectedStoreSeq, setSelectedStore } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('개인정보 확인');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 🏪 [멀티 프로필] 사장님의 모든 매장 목록을 가져옵니다.
  const { stores, isLoading: isStoresLoading } = useStores();

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

  /**
   * 🔄 매장 전환 핸들러
   */
  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    setIsProfileOpen(false);
    // 현재 페이지가 마이페이지이므로, 훅(useBusinessInfo)이 selectedStoreSeq 변경을 감지하여 데이터를 자동 갱신함
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
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
                        else if (item === '직원 근태 관리') navigate("/business-attendance");
                        else if (item === '스마트 알림 설정') navigate("/business-notification");
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
          {activeTab === '개인정보 확인' ? (
            <UserProfileTab />
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
}

export default BusinessMyPage;
