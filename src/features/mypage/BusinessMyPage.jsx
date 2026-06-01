/**
 * @file BusinessMyPage.jsx
 * @description 사업자 전용 마이페이지 컴포넌트입니다.
 * '마이페이지 사업자.png' 디자인을 기반으로, 사이드바와 콘텐츠 영역을 구현합니다.
 */
import React, { useState } from 'react';
import MainFooter from '../../components/layout/MainFooter';
// 🛠️ 기존 ../.. 에서 ../ 하나 더 추가해서 3칸 올라가기!
import logo from "../../assets/soso로고.png";

// '개인정보 확인' 탭에 대한 상세 콘텐츠
const UserProfileTab = () => {
  const userData = {
    id: 'smart01234',
    nickname: '소소 사랑',
    name: '홍길동',
    joinDate: '2025-01-15',
    phone: '010-1234-5678',
    email: 'vegetable@naver.com',
    bizNumber: '000-00-00000',
    bizName: '소소 마을',
    address: '서울특별시 강남구 테헤란로 123 1층',
    bizType: '채소/과일 사업자 (일반)'
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
            <label className="block text-xs font-semibold text-gray-500 mb-1">이름</label>
            <div className="p-2 border-b">{userData.name}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">가입 일자</label>
            <div className="p-2 border-b">{userData.joinDate}</div>
          </div>
        </div>
      </div>
      
      {/* 사업자 정보 */}
      <div>
        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
          사업자 정보
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">사업자 번호</label>
            <div className="p-2 border-b">{userData.bizNumber}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">상호명</label>
            <div className="p-2 border-b">{userData.bizName}</div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">가게 주소</label>
            <div className="p-2 border-b">{userData.address}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function BusinessMyPage() {
  const [activeTab, setActiveTab] = useState('개인정보 확인');
  const menuGroups = [
    { title: '계정', items: ['개인정보 확인', '개인정보 수정', '회원 탈퇴'] },
    { title: '설정', items: ['스마트 알림 설정'] },
    { title: '운영', items: ['다중 매장 관리', '직원 근태 관리'] }
  ];

  return (

    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
              <div className="flex items-center gap-2">
                <img src={logo} alt="SoSo Logo" className="w-8 h-8 object-contain" />
                <div className="text-2xl font-black text-emerald-600 tracking-tighter">SoSo</div>
              </div>
              <nav className="hidden md:flex justify-center">
                {/* ... 네비게이션 메뉴 ... */}
              </nav>
              <div className="flex items-center justify-end gap-4">
                <button className="text-gray-400 hover:text-emerald-600 relative">
                  <span className="text-xl">🔔</span>
                  <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                {/* 프로필 클릭 시 handleProfileClick 함수 실행 */}
                <div
                  className="flex items-center gap-2 border border-gray-200 rounded-full py-1.5 px-3 bg-white hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold">김</div>
                  <span className="text-sm font-semibold whitespace-nowrap text-gray-700">김민준 <span className="text-xs text-gray-400 font-normal">강남 본점</span></span>
                </div>
                <button onClick={() => setRole('guest')} className="text-xs text-gray-400 hover:underline">로그아웃</button>
              </div>
            </header>
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-10 flex gap-8">
        {/* 사이드바 */}
        <aside className="w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">소소마을</h2>
            <p className="text-xs text-gray-500 mt-1">사업자 회원</p>
          </div>
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-gray-400 mb-2 px-2">{group.title}</h4>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => setActiveTab(item)}
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
      <MainFooter />
    </div>
  );
}

export default BusinessMyPage;
