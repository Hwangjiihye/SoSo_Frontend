import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusinessProfileApi, updateBusinessProfileApi, changePasswordApi } from '../../../apis/memberApi';
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
  const { login } = authStore();
  
  // 사업자 정보 폼 상태
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    email: '',
    bizNumber: '',
    bizname: '',
    address1: '',
    address2: '',
    openingDate: '',
    exteriorImg: null, 
    interiorImg: null, 
    exteriorPreview: null,
    interiorPreview: null,
  });

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
        const result = await getBusinessProfileApi();
        
        const sysNamesArray = result?.storeSysNames ? result.storeSysNames.split(',') : [];
        const storeImg1 = sysNamesArray[0]
          ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[0]}`
          : null;
        const storeImg2 = sysNamesArray[1]
          ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[1]}`
          : null;

        setFormData(prev => ({
          ...prev,
          nickname: result.user_nickname,
          phone: result.phone,
          email: result.email,
          bizNumber: result.bizNumber,
          bizname: result.bizname,
          openingDate: result.openingDate?.split('T')[0],
          address1: result.address1,
          address2: result.address2,
          exteriorPreview: storeImg1,
          interiorPreview: storeImg2,
          userId: result.userId // ID는 표시용
        }));
      } catch (err) {
        console.error('사업자 데이터 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

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
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
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
        setFormData(prev => ({
          ...prev,
          address1: data.roadAddress,
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
        user_nickname: formData.nickname,
        phone: formData.phone,
        email: formData.email,
        bizname: formData.bizname,
        bizNumber: formData.bizNumber,
        address1: formData.address1,
        address2: formData.address2,
        openingDate: formData.openingDate,
      };

      const result = await updateBusinessProfileApi(
        updateData, 
        formData.exteriorImg, 
        formData.interiorImg
      );
      
      if (result && result.status === 'success') {
        alert('정보가 성공적으로 수정되었습니다.');
        
        // 전역 상태 동기화 (헤더 반영)
        const currentStore = authStore.getState();
        login({
          ...currentStore,
          user_nickname: formData.nickname,
          bizname: formData.bizname
        });

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
        alert(result.message);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
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
  };
};
