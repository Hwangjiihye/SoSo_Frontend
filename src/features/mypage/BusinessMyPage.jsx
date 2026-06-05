/**
 * @file BusinessMyPage.jsx
 * @description 사업자 전용 마이페이지 컴포넌트입니다.
 * '마이페이지 사업자.png' 디자인을 기반으로, 사이드바와 콘텐츠 영역을 구현합니다.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainFooter from '../../components/layout/MainFooter';
import logo from "../../assets/soso로고.png";
import authStore from "../../store/authStore";

// '개인정보 확인' 탭에 대한 상세 콘텐츠
const UserProfileTab = () => {
  const { member, loginId } = authStore();

  // 데이터가 없을 경우를 대비한 초기값 설정
  const userData = {
    id: loginId || '정보 없음',
    nickname: member?.nickname || '정보 없음',
    name: member?.name || '정보 없음',
    joinDate: member?.created_at?.split('T')[0]?.replace(/-/g, '/') || '정보 없음', 
    phone: member?.phone || '정보 없음',
    email: member?.email || '정보 없음',
    bizNumber: member?.biz_number?.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') || '정보 없음',
    bizName: member?.company_name || '정보 없음',
    address: member?.address1 ? `${member.address1} ${member.address2 || ''}` : '정보 없음',
    openDate: member?.opening_date?.split('T')[0]?.replace(/-/g, '/') || '정보 없음'
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
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">가게 주소</label>
            <div className="p-2 border-b">{userData.address}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">오픈일자</label>
            <div className="p-2 border-b">{userData.openDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function BusinessMyPage() {
  const { logout, user_type, member, loginId } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('개인정보 확인');
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
    } else {
      alert("사업자 전용 마이페이지입니다.");
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
                {member?.nickname ? member.nickname.substring(0, 1) : 'G'}
              </div>
              <span className="text-sm font-semibold whitespace-nowrap text-gray-700">
                {member?.nickname || '회원님'} 
                <span className="text-xs text-gray-400 font-normal ml-1">
                  {member?.company_name || '상호명 미등록'}
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
                    {member?.company_name || '강남 본점'}
                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">Main</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                    홍대 2호점 (더미)
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
            <h2 className="font-bold text-gray-900">{member?.company_name || '소소마을'}</h2>
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
                        if (item === '개인정보 수정') {
                          navigate('/business-update-mypage');
                        } else if (item === '다중 매장 관리') {
                          navigate('/business-multiprofile');
                        } else {
                          setActiveTab(item);
                        }
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
      <MainFooter />
    </div>
  );
}

export default BusinessMyPage;
