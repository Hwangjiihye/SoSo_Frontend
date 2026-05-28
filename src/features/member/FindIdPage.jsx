import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @file FindIdPage.jsx
 * @description 사용자의 이름과 이메일을 입력받고, 이메일 인증을 통해 아이디를 찾는 페이지입니다.
 * 인증 성공 시 찾은 아이디를 보여주는 UI가 포함되어 있습니다.
 */
const FindIdPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [isVerifying, setIsVerifying] = useState(false); // 인증번호 입력 영역 노출 여부
  const [verificationCode, setVerificationCode] = useState(''); // 입력한 인증번호
  const [isFound, setIsFound] = useState(false); // 아이디 찾기 성공 여부
  const [foundId, setFoundId] = useState(''); // 찾은 아이디 (더미)

  /**
   * @function handleFindIdClick
   * @description 아이디 찾기 버튼 클릭 시 이메일 인증 영역을 표시합니다.
   */
  const handleFindIdClick = () => {
    // 실제로는 이메일 발송 API 호출
    setIsVerifying(true);
  };

  /**
   * @function handleVerifyConfirm
   * @description 인증번호 확인 버튼 클릭 시 유효성을 검사하고 결과를 표시합니다.
   */
  const handleVerifyConfirm = () => {
    // 임시 인증번호 '123456'으로 체크 (가짜 데이터)
    if (verificationCode === '123456') {
      setFoundId('soso****'); // 더미 데이터 설정
      setIsFound(true);
      setIsVerifying(false); // 인증 입력창은 닫음
    } else {
      alert('인증번호가 일치하지 않습니다. (임시 번호: 123456)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* 컨테이너: LoginPage와 동일한 520px 너비 및 스타일 적용 */}
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
          <h2 className="mt-4 text-[24px] font-extrabold text-gray-900">아이디 찾기</h2>
          <p className="mt-2 text-[15px] text-gray-500 font-medium text-center">
            {!isFound 
              ? "회원가입 시 등록한 정보를 입력해주세요." 
              : "고객님의 정보와 일치하는 아이디를 확인하세요."}
          </p>
        </div>

        {!isFound ? (
          /* 1단계: 정보 입력 및 인증 단계 */
          <div className="space-y-6 pt-2">
            {/* 이름 입력 */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                이름
              </label>
              <input
                id="name"
                type="text"
                disabled={isVerifying}
                className={`block w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none transition-all ${isVerifying ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent'}`}
                placeholder="이름을 입력하세요"
              />
            </div>

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                이메일
              </label>
              <input
                id="email"
                type="text"
                disabled={isVerifying}
                className={`block w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none transition-all ${isVerifying ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent'}`}
                placeholder="이메일을 입력하세요"
              />
            </div>

            {/* 아이디 찾기 (인증번호 발송) 버튼 */}
            <div className="pt-2">
              <button
                onClick={handleFindIdClick}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-ml font-black rounded-2xl text-white shadow-lg transition-all transform active:scale-[0.98]"
                style={{ backgroundColor: '#1D9E75' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#158A64')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1D9E75')}
              >
                {isVerifying ? '인증번호 재발송' : '아이디 찾기'}
              </button>
            </div>

            {/* 2단계: 이메일 인증 영역 */}
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
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="flex-1 px-5 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none transition-all bg-white font-bold tracking-widest"
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
                  <p className="mt-3 ml-1 text-[12px] text-gray-500 font-medium">
                    임시 인증번호는 <span className="text-[#1D9E75] font-bold">123456</span> 입니다.
                  </p>
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
          /* 3단계: 최종 결과 단계 */
          <div className="space-y-6 -mt-3 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 flex flex-col items-center justify-center">
              <p className="text-gray-500 font-bold text-[16px] mb-4">고객님의 아이디는 다음과 같습니다.</p>
              <div className="py-4 px-10 bg-white rounded-xl border border-gray-200 shadow-sm inline-block">
                <span className="text-[25px] font-black tracking-tight" style={{ color: '#1D9E75' }}>
                  {foundId}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 px-4 border border-transparent text-ml font-black rounded-2xl text-white shadow-lg transition-all transform active:scale-[0.98]"
                style={{ backgroundColor: '#1D9E75' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#158A64')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1D9E75')}
              >
                로그인하기
              </button>
              <button
                className="w-full py-2 px-4 border border-gray-200 text-ml font-black rounded-2xl text-gray-700 bg-white hover:bg-gray-100 transition-all transform active:scale-[0.98]"
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindIdPage;
