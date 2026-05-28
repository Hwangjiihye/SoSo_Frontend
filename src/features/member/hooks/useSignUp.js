import { useState, useCallback } from 'react';

// 정규식 정의
const REGEX = {
  ID: /^[a-zA-Z0-9]{6,20}$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
  PHONE: /^010-\d{4}-\d{4}$/,
  SSN: /^\d{6}-[1-4]$/, // 앞 6자리 + 뒤 1자리
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

const EMAIL_DOMAINS = ['@gmail.com', '@naver.com', '@daum.net', '@kakao.com', '@outlook.com'];

export const useSignUp = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    name: '',
    phone: '',
    ssn: '',
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
    phoneChecked: false,
    emailChecked: false,
    bizVerified: false
  });

  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [images, setImages] = useState({ exterior: null, interior: null });
  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false
  });

  // 입력 필드 유효성 검사
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'userId':
        if (!REGEX.ID.test(value)) error = '영문, 숫자 조합 6~20자로 입력해주세요.';
        break;
      case 'password':
        if (!REGEX.PASSWORD.test(value)) error = '8자 이상, 영문+숫자+특수문자 조합이어야 합니다.';
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = '비밀번호가 일치하지 않습니다.';
        break;
      case 'phone':
        if (!REGEX.PHONE.test(value)) error = '010-XXXX-XXXX 형식으로 입력해주세요.';
        break;
      case 'ssn':
        if (!REGEX.SSN.test(value)) error = '앞 6자리 + 뒤 1자리 형식이 아닙니다.';
        break;
      case 'email':
        if (!REGEX.EMAIL.test(value)) error = '올바른 이메일 형식이 아닙니다.';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 이메일 제안 로직
    if (name === 'email') {
      if (value.includes('@') || value.length === 0) {
        setEmailSuggestions([]);
      } else {
        setEmailSuggestions(EMAIL_DOMAINS.map(domain => value + domain));
      }
    }

    validateField(name, value);
  };

  // 중복 확인 모사
  const checkDuplicate = async (field) => {
    console.log(`${field} 중복 확인 요청`);
    await new Promise(r => setTimeout(r, 500));
    setApiStatus(prev => ({ ...prev, [`${field}Checked`]: true }));
    alert(`${field} 사용 가능합니다.`);
  };

  // 사업자 진위 확인 모사
  const verifyBusiness = async () => {
    if (!formData.bizNo || !formData.repName || !formData.openDate || !formData.corpName) {
      alert('사업자 정보를 모두 입력해 주세요.');
      return;
    }
    console.log('국세청 API 호출 중...');
    await new Promise(r => setTimeout(r, 1000));
    setApiStatus(prev => ({ ...prev, bizVerified: true }));
    alert('사업자 정보가 확인되었습니다.');
  };

  // 주소 검색 (카카오)
  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData(prev => ({
          ...prev,
          zipCode: data.zonecode,
          address: data.roadAddress
        }));
      }
    }).open();
  };

  // 파일 업로드
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 이하의 파일만 가능합니다.');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('JPG/PNG 파일만 업로드 가능합니다.');
      return;
    }

    setImages(prev => ({ ...prev, [type]: file }));
  };

  // 약관 동의
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

  const selectEmailSuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, email: suggestion }));
    setEmailSuggestions([]);
    validateField('email', suggestion);
  };

  return {
    formData, errors, apiStatus, emailSuggestions, images, terms,
    handleChange, checkDuplicate, verifyBusiness, searchAddress,
    handleFileChange, handleTermsChange, selectEmailSuggestion
  };
};
