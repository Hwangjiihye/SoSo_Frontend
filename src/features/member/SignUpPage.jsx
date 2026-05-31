import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from './hooks/useSignUp';
import logo from '../../assets/soso로고.png';

const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    formData, errors, apiStatus, images, previews, terms,
    handleChange, checkDuplicate, verifyBusiness, searchAddress,
    handleFileChange, handleTermsChange, handleSubmit
  } = useSignUp();

  const sectionStyle = "bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4";
  const labelStyle = "block text-sm font-bold text-gray-700 mb-1";
  const inputStyle = "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#1D9E75] outline-none transition-all";
  const btnActionStyle = "px-4 py-2 bg-[#1D9E75] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors whitespace-nowrap";
  const errorStyle = "text-xs text-red-500 mt-1";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 상단 로고 (클릭 시 메인 이동 - GuestMain 스타일 통일) */}
        <div 
          className="flex items-center justify-center gap-1 cursor-pointer group mb-4" 
          onClick={() => navigate('/')}
        >
          <img
            src={logo}
            alt="SoSo Logo"
            className="w-12 h-12 object-contain relative top-[5px] group-hover:scale-105 transition-transform"
          />
          <div className="text-[40px] font-black text-[#1d9e75] tracking-tighter leading-none">
            SoSo
          </div>
        </div>

        <div className="space-y-6">
          {/* 회원 유형 선택 */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'userType', value: 'BUSINESS' } })}
              className={`p-4 rounded-xl border-2 transition-all text-center space-y-2 ${
                formData.userType === 'BUSINESS'
                  ? 'border-[#1D9E75] bg-[#1D9E75]/5 text-[#1D9E75]'
                  : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl">🏢</div>
              <div className="font-bold">사업자 회원</div>
            </button>
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'userType', value: 'PARTNER' } })}
              className={`p-4 rounded-xl border-2 transition-all text-center space-y-2 ${
                formData.userType === 'PARTNER'
                  ? 'border-[#1D9E75] bg-[#1D9E75]/5 text-[#1D9E75]'
                  : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl">🤝</div>
              <div className="font-bold">거래처 회원</div>
            </button>
          </div>

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
              <input name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} placeholder="010-XXXX-XXXX" />
              {errors.phone && <p className={errorStyle}>{errors.phone}</p>}
            </div>

            <div>
              <label className={labelStyle}>주민등록번호</label>
              <div className="flex items-center gap-2">
                <input name="ssnFront" value={formData.ssnFront} onChange={handleChange} className={inputStyle} placeholder="앞 6자리" maxLength={6} />
                <span className="text-gray-400">-</span>
                <input type="password" name="ssnBack" value={formData.ssnBack} onChange={handleChange} className={inputStyle} placeholder="뒤 7자리" maxLength={7} />
              </div>
              {(errors.ssnFront || errors.ssnBack) && <p className={errorStyle}>{errors.ssnFront || errors.ssnBack}</p>}
            </div>

            <div className="relative">
              <label className={labelStyle}>이메일</label>
              <div className="flex gap-2">
                <input name="email" value={formData.email} onChange={handleChange} className={inputStyle} placeholder="example@gmail.com" />
                <button type="button" onClick={() => checkDuplicate('email')} className={btnActionStyle}>중복확인</button>
              </div>
             
              {errors.email && <p className={errorStyle}>{errors.email}</p>}
            </div>
          </section>

          {/* 사업자 정보 */}
          <section className={sectionStyle}>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
              {formData.userType === 'BUSINESS' ? '사업자 정보 확인' : '거래처 정보 확인'}
            </h2>
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
            <button type="button" onClick={verifyBusiness} className={`w-full py-3 rounded-lg font-bold transition-all ${apiStatus.bizVerified ? 'bg-green-50 text-[#1D9E75] border border-[#1D9E75]/20' : 'bg-[#1D9E75] text-white hover:opacity-90'}`}>
              {apiStatus.bizVerified ? (formData.userType === 'BUSINESS' ? '사업자 인증 완료 ✓' : '거래처 인증 완료 ✓') : '국세청 사업자 진위 확인'}
            </button>
          </section>

          {/* 주소 및 사진 */}
          <section className={sectionStyle}>
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2">
              {formData.userType === 'BUSINESS' ? '가게 상세 정보' : '영업소 상세 정보'}
            </h2>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input name="zipCode" value={formData.zipCode} readOnly className={`${inputStyle} bg-gray-100`} placeholder="우편번호" />
                <button type="button" onClick={searchAddress} className={btnActionStyle}>주소검색</button>
              </div>
              <input name="address" value={formData.address} readOnly className={`${inputStyle} bg-gray-100`} placeholder="도로명 주소" />
              <input name="detailAddress" value={formData.detailAddress} onChange={handleChange} className={inputStyle} placeholder="상세주소 입력" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-500">
                  {formData.userType === 'BUSINESS' ? '가게 외부 사진' : '영업소 전경 사진'}
                </span>
                <div className="relative border-2 border-dashed border-gray-200 rounded-lg h-40 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-all">
                  <input type="file" onChange={(e) => handleFileChange(e, 'exterior')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/jpeg,image/png" />
                  {previews.exterior ? (
                    <img src={previews.exterior} alt="Exterior Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl mb-1">📸</div>
                      <span className="text-xs text-[#1D9E75] font-medium">파일 선택 (JPG/PNG)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-500">
                  {formData.userType === 'BUSINESS' ? '가게 내부 사진' : '영업소 내부 사진'}
                </span>
                <div className="relative border-2 border-dashed border-gray-200 rounded-lg h-40 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-all">
                  <input type="file" onChange={(e) => handleFileChange(e, 'interior')} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/jpeg,image/png" />
                  {previews.interior ? (
                    <img src={previews.interior} alt="Interior Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl mb-1">📸</div>
                      <span className="text-xs text-[#1D9E75] font-medium">파일 선택 (JPG/PNG)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 약관 동의 */}
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" checked={terms.all} onChange={() => handleTermsChange('all')} id="all" className="w-5 h-5 accent-[#1D9E75] cursor-pointer" />
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
                    <input type="checkbox" checked={terms[term.id]} onChange={() => handleTermsChange(term.id)} id={term.id} className="accent-[#1D9E75]" />
                    <label htmlFor={term.id} className="text-gray-600">{term.label}</label>
                  </div>
                  <button type="button" className="text-gray-400 underline text-xs">보기</button>
                </div>
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !terms.service || 
              !terms.privacy || 
              !apiStatus.bizVerified || 
              !apiStatus.userIdChecked || 
              !apiStatus.nicknameChecked || 
              !apiStatus.emailChecked
            }
            className="w-full py-4 bg-[#1D9E75] text-white rounded-xl text-lg font-bold hover:opacity-90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
          >
            {formData.userType === 'BUSINESS' ? '사업자 회원가입' : '거래처 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
