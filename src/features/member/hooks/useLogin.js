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

  // 체크박스 옵션 상태 (추가됨)
  const [options, setOptions] = useState({
    rememberMe: false, // 로그인 상태 유지
  });

  /**
   * @function handleInputChange
   * @description 아이디, 비밀번호 입력 시 상태값을 업데이트합니다.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * @function handleOptionChange
   * @description 체크박스 옵션 상태를 업데이트합니다. (추가됨)
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
   * @description 로그인 폼 제출 시 실행되는 함수입니다.
   */
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log(`${loginType === 'business' ? '사업자' : '거래처'} 로그인 시도:`, { ...formData, ...options });
  };

  return {
    loginType,
    setLoginType,
    formData,
    options,
    handleInputChange,
    handleOptionChange,
    handleLoginSubmit,
  };
};
