import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePartnerEditProfile } from './hooks/usePartnerEditProfile';
import logo from "../../assets/soso로고.png";
import authStore from '../../store/authStore';

/**
 * @file PartnerEditProfilePage.jsx
 * @description 거래처 업체 정보 수정 페이지
 */
const PartnerEditProfilePage = () => {
  const navigate = useNavigate();
  const logout = authStore((state) => state.logout);
  const { 
    formData, 
    isLoading, 
    isSubmitting, 
    handleChange, 
    handleFileChange,
    handleRemovePhoto,
    handleAddressSearch, 
    handleSubmit,
    setFormData 
  } = usePartnerEditProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('업체 정보 수정');

  const exteriorInputRef = React.useRef(null);
  const interiorInputRef = React.useRef(null);

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

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
          { name: '회원 탈퇴', icon: '👤', path: '#' },
          { name: '스마트 알림 설정', icon: '🔔', path: '#' }
        ].map(tab => (
          <div
            key={tab.name}
            onClick={() => tab.path !== '#' && navigate(tab.path)}
            className={`px-4 py-4 text-sm font-bold flex items-center gap-2 cursor-pointer border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.name 
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
        <h2 className="text-xl font-bold text-gray-900">업체 정보 수정</h2>
        <p className="text-sm text-gray-500 mt-1">수정할 항목을 변경한 후 저장하세요.</p>
      </div>

      {/* 4. 메인 콘텐츠 */}
      <div className="max-w-[600px] w-full mx-auto mt-6 px-4 flex flex-col gap-4">
        
        {/* 기존 계정 정보 변경 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
            <span className="text-emerald-600">👤</span>
            기존 계정 정보 변경
          </div>
          <div className="h-px bg-gray-100 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <EditField label="닉네임" name="nickname" value={formData.nickname} onChange={handleChange} />
            <EditField label="휴대전화" name="phone" value={formData.phone} onChange={handleChange} />
            <EditField label="이메일" name="email" value={formData.email} onChange={handleChange} />
            <EditField label="비밀번호" name="password" type="password" value="********" disabled />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-2 h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <span>✏️</span> 비밀번호 변경하기 <span>→</span>
          </button>
        </div>

        {/* 업체 정보 수정 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <span className="text-emerald-600">🏢</span>
              업체 정보 수정
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-1 rounded-full flex items-center gap-1 font-bold">
              🔒 인증 데이터 잠금
            </span>
          </div>
          <div className="h-px bg-gray-100 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <EditField label="사업자 번호" value={formData.bizNumber} disabled />
            <EditField label="상호명" value={formData.companyName} disabled />
            <EditField label="대표자명" value={formData.representativeName} disabled />
            <EditField label="개업일자" value={formData.openingDate} disabled />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 ml-1">가게 주소</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="우편번호" 
                value={formData.zonecode}
                readOnly
                className="w-32 h-10 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm outline-none"
              />
              <button 
                onClick={handleAddressSearch}
                className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                📍 주소 검색
              </button>
            </div>
            <input 
              type="text" 
              placeholder="도로명 주소 자동 입력" 
              value={formData.address1}
              readOnly
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-400 outline-none"
            />
            <input 
              type="text" 
              name="address2"
              placeholder="상세 주소 직접 입력" 
              value={formData.address2}
              onChange={handleChange}
              className="w-full h-10 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* 가게 사진 편집 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <span className="text-emerald-600">🖼️</span>
              가게 사진 편집
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">📡 GCS 실시간 연동</span>
          </div>
          <div className="h-px bg-gray-100 mb-6"></div>

          <div className="grid grid-cols-2 gap-4">
            {/* 가게 외관 사진 */}
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                className="hidden" 
                ref={exteriorInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'exterior')}
              />
              {formData.exteriorPreview ? (
                <PhotoSlot 
                  label="가게 외관" 
                  preview={formData.exteriorPreview} 
                  onRemove={() => handleRemovePhoto('exterior')} 
                />
              ) : (
                <AddPhotoBtn label="가게 외관" onClick={() => exteriorInputRef.current?.click()} />
              )}
            </div>

            {/* 가게 내부 사진 */}
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                className="hidden" 
                ref={interiorInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'interior')}
              />
              {formData.interiorPreview ? (
                <PhotoSlot 
                  label="가게 내부" 
                  preview={formData.interiorPreview} 
                  onRemove={() => handleRemovePhoto('interior')} 
                />
              ) : (
                <AddPhotoBtn label="가게 내부" onClick={() => interiorInputRef.current?.click()} />
              )}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 font-medium italic">ℹ️ JPG, PNG만 가능 (외관/내부 각 1장)</p>
        </div>

        {/* 저장 버튼 */}
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:bg-gray-300"
        >
          {isSubmitting ? '저장 중...' : '💾 변경 사항 저장'}
        </button>
      </div>

      {/* 5. 계정 정보 변경 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[360px] rounded-3xl p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">계정 정보 변경</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            
            <div className="space-y-4">
              <EditField label="변경할 닉네임" value={formData.nickname} onChange={handleChange} name="nickname" />
              <EditField label="새 비밀번호" type="password" placeholder="새 비밀번호 입력" />
              <EditField label="새 비밀번호 확인" type="password" placeholder="새 비밀번호 재입력" />
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors"
              >
                취소
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 편집 필드 공통 컴포넌트
 */
const EditField = ({ label, type = "text", value, onChange, name, disabled, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-400 ml-1">{label}</label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`h-10 px-4 rounded-xl text-sm border outline-none transition-all ${
        disabled 
        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' 
        : 'bg-white text-gray-800 border-gray-200 focus:border-emerald-500'
      }`}
    />
  </div>
);

/**
 * 사진 슬롯 컴포넌트
 */
const PhotoSlot = ({ label, preview, onRemove }) => (
  <div className="w-full aspect-video md:aspect-[4/3] bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center justify-center relative group overflow-hidden shadow-inner">
    <img src={preview} alt={label} className="w-full h-full object-cover" />
    <button 
      onClick={onRemove}
      className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white text-lg hover:bg-black/70 transition-colors z-10"
    >
      ×
    </button>
    <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-2 backdrop-blur-[2px]">
      <p className="text-[11px] text-white font-bold text-center tracking-tight">{label}</p>
    </div>
  </div>
);

/**
 * 사진 추가 버튼 컴포넌트
 */
const AddPhotoBtn = ({ label, onClick }) => (
  <div 
    onClick={onClick}
    className="w-full aspect-video md:aspect-[4/3] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
  >
    <span className="text-3xl text-gray-300 group-hover:text-emerald-500 transition-transform group-hover:scale-110 duration-200">+</span>
    <span className="text-[11px] text-gray-400 font-bold mt-2 group-hover:text-emerald-600 transition-colors">{label} 추가</span>
  </div>
);

export default PartnerEditProfilePage;
