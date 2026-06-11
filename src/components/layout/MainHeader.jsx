import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/soso로고.png';
import authStore from '../../store/authStore';
import { useStores } from '../../hooks/useStores';

/**
 * @file MainHeader.jsx
 * @description 애플리케이션의 공통 헤더 컴포넌트입니다.
 * 로고, 네비게이션(발주 관리 드롭다운 포함), 프로필 및 매장 전환 기능을 포함합니다.
 */
function MainHeader({ activeMenu = '홈' }) {
  const { logout, user_type, user_nickname, bizname, selectedStoreSeq, setSelectedStore } = authStore();
  const { stores, isLoading: isStoresLoading } = useStores();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleProfileClick = () => {
    if (user_type === 'BUSINESS') {
      navigate('/business-mypage');
      setIsProfileOpen(false);
    } else {
      alert("사업자 전용 마이페이지입니다.");
    }
  };

  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    navigate('/business-mypage');
    setIsProfileOpen(false);
  };

  // 네비게이션 항목 스타일 결정 함수
  const getNavStyle = (menuName) => {
    return activeMenu === menuName
      ? "px-4 py-1.5 text-sm font-semibold bg-white text-gray-900 rounded shadow-sm border border-gray-200"
      : "px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap";
  };

  return (
    <header className="grid grid-cols-3 items-center py-5 px-6 md:px-12 border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="SoSo Logo" className="w-12 h-12 object-contain relative top-[5px]" />
        <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">SoSo</div>
      </div>

      {/* Navigation Section */}
      <nav className="hidden md:flex justify-center gap-1 border border-gray-100 rounded-lg p-1 bg-gray-50 w-fit mx-auto relative">
        <Link to="/" className={getNavStyle('홈')}>홈</Link>
        
        {/* 발주 관리 드롭다운 메뉴 */}
        <div 
          className="relative"
          onMouseEnter={() => setIsOrderDropdownOpen(true)}
          onMouseLeave={() => setIsOrderDropdownOpen(false)}
        >
          <div className={activeMenu === '발주 관리' 
            ? "px-4 py-1.5 text-sm font-semibold bg-white text-emerald-600 rounded shadow-sm border border-gray-200 cursor-pointer transition-all whitespace-nowrap"
            : "px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-all cursor-pointer whitespace-nowrap"}>
            발주 관리
          </div>
          
          <div className={`absolute top-full left-0 w-48 pt-2 z-[60] transition-all duration-200 ${isOrderDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-2">
              <Link to="/orders" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl mb-1">
                일반 발주 현황
              </Link>
              <Link to="/group-orders" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl mb-1">
                공동 발주 현황
              </Link>
              <Link to="/orders/new" className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
                발주 신청
              </Link>
            </div>
          </div>
        </div>

        {['수금 관리', '커뮤니티', '업체 홍보', '통계'].map(m => (
          <Link 
            key={m} 
            to="#" 
            className={getNavStyle(m)}
          >
            {m}
          </Link>
        ))}
      </nav>

      {/* Right Section (Notifications & Profile) */}
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
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-[60] animate-fade-in-up">
              {user_type === 'BUSINESS' && (
                <>
                  <div className="p-3 border-b border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">나의 매장 목록</span>
                    {isStoresLoading && <span className="text-[10px] text-emerald-500 animate-pulse">로딩 중...</span>}
                  </div>

                  <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {stores && stores.length > 0 ? (
                      stores.map((store) => (
                        <button
                          key={store.storeSeq}
                          onClick={() => handleStoreSwitch(store.storeSeq, store.companyName)}
                          className={`w-full text-left px-4 py-3 rounded-xl mb-1 flex justify-between items-center transition-all ${
                            (selectedStoreSeq == store.storeSeq || (!selectedStoreSeq && stores[0].storeSeq === store.storeSeq))
                              ? 'bg-emerald-50 text-emerald-600 font-bold border border-emerald-100'
                              : 'text-gray-600 hover:bg-gray-50 font-medium'
                            }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm">{store.companyName}</span>
                            <span className="text-[10px] text-gray-400 font-normal">{store.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')}</span>
                          </div>
                          {(selectedStoreSeq == store.storeSeq || (!selectedStoreSeq && stores[0].storeSeq === store.storeSeq)) && (
                            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">Active</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-gray-400">등록된 매장이 없습니다.</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-50 pt-2 mt-2">
                    <button
                      onClick={() => { navigate("/business-multiprofile"); setIsProfileOpen(false); }}
                      className="w-full text-center py-2 text-[11px] font-bold text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all mb-1"
                    >
                      + 새 매장 추가하기
                    </button>
                  </div>
                </>
              )}

              {user_type === 'PARTNER' && (
                <div className="py-2">
                  <button className="w-full text-left px-4 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl mb-1 flex justify-between items-center">
                    {bizname || '한빛 식품 유통'}
                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase">Main</span>
                  </button>
                </div>
              )}

              <div className="border-t border-gray-50 pt-2 mt-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-center py-3 text-sm font-black text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  마이페이지
                </button>
                <button 
                  onClick={handleLogOut}
                  className="w-full text-center py-3 text-sm font-black text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default MainHeader;