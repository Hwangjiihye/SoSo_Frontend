import { useState } from 'react';

/**
 * @hook useLogin
 * @description 로그인 페이지의 비즈니스 로직(상태 관리, 이벤트 핸들러)을 UI와 분리하여 관리하는 커스텀 훅입니다.
 */
export const useLogin = () => {
  // 로그인 대상 선택 상태 ('business': 사업자, 'partner': 거래처)
  const [loginType, setLoginType] = useState('business'); 

  // 입력 필드 데이터 상태
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
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
   * @function handleLoginSubmit
   * @description 로그인 폼 제출 시 실행되는 함수입니다. (추후 API 연동 예정)
   */
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log(`${loginType === 'business' ? '사업자' : '거래처'} 로그인 시도:`, formData);
  };

  return {
    loginType,
    setLoginType,
    formData,
    handleInputChange,
    handleLoginSubmit,
  };
};
