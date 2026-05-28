import { useState } from 'react';

// 정규식 정의
const REGEX = {
  ID: /^[a-zA-Z0-9]{6,20}$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
  PHONE: /^010-\d{4}-\d{4}$/,
  SSN_FRONT: /^\d{6}$/,
  SSN_BACK: /^[1-4]\d{6}$/, // 뒷자리 첫 번쨰는 1~4
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};


export const useSignUp = () => {
  const [formData, setFormData] = useState({
    userType: 'BUSINESS', // 기본값 사업자
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
    emailChecked: false, // 이메일 중복확인 추가
    bizVerified: false
  });

  const [images, setImages] = useState({ exterior: null, interior: null });
  const [terms, setTerms] = useState({
    all: false,
    service: false,
    privacy: false,
    marketing: false
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 주민번호 숫자만 입력 제한
    if ((name === 'ssnFront' || name === 'ssnBack') && !/^\d*$/.test(value)) return;
    if (name === 'ssnFront' && value.length > 6) return;
    if (name === 'ssnBack' && value.length > 7) return;

    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    // 이메일 제안 로직
    if (name === 'email') {
      
      setApiStatus(prev => ({ ...prev, emailChecked: false })); // 이메일 수정 시 중복확인 초기화
    }

    validateField(name, value, nextFormData);
  };

  const checkDuplicate = async (field) => {
    if (errors[field] || !formData[field]) {
      alert('올바른 값을 입력한 후 중복확인을 해주세요.');
      return;
    }
    console.log(`${field} 중복 확인 요청`);
    await new Promise(r => setTimeout(r, 500));
    setApiStatus(prev => ({ ...prev, [`${field}Checked`]: true }));
    alert(`${field === 'email' ? '이메일' : field} 사용 가능합니다.`);
  };

  const verifyBusiness = async () => {
    if (!formData.bizNo || !formData.repName || !formData.openDate || !formData.corpName) {
      alert('사업자 정보를 모두 입력해 주세요.');
      return;
    }
    await new Promise(r => setTimeout(r, 800));
    setApiStatus(prev => ({ ...prev, bizVerified: true }));
    alert('사업자 정보가 확인되었습니다.');
  };

  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData(prev => ({ ...prev, zipCode: data.zonecode, address: data.roadAddress }));
      }
    }).open();
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return alert('10MB 이하 파일만 가능합니다.');
    if (!['image/jpeg', 'image/png'].includes(file.type)) return alert('JPG/PNG 파일만 가능합니다.');
    setImages(prev => ({ ...prev, [type]: file }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('회원가입 데이터 전송:', { ...formData, images, terms });
    alert(`${formData.userType === 'BUSINESS' ? '사업자' : '거래처'} 회원가입 요청이 완료되었습니다.`);
  };



  return {
    formData, errors, apiStatus, images, terms,
    handleChange, checkDuplicate, verifyBusiness, searchAddress,
    handleFileChange, handleTermsChange, handleSubmit
  };
};
