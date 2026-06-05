/**
 * @file BusinessUpdateMyPage.jsx
 * @description 사업자 정보 수정 페이지 컴포넌트입니다.
 * useBusinessUpdate 훅을 사용하여 데이터 처리 및 서버 통신을 수행합니다.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainFooter from '../../components/layout/MainFooter';
import logo from "../../assets/soso로고.png";
import authStore from "../../store/authStore";
import { useBusinessUpdate } from './hooks/useBusinessUpdate';

// 비밀번호 변경 팝업 컴포넌트
const PasswordChangeModal = ({ isOpen, onClose, form, errors, onChange, onSubmit, isSubmitting }) => {
  if (!isOpen) return null;

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
          <h3 className="text-lg font-bold text-emerald-800">비밀번호 변경</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleFinalSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">현재 비밀번호</label>
            <input 
              type="password" 
              name="currentPassword"
              placeholder="현재 비밀번호를 입력하세요"
              value={form.currentPassword}
              onChange={onChange}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm"
              required
            />
          </div>
          <div className="border-t border-gray-50 pt-4">
            <label className="block text-xs font-bold text-gray-500 mb-2">새 비밀번호</label>
            <input 
              type="password" 
              name="newPassword"
              placeholder="새 비밀번호를 입력하세요"
              value={form.newPassword}
              onChange={onChange}
              className={`w-full p-3 bg-gray-50 border ${errors.newPassword ? 'border-red-300' : 'border-gray-100'} rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm`}
              required
            />
            {errors.newPassword && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.newPassword}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">새 비밀번호 확인</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="새 비밀번호를 다시 입력하세요"
              value={form.confirmPassword}
              onChange={onChange}
              className={`w-full p-3 bg-gray-50 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-100'} rounded-xl focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm`}
              required
            />
            {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? '변경 중...' : '변경 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserUpdateTab = () => {
  const navigate = useNavigate();
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  
  const {
    formData,
    passwordForm,
    errors,
    passwordErrors,
    isLoading,
    isSubmitting,
    isPasswordSubmitting,
    handleChange,
    handlePasswordChange,
    handleFileChange,
    handleAddressSearch,
    handleSubmit,
    handlePasswordSubmit,
  } = useBusinessUpdate();

  if (isLoading) return <div className="p-8 text-center text-gray-500">정보를 불러오는 중입니다...</div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-2">개인정보 수정</h2>
        <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">회원님의 정보를 최신 상태로 유지하세요.</p>
        
        {/* 기본 계정 정보 수정 */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-emerald-700 flex items-center gap-2">
              기본 계정 정보 수정
            </h3>
            <button 
              type="button"
              onClick={() => setIsPwModalOpen(true)}
              className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100"
            >
              비밀번호 변경
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">아이디 (변경 불가)</label>
              <div className="p-2 border-b bg-gray-50 text-gray-400">{formData.userId}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">닉네임</label>
              <input 
                type="text" 
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">전화번호</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-XXXX-XXXX"
                className={`w-full p-2 border-b ${errors.phone ? 'border-red-300' : 'border-gray-200'} focus:border-emerald-500 outline-none transition-colors`}
                required
              />
              {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">이메일</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border-b ${errors.email ? 'border-red-300' : 'border-gray-200'} focus:border-emerald-500 outline-none transition-colors`}
                required
              />
              {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>
        
        {/* 사업자 정보 수정 */}
        <div className="mb-10">
          <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
            사업자 정보 수정
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">상호명</label>
              <input 
                type="text" 
                name="bizname"
                value={formData.bizname}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">사업자 번호</label>
              <input 
                type="text" 
                name="bizNumber"
                value={formData.bizNumber}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">가게 주소</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  name="address1"
                  value={formData.address1}
                  readOnly
                  className="flex-grow p-2 border-b border-gray-200 bg-gray-50 outline-none"
                />
                <button 
                  type="button" 
                  onClick={handleAddressSearch}
                  className="px-3 py-1 bg-gray-100 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  주소 검색
                </button>
              </div>
              <input 
                type="text" 
                name="address2"
                placeholder="상세 주소를 입력하세요"
                value={formData.address2}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">오픈일자</label>
              <input 
                type="date" 
                name="openingDate"
                value={formData.openingDate}
                onChange={handleChange}
                className="w-full p-2 border-b border-gray-200 focus:border-emerald-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 가게 사진 수정 */}
        <div className="mb-10">
          <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
            가게 사진 수정
          </h3>
          <div className="grid grid-cols-2 gap-8">
            {/* 외관 사진 */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-3">가게 외관</label>
              <div className="relative group">
                <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-emerald-100 bg-gray-50 flex items-center justify-center">
                  {formData.exteriorPreview ? (
                    <img src={formData.exteriorPreview} alt="Exterior Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs">사진을 선택해 주세요</span>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                  <span className="text-white text-xs font-bold bg-emerald-500 px-4 py-2 rounded-full shadow-lg">사진 변경</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'exterior')} />
                </label>
              </div>
            </div>
            {/* 내관 사진 */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-3">가게 내관</label>
              <div className="relative group">
                <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-emerald-100 bg-gray-50 flex items-center justify-center">
                  {formData.interiorPreview ? (
                    <img src={formData.interiorPreview} alt="Interior Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs">사진을 선택해 주세요</span>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                  <span className="text-white text-xs font-bold bg-emerald-500 px-4 py-2 rounded-full shadow-lg">사진 변경</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'interior')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button 
            type="button" 
            onClick={() => navigate("/business-mypage")}
            className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button 
            type="submit"
            className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>

      <PasswordChangeModal 
        isOpen={isPwModalOpen} 
        onClose={() => setIsPwModalOpen(false)}
        form={passwordForm}
        errors={passwordErrors}
        onChange={handlePasswordChange}
        onSubmit={handlePasswordSubmit}
        isSubmitting={isPasswordSubmitting}
      />
    </>
  );
};

function BusinessUpdateMyPage() {
  const { logout, user_type, user_nickname, bizname } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('개인정보 수정');
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
          {activeTab === '개인정보 수정' ? (
            <UserUpdateTab />
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

export default BusinessUpdateMyPage;
