import React from 'react';
import { useLogin } from './hooks/useLogin';

/**
 * @file LoginPage.jsx
 * @description 기존의 깔끔한 디자인을 유지하며, 아이디 기억하기 체크박스를 추가한 로그인 화면입니다.
 */
const LoginPage = () => {
  const { 
    loginType, 
    setLoginType, 
    formData, 
    options,
    handleInputChange, 
    handleOptionChange,
    handleLoginSubmit 
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* 로그인 박스 컨테이너: 너비를 기존 max-w-md(448px)에서 500px로 확장하여 가독성 확보 */}
      <div className="max-w-[500px] w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        
        {/* 상단 서비스 로고 및 타이틀 */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold" style={{ color: '#085041' }}>
            SoSo
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {loginType === 'business' ? '사업자' : '거래처'} 전용 로그인 서비스
          </p>
        </div>

        {/* 로그인 타입 선택 탭 */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setLoginType('business')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              loginType === 'business'
                ? 'bg-white shadow-sm text-[#1D9E75]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            사업자 로그인
          </button>
          <button
            onClick={() => setLoginType('partner')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              loginType === 'partner'
                ? 'bg-white shadow-sm text-[#1D9E75]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            거래처 로그인
          </button>
        </div>

        {/* 로그인 입력 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                아이디
              </label>
              <input
                id="userId"
                name="userId"
                type="text"
                required
                value={formData.userId}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all"
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          {/* 옵션 설정 및 계정 찾기: whitespace-nowrap을 추가하여 줄바꿈 방지 */}
          <div className="flex items-center justify-between text-sm whitespace-nowrap gap-4">
            <div className="flex items-center gap-3">
              {/* 로그인 상태 유지 */}
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={options.rememberMe}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-[#1D9E75] border-gray-300 rounded focus:ring-[#1D9E75] cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-1.5 block text-gray-700 cursor-pointer select-none text-[12px]">
                  로그인 상태 유지
                </label>
              </div>
              {/* 아이디 기억하기 */}
              <div className="flex items-center">
                <input
                  id="rememberId"
                  name="rememberId"
                  type="checkbox"
                  checked={options.rememberId}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-[#1D9E75] border-gray-300 rounded focus:ring-[#1D9E75] cursor-pointer"
                />
                <label htmlFor="rememberId" className="ml-1.5 block text-gray-700 cursor-pointer select-none text-[12px]">
                  아이디 기억하기
                </label>
              </div>
            </div>
            
            {/* 계정 찾기 링크 */}
            <div className="flex gap-2 font-medium text-[#158A64] text-[12px]">
              <span className="hover:text-[#0D6B50] cursor-pointer">아이디 찾기</span>
              <span className="text-gray-300 font-normal">|</span>
              <span className="hover:text-[#0D6B50] cursor-pointer">비밀번호 찾기</span>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all transform active:scale-95"
              style={{ backgroundColor: '#1D9E75' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#158A64')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1D9E75')}
            >
              로그인
            </button>
          </div>
        </form>

        {/* 하단 회원가입 유도 */}
        <div className="text-center text-sm">
          <span className="text-gray-600">아직 회원이 아니신가요?</span>{' '}
          <span className="font-bold text-[#0D6B50] hover:underline cursor-pointer">
            회원가입 하기
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
