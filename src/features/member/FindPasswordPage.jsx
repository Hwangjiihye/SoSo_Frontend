import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFindPassword } from './hooks/useFindPassword';

/**
 * @file FindPasswordPage.jsx
 * @description 사용자의 아이디와 이메일을 입력받아 비밀번호를 찾기(재설정) 위한 페이지입니다.
 * 인증 성공 시 새 비밀번호를 설정할 수 있는 화면(비밀번호 찾기2.jpg 참고)이 나타납니다.
 */
const FindPasswordPage = () => {
  const navigate = useNavigate();
  
  // 비즈니스 로직(상태 관리, 유효성 검사 등)은 커스텀 훅으로 100% 격리합니다.
  const {
    formData,
    errors,
    isVerifying,
    verificationCode,
    isResetStep,
    handleInputChange,
    handleVerificationCodeChange,
    handleSendCodeClick,
    handleVerifyConfirm,
    handleResetPasswordSubmit,
  } = useFindPassword();

  // 비밀번호 변경 성공 시 로그인 페이지로 이동
  const onResetSubmit = () => {
    if (handleResetPasswordSubmit()) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* 컨테이너: 다른 회원 페이지와 동일한 스타일 적용 */}
      <div className="max-w-[520px] w-full space-y-8 bg-white py-14 px-12 rounded-3xl shadow-2xl border border-gray-100">
        
        {/* 상단 헤더 영역 */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-0 cursor-pointer" onClick={() => navigate('/login')}>
            <img 
              src="/images/logo.png" 
              alt="SoSo Logo" 
              className="w-13 h-13 object-contain transform translate-y-[4px]"
            />
            <h1 className="text-[40px] font-black leading-none tracking-tight" style={{ color: '#1D9E75' }}>
              SoSo
            </h1>
          </div>
          <h2 className="mt-4 text-[24px] font-extrabold text-gray-900">
            {isResetStep ? '비밀번호 재설정' : '비밀번호 찾기'}
          </h2>
          <p className="mt-2 text-[15px] text-gray-500 font-medium text-center">
            {isResetStep 
              ? '새롭게 사용할 비밀번호를 입력해주세요.' 
              : '가입하신 아이디와 이메일을 입력하시면 \n 비밀번호를 재설정할 수 있습니다.'}
          </p>
        </div>

        {!isResetStep ? (
          /* 1단계 & 2단계: 정보 입력 및 이메일 인증 */
          <div className="space-y-6 pt-2">
            {/* 아이디 입력 */}
            <div>
              <label htmlFor="userId" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                아이디
              </label>
              <input
                id="userId"
                name="userId"
                type="text"
                value={formData.userId}
                onChange={handleInputChange}
                disabled={isVerifying}
                className={`block w-full px-5 py-3 rounded-2xl border outline-none transition-all ${
                  isVerifying 
                    ? 'bg-gray-100 text-gray-400 border-gray-200' 
                    : errors.userId
                      ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-gray-50'
                      : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent'
                }`}
                placeholder="아이디를 입력하세요"
              />
              {errors.userId && (
                <p className="mt-1.5 ml-1 text-[12px] font-semibold text-red-500 animate-in fade-in slide-in-from-top-1">
                  {errors.userId}
                </p>
              )}
            </div>

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isVerifying}
                className={`block w-full px-5 py-3 rounded-2xl border outline-none transition-all ${
                  isVerifying 
                    ? 'bg-gray-100 text-gray-400 border-gray-200' 
                    : errors.email
                      ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-gray-50'
                      : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent'
                }`}
                placeholder="이메일을 입력하세요"
              />
              {errors.email && (
                <p className="mt-1.5 ml-1 text-[12px] font-semibold text-red-500 animate-in fade-in slide-in-from-top-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* 비밀번호 찾기(인증번호 발송) 버튼 */}
            <div className="pt-2">
              <button
                onClick={handleSendCodeClick}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white shadow-lg transition-all transform active:scale-[0.98]"
                style={{ backgroundColor: '#1D9E75' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#158A64')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1D9E75')}
              >
                {isVerifying ? '인증번호 재발송' : '비밀번호 찾기'}
              </button>
            </div>

            {/* 이메일 인증 영역 */}
            {isVerifying && (
              <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <label htmlFor="verificationCode" className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                    인증번호 입력
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={handleVerificationCodeChange}
                      className={`flex-1 px-5 py-3 rounded-2xl border outline-none transition-all font-bold tracking-widest ${
                        errors.verificationCode
                          ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-white'
                          : 'border-gray-200 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent bg-white'
                      }`}
                      placeholder="6자리 번호"
                      maxLength={6}
                    />
                    <button
                      onClick={handleVerifyConfirm}
                      className="px-6 py-3 bg-gray-800 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95 whitespace-nowrap"
                    >
                      확인
                    </button>
                  </div>
                  {errors.verificationCode ? (
                    <p className="mt-2.5 ml-1 text-[12px] font-semibold text-red-500 animate-in fade-in slide-in-from-top-1">
                      {errors.verificationCode}
                    </p>
                  ) : (
                    <p className="mt-3 ml-1 text-[12px] text-gray-500 font-medium">
                      임시 인증번호는 <span className="text-[#1D9E75] font-bold">123456</span> 입니다.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <button 
                onClick={() => navigate('/login')}
                className="text-[15px] font-bold text-[#0D6B50] hover:underline underline-offset-4 transition-all"
              >
                로그인 화면으로 돌아가기
              </button>
            </div>
          </div>
        ) : (
          /* 3단계: 비밀번호 재설정 단계 (비밀번호 찾기2.jpg 참고) */
          <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* 새 비밀번호 입력 */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                새 비밀번호
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`block w-full px-5 py-3 rounded-2xl border outline-none transition-all ${
                  errors.newPassword
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-gray-50'
                    : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent'
                }`}
                placeholder="새 비밀번호 (8자 이상)"
              />
              {errors.newPassword && (
                <p className="mt-1.5 ml-1 text-[12px] font-semibold text-red-500 animate-in fade-in slide-in-from-top-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 입력 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`block w-full px-5 py-3 rounded-2xl border outline-none transition-all ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-gray-50'
                    : 'bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent'
                }`}
                placeholder="비밀번호를 한 번 더 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 ml-1 text-[12px] font-semibold text-red-500 animate-in fade-in slide-in-from-top-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* 비밀번호 저장 버튼 */}
            <div className="pt-4">
              <button
                onClick={onResetSubmit}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white shadow-lg transition-all transform active:scale-[0.98]"
                style={{ backgroundColor: '#1D9E75' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#158A64')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1D9E75')}
              >
                비밀번호 저장 및 로그인
              </button>
            </div>

            <p className="text-center text-[13px] text-gray-400 font-medium">
              비밀번호 변경 후 자동으로 로그인 페이지로 이동합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPasswordPage;
