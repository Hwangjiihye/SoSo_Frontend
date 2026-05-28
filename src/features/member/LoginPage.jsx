import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './hooks/useLogin';

/**
 * @file LoginPage.jsx
 * @description 가로 비율은 줄이고 세로 여백을 충분히 확보하여 더 균형 잡힌 레이아웃으로 개선한 로그인 화면입니다.
 * 지정된 그린 계열 색상과 정교한 간격 조정을 통해 시각적 완성도를 높였습니다.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  // 비즈니스 로직(상태 관리, 이벤트 핸들러)은 커스텀 훅으로 100% 분리하여 사용합니다.
  const { 
    loginType, 
    setLoginType, 
    formData, 
    errors,
    options,
    handleInputChange, 
    handleOptionChange,
    handleLoginSubmit 
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* 로그인 박스 컨테이너: 가로 너비를 520px로 최적화하고 세로 패딩(py-14)과 요소 간 간격(space-y-8)을 조정했습니다. */}
      <div className="max-w-[520px] w-full space-y-8 bg-white py-14 px-12 rounded-3xl shadow-2xl border border-gray-100">
        
        {/* 상단 브랜드 영역: 로고와 타이틀의 조화로운 배치 */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center justify-center gap-0">
            {/* 로고 이미지: 시각적 균형을 위해 수직 위치를 정밀 조정했습니다. */}
            <img 
              src="/images/logo.png" 
              alt="SoSo Logo" 
              className="w-13 h-13 object-contain transform translate-y-[4px]"
            />
            {/* 타이틀: 브랜드의 정체성을 나타내는 굵고 선명한 폰트 적용 */}
            <h1 className="text-[40px] font-black leading-none tracking-tight" style={{ color: '#1D9E75' }}>
              SoSo
            </h1>
          </div>
          {/* 하단 안내 문구: 넉넉한 상단 여백(mt-5)으로 가독성 확보 */}
          <p className="mt-5 text-[16px] text-gray-500 font-medium">
            {loginType === 'business' ? '사업자' : '거래처'} 전용 로그인 서비스
          </p>
        </div>

        {/* 로그인 타입 전환 탭: 넉넉한 패딩과 둥근 모서리로 현대적인 느낌을 줍니다. */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setLoginType('business')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              loginType === 'business'
                ? 'bg-white shadow-md text-[#1D9E75]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            사업자 로그인
          </button>
          <button
            onClick={() => setLoginType('partner')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              loginType === 'partner'
                ? 'bg-white shadow-md text-[#1D9E75]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            거래처 로그인
          </button>
        </div>

        {/* 로그인 입력 영역: 요소 간 세로 여백(space-y-5)을 유지하여 깔끔함을 유지합니다. */}
        <div className="space-y-5">
          <div className="space-y-5">
            {/* 아이디 입력란 */}
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
                className={`block w-full px-5 py-3 rounded-2xl border transition-all outline-none bg-gray-50 focus:bg-white ${
                  errors.userId 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-400' 
                    : 'border-gray-200 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent'
                }`}
                placeholder="아이디를 입력하세요"
              />
              {errors.userId && (
                <p className="mt-1.5 ml-1 text-[12px] font-semibold text-red-500 animate-in fade-in slide-in-from-top-1">
                  {errors.userId}
                </p>
              )}
            </div>
            {/* 비밀번호 입력란 */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full px-5 py-3 rounded-2xl border transition-all outline-none bg-gray-50 focus:bg-white ${
                  errors.password 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-400' 
                    : 'border-gray-200 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent'
                }`}
                placeholder="비밀번호를 입력하세요"
              />
              {errors.password && (
                <p className="mt-1.5 ml-1 text-[12px] font-semibold text-red-500 animate-in fade-in slide-in-from-top-1">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* 로그인 옵션 및 계정 찾기: 체크박스를 세로로 배치하여 가독성을 높였습니다. */}
          <div className="flex items-center justify-between text-sm pt-2">
            {/* 체크박스 그룹: 세로 정렬(flex-col)로 변경 */}
            <div className="flex flex-col gap-3">
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
                <label htmlFor="rememberMe" className="ml-2.5 block text-gray-700 cursor-pointer select-none text-[13.5px] font-medium">
                  로그인 상태 유지
                </label>
              </div>
            </div>
            
            {/* 계정 찾기 링크: 체크박스 그룹과 수직 중앙 정렬 유지 */}
            <div className="flex items-center gap-4 font-bold text-[#158A64] text-[13.5px] whitespace-nowrap">
              <span 
                onClick={() => navigate('/find-id')}
                className="hover:text-[#0D6B50] cursor-pointer transition-colors hover:underline underline-offset-4"
              >
                아이디 찾기
              </span>
              <span className="text-gray-200 font-normal select-none">|</span>
              <span 
                onClick={() => navigate('/find-password')}
                className="hover:text-[#0D6B50] cursor-pointer transition-colors hover:underline underline-offset-4"
              >
                비밀번호 찾기
              </span>
            </div>
          </div>

          {/* 로그인 버튼: 크기와 높이를 키워 사용자 액션을 강력하게 유도합니다. */}
          <div className="pt-1">
            <button
              onClick={handleLoginSubmit}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-lg font-black rounded-2xl text-white shadow-lg transition-all transform active:scale-[0.98]"
              style={{ backgroundColor: '#1D9E75', padding: '12px' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#158A64')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1D9E75')}
            >
              로그인
            </button>
          </div>
        </div>

        {/* 하단 회원가입 유도 영역: 상단에 회색 구분선 추가 */}
        <div className="text-center pt-6 border-t border-gray-400">
          <p className="text-[15px] text-gray-500 font-medium">
            아직 SoSo 회원이 아니신가요?{' '}
            <button className="font-extrabold text-[#0D6B50] hover:underline transition-all underline-offset-4 ml-1.5">
              회원가입 하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
