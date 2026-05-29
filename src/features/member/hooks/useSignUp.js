import { useState } from 'react';
import { checkIdApi, checkNicknameApi, checkEmailApi, signUpApi,checkBusinessApi } from '../../../apis/memberApi';


/**
 * @file useSignUp.js
 * @description 회원가입 비즈니스 로직 및 API 통신 제어 커스텀 훅 (Strict Logic Isolation)
 */

const REGEX = {
  ID: /^[a-zA-Z0-9]{6,20}$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
  PHONE: /^010-\d{4}-\d{4}$/,
  SSN_FRONT: /^\d{6}$/,
  SSN_BACK: /^[1-4]\d{6}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

export const useSignUp = () => {
  const [formData, setFormData] = useState({
    userType: 'BUSINESS',
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    name: '',
    phone: '',
    ssnFront: '',
    ssnBack: '',
    email: '',
    bizNo: '',
    repName: '',
    openDate: '',
    corpName: '',
    zipCode: '',
    address: '',
    detailAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [apiStatus, setApiStatus] = useState({
    idChecked: false,
    nicknameChecked: false,
    emailChecked: false,
    bizVerified: false
  });

  const [images, setImages] = useState({ exterior: null, interior: null });
  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false
  });

  /**
   * 필드 유효성 검사
   */
  const validateField = (name, value, currentFormData = formData) => {
    let error = '';
    switch (name) {
      case 'userId':
        if (!REGEX.ID.test(value)) error = '영문, 숫자 조합 6~20자로 입력해주세요.';
        break;
      case 'password':
        if (!REGEX.PASSWORD.test(value)) error = '8자 이상, 영문+숫자+특수문자 조합이어야 합니다.';
        break;
      case 'confirmPassword':
        if (value !== currentFormData.password) error = '비밀번호가 일치하지 않습니다.';
        break;
      case 'phone':
        if (!REGEX.PHONE.test(value)) error = '010-XXXX-XXXX 형식으로 입력해주세요.';
        break;
      case 'ssnFront':
        if (!REGEX.SSN_FRONT.test(value)) error = '생년월일 6자리를 입력해주세요.';
        break;
      case 'ssnBack':
        if (!REGEX.SSN_BACK.test(value)) error = '뒷자리 형식이 올바르지 않습니다.';
        break;
      case 'email':
        if (!REGEX.EMAIL.test(value)) error = '올바른 이메일 형식이 아닙니다.';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  /**
   * 입력값 변경 핸들러
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 숫자 제한 로직 (주민번호)
    if ((name === 'ssnFront' || name === 'ssnBack') && !/^\d*$/.test(value)) return;
    if (name === 'ssnFront' && value.length > 6) return;
    if (name === 'ssnBack' && value.length > 7) return;

    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    // 중복 확인 상태 초기화 (입력값 변경 시 재인증 필요)
    if (['userId', 'nickname', 'email'].includes(name)) {
      setApiStatus(prev => ({ ...prev, [`${name}Checked`]: false }));
    }

    validateField(name, value, nextFormData);
  };

  /**
   * 중복 확인 API 호출
   */
  const checkDuplicate = async (field) => {
    if (errors[field] || !formData[field]) {
      alert('올바른 값을 입력한 후 중복확인을 해주세요.');
      return;
    }

    try {
      let response;
      if (field === 'userId') response = await checkIdApi(formData.userId);
      else if (field === 'nickname') response = await checkNicknameApi(formData.nickname);
      else if (field === 'email') response = await checkEmailApi(formData.email);

      if (response && !response.isDuplicated) {
        setApiStatus(prev => ({ ...prev, [`${field}Checked`]: true }));
        alert(response.message);
      } else {
        setApiStatus(prev => ({ ...prev, [`${field}Checked`]: false }));
        alert(response?.message || '이미 사용 중입니다.');
      }
    } catch (error) {
      console.error(`${field} 중복 확인 오류:`, error);
      alert('중복 확인 중 오류가 발생했습니다.');
    }
  };

  /**
   * 사업자 진위 확인 API 호출
   */
  const verifyBusiness = async () => {
    const { bizNo, openDate, repName, corpName } = formData;
    
    if (!bizNo || !openDate || !repName || !corpName) {
      alert('사업자 정보를 모두 입력해 주세요.');
      return;
    }

    try {
      // YYYY-MM-DD -> YYYYMMDD 형식으로 변환 (백엔드 요구사항에 맞춤)
      const formattedDate = openDate.replace(/-/g, '');
      
      const message = await checkBusinessApi(bizNo, formattedDate, repName, corpName);
      
      setApiStatus(prev => ({ ...prev, bizVerified: true }));
      alert(message || '사업자 인증이 완료되었습니다.');
    } catch (error) {
      console.error('사업자 인증 오류:', error);
      setApiStatus(prev => ({ ...prev, bizVerified: false }));
      const errorMsg = error.response?.data || '사업자 정보가 일치하지 않거나 오류가 발생했습니다.';
      alert(errorMsg);
    }
  };

  /**
   * 주소 검색 (Daum Postcode)
   */
  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData(prev => ({ ...prev, zipCode: data.zonecode, address: data.roadAddress }));
      }
    }).open();
  };

  /**
   * 파일 변경 핸들러
   */
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return alert('10MB 이하 파일만 가능합니다.');
    if (!['image/jpeg', 'image/png'].includes(file.type)) return alert('JPG/PNG 파일만 가능합니다.');
    setImages(prev => ({ ...prev, [type]: file }));
  };

  /**
   * 약관 동의 변경 핸들러
   */
  const handleTermsChange = (name) => {
    if (name === 'all') {
      const nextVal = !terms.all;
      setTerms({ all: nextVal, service: nextVal, privacy: nextVal, marketing: nextVal });
    } else {
      setTerms(prev => {
        const next = { ...prev, [name]: !prev[name] };
        next.all = next.service && next.privacy && next.marketing;
        return next;
      });
    }
  };

  /**
   * 회원가입 제출 핸들러
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 최종 검증
    if (!apiStatus.idChecked || !apiStatus.nicknameChecked || !apiStatus.emailChecked) {
      return alert('아이디, 닉네임, 이메일 중복 확인을 모두 완료해주세요.');
    }

    if (!apiStatus.bizVerified) {
      return alert('사업자 인증을 완료해주세요.');
    }

    if (!terms.service || !terms.privacy) {
      return alert('필수 약관에 동의해주세요.');
    }

    try {
      const result = await signUpApi(formData, images.exterior, images.interior);
      if (result.status === 'success') {
        alert(result.message);
        // TODO: 로그인 페이지 이동 등 후속 처리
      } else {
        alert(result.message || '회원가입 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      const errorMsg = error.response?.data?.message || '회원가입 요청 중 오류가 발생했습니다.';
      alert(errorMsg);
    }
  };

  return {
    formData, errors, apiStatus, images, terms,
    handleChange, checkDuplicate, verifyBusiness, searchAddress,
    handleFileChange, handleTermsChange, handleSubmit
  };
};
