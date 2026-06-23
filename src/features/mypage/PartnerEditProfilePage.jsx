/**
 * @file PartnerEditProfilePage.jsx
 * @description 거래처 업체 정보 수정 페이지 (사업자 마이페이지 UI 레이아웃 통일 적용)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerEditProfile } from './hooks/usePartnerEditProfile';
import authStore from '../../store/authStore';
import { AddPhotoBtn, EditField, PhotoSlot } from './components/PartnerEditProfileSection';

// Edit 탭 콘텐츠 컴포넌트화
const EditProfileTab = ({
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
  handleRemovePhoto,
  handleAddressSearch, 
  handleSubmit,
  handlePasswordSubmit,
  setIsModalOpen,
  exteriorInputRef,
  interiorInputRef
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-emerald-100 rounded-lg p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-2">업체 정보 수정</h2>
        <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">수정할 항목을 변경한 후 저장하세요.</p>
        
        <div className="space-y-8">
          {/* 기존 계정 정보 변경 */}
          <div>
            <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-4">
              👤 기존 계정 정보 변경
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <EditField label="닉네임" name="nickname" value={formData.nickname} onChange={handleChange} error={errors.nickname} />
              <EditField label="휴대전화" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
              <EditField label="이메일" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <span>✏️</span> 비밀번호 변경하기 <span>→</span>
            </button>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* 업체 정보 수정 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-emerald-700 flex items-center gap-2">
                🏢 업체 정보 수정
              </h3>
              <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-1 rounded-full flex items-center gap-1 font-bold">
                🔒 인증 데이터 잠금
              </span>
            </div>
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

          <div className="h-px bg-gray-100"></div>

          {/* 가게 사진 편집 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-emerald-700 flex items-center gap-2">
                🖼️ 가게 사진 편집
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold">📡 GCS 실시간 연동</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          <div className="pt-4">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:bg-gray-300"
            >
              {isSubmitting ? '저장 중...' : '💾 변경 사항 저장'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const PartnerEditProfilePage = () => {
  const { bizname } = authStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('업체 정보 수정');

  const { 
    formData, passwordForm, errors, passwordErrors, isLoading, isSubmitting, isPasswordSubmitting,
    handleChange, handlePasswordChange, handleFileChange, handleRemovePhoto, handleAddressSearch, 
    handleSubmit, handlePasswordSubmit
  } = usePartnerEditProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const exteriorInputRef = React.useRef(null);
  const interiorInputRef = React.useRef(null);

  const menuGroups = [
    { title: '계정', items: ['업체 정보 확인', '업체 정보 수정', '회원 탈퇴'] },
    { title: '설정', items: ['스마트 알림 설정'] }
  ];

  const onPasswordSubmit = async () => {
    const success = await handlePasswordSubmit();
    if (success) setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-10 flex gap-8">
        {/* 사이드바 */}
        <aside className="w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-emerald-100 rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-gray-900">{bizname || '거래처 업체'}</h2>
            <p className="text-xs text-gray-500 mt-1">거래처 회원</p>
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
          {activeTab === '업체 정보 수정' ? (
            <EditProfileTab 
              formData={formData} passwordForm={passwordForm} errors={errors} passwordErrors={passwordErrors}
              isLoading={isLoading} isSubmitting={isSubmitting} isPasswordSubmitting={isPasswordSubmitting}
              handleChange={handleChange} handlePasswordChange={handlePasswordChange} handleFileChange={handleFileChange}
              handleRemovePhoto={handleRemovePhoto} handleAddressSearch={handleAddressSearch} handleSubmit={handleSubmit}
              handlePasswordSubmit={handlePasswordSubmit} setIsModalOpen={setIsModalOpen}
              exteriorInputRef={exteriorInputRef} interiorInputRef={interiorInputRef}
            />
          ) : (
            <div className="bg-white border border-gray-100 rounded-lg p-12 text-center text-gray-400">
              <h2 className="font-bold text-lg mb-2">{activeTab}</h2>
              <p>콘텐츠 준비 중입니다.</p>
            </div>
          )}
        </section>
      </main>

      {/* 비밀번호 변경 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[360px] rounded-3xl p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">비밀번호 변경</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            
            <div className="space-y-4">
              <EditField label="현재 비밀번호" type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="현재 비밀번호 입력" error={passwordErrors.currentPassword} />
              <EditField label="새 비밀번호" type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="새 비밀번호 입력" error={passwordErrors.newPassword} />
              <EditField label="새 비밀번호 확인" type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} placeholder="새 비밀번호 재입력" error={passwordErrors.confirmPassword} />
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors">취소</button>
              <button onClick={onPasswordSubmit} disabled={isPasswordSubmitting} className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:bg-gray-300">
                {isPasswordSubmitting ? '변경 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerEditProfilePage;
