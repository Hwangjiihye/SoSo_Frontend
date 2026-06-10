/**
 * @file BusinessMultiProfile.jsx
 * @description 다중 매장 관리 및 추가 페이지 컴포넌트입니다.
 * BusinessMyPage와 동일한 레이아웃을 유지하며, 새로운 매장 정보를 추가할 수 있는 폼을 제공합니다.
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainFooter from '../../components/layout/MainFooter';
import logo from "../../assets/soso로고.png";
import authStore from "../../store/authStore";
import { useBusinessMultiProfile } from './hooks/useBusinessMultiProfile';
import { PhotoSlot, AddPhotoBtn } from './components/PartnerEditProfileSection';

const MultiProfileTab = () => {
  const navigate = useNavigate();
  const exteriorInputRef = useRef(null);
  const interiorInputRef = useRef(null);

  // 훅에서 필요한 데이터와 함수들을 가져옵니다.
  const {
    formData,
    isBizVerified,       // 사업자 인증 완료 여부
    isSubmitting,        // 등록 진행 중 여부
    handleChange,        // 입력 값 변경 핸들러
    handleFileChange,    // 파일 선택 핸들러
    handleRemovePhoto,   // 사진 제거 핸들러
    handleAddressSearch, // 주소 검색 핸들러
    handleVerifyBusiness,// 사업자 인증 핸들러
    handleSubmit         // 폼 제출 핸들러
  } = useBusinessMultiProfile();

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">다중 매장 관리</h2>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">최대 5개 등록 가능</span>
      </div>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">새로운 사업자 정보를 등록하여 매장을 추가로 관리할 수 있습니다.</p>
      
      {/* 매장 추가 폼 */}
      <div className="space-y-10">
        <div>
          <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-6 text-base">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
            신규 매장 정보 입력
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-2">상호명</label>
              <input 
                type="text" 
                name="b_nm"
                placeholder="예: 소소마을 강남점"
                value={formData.b_nm}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-2">대표자명</label>
              <input 
                type="text" 
                name="p_nm"
                placeholder="실명을 입력하세요"
                value={formData.p_nm}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-2">사업자 번호</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="b_no"
                  placeholder="000-00-00000"
                  value={formData.b_no}
                  onChange={handleChange}
                  className="flex-grow p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  required
                />
                <button 
                  type="button" 
                  onClick={handleVerifyBusiness}
                  disabled={isBizVerified}
                  className={`px-4 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                    isBizVerified 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-gray-800 text-white hover:bg-black'
                  }`}
                >
                  {isBizVerified ? '인증 완료' : '인증하기'}
                </button>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-2">가게 주소</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  name="zipcode"
                  placeholder="우편번호"
                  value={formData.zipcode}
                  readOnly
                  className="w-32 p-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-500 outline-none"
                />
                <button 
                  type="button" 
                  onClick={handleAddressSearch}
                  className="px-5 bg-gray-800 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors whitespace-nowrap"
                >
                  주소 검색
                </button>
              </div>
              <input 
                type="text" 
                name="address1"
                placeholder="주소 검색을 이용해 주세요"
                value={formData.address1}
                readOnly
                className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-500 outline-none mb-3"
              />
              <input 
                type="text" 
                name="address2"
                placeholder="상세 주소를 입력하세요"
                value={formData.address2}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-2">오픈일자</label>
              <input 
                type="date" 
                name="start_dt"
                value={formData.start_dt}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* 매장 사진 등록 */}
        <div>
          <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-6 text-base">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
            매장 사진 등록
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 외부 사진 */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 ml-1">가게 외부 사진</label>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={exteriorInputRef}
                onChange={(e) => handleFileChange(e, 'exterior')}
              />
              {formData.exteriorPreview ? (
                <PhotoSlot 
                  label="외부 사진" 
                  preview={formData.exteriorPreview} 
                  onRemove={() => handleRemovePhoto('exterior')} 
                />
              ) : (
                <AddPhotoBtn 
                  label="외부 사진" 
                  onClick={() => exteriorInputRef.current.click()} 
                />
              )}
            </div>

            {/* 내부 사진 */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 ml-1">가게 내부 사진</label>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={interiorInputRef}
                onChange={(e) => handleFileChange(e, 'interior')}
              />
              {formData.interiorPreview ? (
                <PhotoSlot 
                  label="내부 사진" 
                  preview={formData.interiorPreview} 
                  onRemove={() => handleRemovePhoto('interior')} 
                />
              ) : (
                <AddPhotoBtn 
                  label="내부 사진" 
                  onClick={() => interiorInputRef.current.click()} 
                />
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-4 ml-1 italic">* 매장 홍보 시 고객들에게 노출되는 사진입니다. 선명한 사진을 등록해주세요.</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-12 pt-8 border-t border-gray-50">
        <button 
          type="button" 
          onClick={() => navigate("/business-mypage")}
          className="px-8 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button 
          type="submit"
          className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100 disabled:bg-emerald-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '매장 등록하기'}
        </button>
      </div>
    </form>
  );
};

function BusinessMultiProfile() {
  const { logout, user_type, user_nickname, bizname } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('다중 매장 관리');
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
                        else if (item === '직원 근태 관리') navigate("/business-attendance");
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
          {activeTab === '다중 매장 관리' ? (
            <MultiProfileTab />
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

export default BusinessMultiProfile;
