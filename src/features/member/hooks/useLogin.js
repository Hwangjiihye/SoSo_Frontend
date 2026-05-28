import { useState } from 'react';

/**
 * @hook useLogin
 * @description 로그인 페이지의 비즈니스 로직을 관리하는 커스텀 훅입니다.
 */
export const useLogin = () => {
  // 로그인 대상 선택 상태
  const [loginType, setLoginType] = useState('business'); 

  // 입력 필드 데이터 상태
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  // 에러 메시지 상태
  const [errors, setErrors] = useState({
    userId: '',
    password: '',
  });

  // 체크박스 옵션 상태
  const [options, setOptions] = useState({
    rememberMe: false, // 로그인 상태 유지
  });

  /**
   * @function handleInputChange
   * @description 아이디, 비밀번호 입력 시 상태값을 업데이트하고 해당 필드의 에러를 초기화합니다.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 입력이 시작되면 해당 필드의 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * @function handleOptionChange
   * @description 체크박스 옵션 상태를 업데이트합니다.
   */
  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  /**
   * @function handleLoginSubmit
   * @description 로그인 시도 시 유효성 검사 후 데이터를 제출합니다.
   */
  const handleLoginSubmit = (e) => {
    e?.preventDefault();

    let newErrors = { userId: '', password: '' };
    let hasError = false;

    // 유효성 검사: 아이디 미입력 시
    if (!formData.userId.trim()) {
      newErrors.userId = '아이디를 입력해주세요.';
      hasError = true;
    }

    // 유효성 검사: 비밀번호 미입력 시
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    console.log(`${loginType === 'business' ? '사업자' : '거래처'} 로그인 시도:`, { ...formData, ...options });
    // 실제 로그인 처리 로직(API 호출 등)이 이곳에 추가될 예정입니다.
  };

  return {
    loginType,
    setLoginType,
    formData,
    errors,
    options,
    handleInputChange,
    handleOptionChange,
    handleLoginSubmit,
  };
};
