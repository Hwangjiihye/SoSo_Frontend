import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusinessProfileApi, updateBusinessProfileApi, changePasswordApi, checkBusinessApi } from '../../../apis/memberApi';
import authStore from '../../../store/authStore';

/**
 * 정규식 정의
 */
const REGEX = {
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
  PHONE: /^010-\d{4}-\d{4}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

/**
 * @file useBusinessUpdate.js
 * @description 사업자 정보 수정을 위한 커스텀 훅
 */
export const useBusinessUpdate = () => {
  const navigate = useNavigate();
  const { login, logout, selectedStoreSeq, setSelectedStore } = authStore(); // 🏪 [멀티 프로필] 현재 선택된 매장 번호 가져오기
  
  // 사업자 정보 폼 상태
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    email: '',
    bizNumber: '',
    bizname: '',
    ceoName: '', // 대표자명 (인증용 실명)
    zonecode: '', // 📮 우편번호 추가
    address1: '',
    address2: '',
    openingDate: '',
    exteriorImg: null, 
    interiorImg: null, 
    exteriorPreview: null,
    interiorPreview: null,
  });

  // 🏪 [멀티 프로필] 사업자 인증 상태 관리
  // 수정 페이지 진입 시에는 이미 인증된 정보이므로 true로 시작합니다.
  const [isBizVerified, setIsBizVerified] = useState(true);

  // 비밀번호 변경 폼 상태
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 에러 메시지 상태
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        
        setIsLoading(true);
        // 💡 [수정] 현재 헤더 등에서 선택된 매장(selectedStoreSeq) 정보를 가져옵니다.
        const result = await getBusinessProfileApi(selectedStoreSeq);
        
        const sysNamesArray = result?.profileImageUrl ? result.profileImageUrl.split(',') : [];
        const storeImg1 = sysNamesArray[0]
          ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[0]}`
          : null;
        const storeImg2 = sysNamesArray[1]
          ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[1]}`
          : null;

        setFormData(prev => ({
          ...prev,
          nickname: result.nickname,
          phone: result.phone,
          email: result.email,
          bizNumber: result.bizNumber,
          bizname: result.companyName,
          ceoName: result.ceoName, // 대표자명 로드
          zonecode: result.zonecode, // 📮 우편번호 로드
          openingDate: result.openingDate?.split('T')[0],
          address1: result.address1,
          address2: result.address2,
          exteriorPreview: storeImg1,
          interiorPreview: storeImg2,
          userId: result.userId // ID는 표시용
        }));

        // 데이터 로드 후 인증 상태 유지
        setIsBizVerified(true);
      } catch (err) {
        console.error('사업자 데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedStoreSeq]); // 💡 [추가] 선택된 매장이 바뀌면 수정 페이지 데이터도 다시 불러옵니다.

  /**
   * 유효성 검사
   */
  const validateField = (name, value) => {
    let error = '';
    if (name === 'phone' && value && !REGEX.PHONE.test(value)) {
      error = '010-XXXX-XXXX 형식으로 입력해주세요.';
    } else if (name === 'email' && value && !REGEX.EMAIL.test(value)) {
      error = '올바른 이메일 형식이 아닙니다.';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validatePasswordField = (name, value, currentPasswordForm = passwordForm) => {
    let error = '';
    if (name === 'newPassword' && value && !REGEX.PASSWORD.test(value)) {
      error = '8자 이상, 영문+숫자+특수문자 조합이어야 합니다.';
    } else if (name === 'confirmPassword' && value !== currentPasswordForm.newPassword) {
      error = '비밀번호가 일치하지 않습니다.';
    }
    setPasswordErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let finalValue = value;
    if (name === 'phone') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      finalValue = numbersOnly;
      if (numbersOnly.length > 3 && numbersOnly.length <= 7) {
        finalValue = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      } else if (numbersOnly.length > 7) {
        finalValue = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
      }
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    validateField(name, finalValue);

    // 💡 사업자 인증 관련 필드(번호, 상호, 대표자, 개업일)가 바뀌면 재인증 필요
    if (['bizNumber', 'bizname', 'ceoName', 'openingDate'].includes(name)) {
      setIsBizVerified(false);
    }
  };

  /**
   * 🛡️ 사업자 실명 인증 (국세청 API 연동)
   */
  const handleVerifyBusiness = async () => {
    const { bizNumber, openingDate, ceoName, bizname } = formData;
    
    if (!bizNumber || !openingDate || !ceoName) {
      alert("인증을 위해 사업자번호, 개업일자, 대표자명을 모두 입력해주세요.");
      return;
    }

    try {
      // API 호출 시 파라미터 규격에 맞게 정제 (날짜에서 하이픈 제거 등)
      const cleanDate = openingDate.replaceAll("-", "");
      // [수정] 정보 수정 시에도 중복 체크를 생략하도록 true를 전달합니다.
      const result = await checkBusinessApi(bizNumber, cleanDate, ceoName, bizname, true);
      
      if (result) {
        alert("✅ 사업자 인증에 성공하였습니다.");
        setIsBizVerified(true);
      } else {
        alert("❌ 인증 실패: 입력하신 정보가 국세청 데이터와 일치하지 않습니다.");
        setIsBizVerified(false);
      }
    } catch (error) {
      console.error("사업자 인증 중 오류:", error);
      alert("인증 서버와 통신 중 오류가 발생했습니다.");
    }


  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...passwordForm, [name]: value };
    setPasswordForm(nextForm);
    validatePasswordField(name, value, nextForm);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [`${type}Img`]: file,
          [`${type}Preview`]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 이용할 수 없습니다.');
      return;
    }
    
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 📮 우편번호와 기본 주소(도로명 or 지번)를 폼 상태에 저장합니다.
        setFormData(prev => ({
          ...prev,
          zonecode: data.zonecode,
          address1: data.roadAddress || data.jibunAddress,
        }));
      },
    }).open();
  };

  // 사업자 정보 저장
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.nickname || !formData.phone || !formData.email || !formData.bizname) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    if (errors.phone || errors.email) {
      alert('입력 형식이 올바르지 않은 항목이 있습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        nickname: formData.nickname,
        phone: formData.phone,
        email: formData.email,
        companyName: formData.bizname,
        ceoName: formData.ceoName,   // 👤 대표자명 포함
        bizNumber: formData.bizNumber,
        zonecode: formData.zonecode, // 📮 우편번호 포함
        address1: formData.address1,
        address2: formData.address2,
        openingDate: formData.openingDate,
        storeSeq: selectedStoreSeq,  // 🏪 [멀티 프로필] 수정을 원하는 매장 번호를 정확히 전달!
      };

      // 💡 파일이 진짜 있을 때만 넘기고, 없으면 undefined나 null 처리가 문자열 "null"로 가지 않도록 방어 코드 작성
      const exteriorFile = formData.exteriorImg instanceof File ? formData.exteriorImg : null;
      const interiorFile = formData.interiorImg instanceof File ? formData.interiorImg : null;

      const result = await updateBusinessProfileApi(
        updateData, 
        exteriorFile, 
        interiorFile
      );
      
      if (result && result.status === 'success') {
        alert('정보가 성공적으로 수정되었습니다.');
        
        // 🔄 전역 상태(Zustand)와 동기화
        // 현재 선택된 매장 정보가 바뀌었으므로 setSelectedStore를 통해 헤더 등 표시 업데이트
        setSelectedStore(selectedStoreSeq, formData.bizname);

        navigate('/business-mypage');
      } else {
        alert(result?.message || '수정 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('사업자 정보 수정 실패:', err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 비밀번호 변경 저장
  const handlePasswordSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('비밀번호 정보를 모두 입력해주세요.');
      return false;
    }

    if (passwordErrors.newPassword || passwordErrors.confirmPassword) {
      alert('비밀번호 형식이 올바르지 않거나 일치하지 않습니다.');
      return false;
    }

    setIsPasswordSubmitting(true);
    try {
      const result = await changePasswordApi({ currentPassword, newPassword });
      if (result && result.status === 'success') {
        alert('비밀번호가 성공적으로 변경되었습니다. 안전한 이용을 위해 다시 로그인해 주세요.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
        
        // 로그아웃 후 로그인 페이지로 이동
        logout();
        navigate('/login');
        
        return true;
      } else {
        alert(result.message);
        return false;
      }
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return {
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
    handleAddressSearch,
    handleSubmit,
    handlePasswordSubmit,
    handleVerifyBusiness,
    isBizVerified
  };
};
