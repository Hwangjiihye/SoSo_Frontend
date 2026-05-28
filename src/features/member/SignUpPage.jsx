import React from 'react';
import { useSignUp } from './hooks/useSignUp';

const SignUpPage = () => {
  const {
    formData, errors, apiStatus, emailSuggestions, images, terms,
    handleChange, checkDuplicate, verifyBusiness, searchAddress,
    handleFileChange, handleTermsChange, selectEmailSuggestion
  } = useSignUp();

  const sectionStyle = "bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4";
  const labelStyle = "block text-sm font-bold text-gray-700 mb-1";
  const inputStyle = "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const btnActionStyle = "px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors whitespace-nowrap";
  const errorStyle = "text-xs text-red-500 mt-1";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">회원가입</h1>
          <p className="text-gray-500 mt-2">서비스 이용을 위해 정보를 입력해주세요.</p>
        </header>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* 계정 정보 */}
          <section className={sectionStyle}>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">계정 정보</h2>
            
            <div>
              <label className={labelStyle}>아이디</label>
              <div className="flex gap-2">
                <input name="userId" value={formData.userId} onChange={handleChange} className={inputStyle} placeholder="영문, 숫자 6~20자" />
                <button type="button" onClick={() => checkDuplicate('userId')} className={btnActionStyle}>중복확인</button>
              </div>
              {errors.userId && <p className={errorStyle}>{errors.userId}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>비밀번호</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputStyle} placeholder="영문+숫자+특수문자 8자↑" />
                {errors.password && <p className={errorStyle}>{errors.password}</p>}
              </div>
              <div>
                <label className={labelStyle}>비밀번호 재확인</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputStyle} />
                {errors.confirmPassword && <p className={errorStyle}>{errors.confirmPassword}</p>}
              </div>
            </div>
          </section>

          {/* 인적 사항 */}
          <section className={sectionStyle}>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">인적 사항</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>이름 (실명)</label>
                <input name="name" value={formData.name} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>닉네임</label>
                <div className="flex gap-2">
                  <input name="nickname" value={formData.nickname} onChange={handleChange} className={inputStyle} />
                  <button type="button" onClick={() => checkDuplicate('nickname')} className={btnActionStyle}>중복확인</button>
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>휴대전화</label>
              <div className="flex gap-2">
                <input name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} placeholder="010-XXXX-XXXX" />
                <button type="button" onClick={() => checkDuplicate('phone')} className={btnActionStyle}>중복확인</button>
              </div>
              {errors.phone && <p className={errorStyle}>{errors.phone}</p>}
            </div>

            <div>
              <label className={labelStyle}>주민등록번호 앞 7자리</label>
              <input name="ssn" value={formData.ssn} onChange={handleChange} className={inputStyle} placeholder="YYMMDD-G" />
              {errors.ssn && <p className={errorStyle}>{errors.ssn}</p>}
            </div>

            <div className="relative">
              <label className={labelStyle}>이메일</label>
              <input name="email" value={formData.email} onChange={handleChange} className={inputStyle} placeholder="example@gmail.com" />
              {emailSuggestions.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 overflow-hidden">
                  {emailSuggestions.map((s) => (
                    <li key={s} onClick={() => selectEmailSuggestion(s)} className="p-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b last:border-0">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              {errors.email && <p className={errorStyle}>{errors.email}</p>}
            </div>
          </section>

          {/* 사업자 정보 */}
          <section className={sectionStyle}>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">사업자 정보 확인</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>사업자번호</label>
                <input name="bizNo" value={formData.bizNo} onChange={handleChange} className={inputStyle} placeholder="000-00-00000" />
              </div>
              <div>
                <label className={labelStyle}>대표자명</label>
                <input name="repName" value={formData.repName} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>개업일자</label>
                <input type="date" name="openDate" value={formData.openDate} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>상호명</label>
                <input name="corpName" value={formData.corpName} onChange={handleChange} className={inputStyle} />
              </div>
            </div>
            <button type="button" onClick={verifyBusiness} className={`w-full py-3 rounded-lg font-bold transition-all ${apiStatus.bizVerified ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              {apiStatus.bizVerified ? '사업자 인증 완료 ✓' : '국세청 사업자 진위 확인'}
            </button>
          </section>

          {/* 주소 및 사진 */}
          <section className={sectionStyle}>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">가게 상세 정보</h2>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input name="zipCode" value={formData.zipCode} readOnly className={`${inputStyle} bg-gray-100`} placeholder="우편번호" />
                <button type="button" onClick={searchAddress} className={btnActionStyle}>주소검색</button>
              </div>
              <input name="address" value={formData.address} readOnly className={`${inputStyle} bg-gray-100`} placeholder="도로명 주소" />
              <input name="detailAddress" value={formData.detailAddress} onChange={handleChange} className={inputStyle} placeholder="상세주소 입력" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-500">가게 외부 사진</span>
                <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                  <input type="file" onChange={(e) => handleFileChange(e, 'exterior')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/jpeg,image/png" />
                  <span className="text-xs text-blue-600">{images.exterior ? images.exterior.name : '파일 선택 (JPG/PNG)'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-500">가게 내부 사진</span>
                <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                  <input type="file" onChange={(e) => handleFileChange(e, 'interior')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/jpeg,image/png" />
                  <span className="text-xs text-blue-600">{images.interior ? images.interior.name : '파일 선택 (JPG/PNG)'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 약관 동ify */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" checked={terms.all} onChange={() => handleTermsChange('all')} id="all" className="w-5 h-5 accent-blue-600 cursor-pointer" />
              <label htmlFor="all" className="font-bold text-gray-800 cursor-pointer">전체 약관에 동의합니다</label>
            </div>
            <div className="space-y-3 px-3">
              {[
                { id: 'service', label: '[필수] 서비스 이용약관 동의' },
                { id: 'privacy', label: '[필수] 개인정보 수집 및 이용 동의' },
                { id: 'marketing', label: '[선택] 마케팅 정보 활용 동의' }
              ].map((term) => (
                <div key={term.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={terms[term.id]} onChange={() => handleTermsChange(term.id)} id={term.id} className="accent-blue-600" />
                    <label htmlFor={term.id} className="text-gray-600">{term.label}</label>
                  </div>
                  <button type="button" className="text-gray-400 underline text-xs">보기</button>
                </div>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={!terms.service || !terms.privacy || !apiStatus.bizVerified}
            className="w-full py-4 bg-gray-900 text-white rounded-xl text-lg font-bold hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
          >
            회원가입 요청하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
