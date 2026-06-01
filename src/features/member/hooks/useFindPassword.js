import { useState } from 'react';

/**
 * @hook useFindPassword
 * @description 비밀번호 찾기 및 재설정 페이지의 비즈니스 로직을 관리하는 커스텀 훅입니다.
 */
export const useFindPassword = () => {
  // 입력 필드 데이터 상태
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 에러 메시지 상태
  const [errors, setErrors] = useState({
    userId: '',
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 단계 및 상태 관리
  const [isVerifying, setIsVerifying] = useState(false); // 인증번호 입력 영역 노출 여부
  const [verificationCode, setVerificationCode] = useState(''); // 입력한 인증번호
  const [isResetStep, setIsResetStep] = useState(false); // 비밀번호 재설정 단계 여부

  /**
   * @function handleInputChange
   * @description 입력 시 상태값을 업데이트하고 에러를 초기화합니다.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * @function handleVerificationCodeChange
   * @description 인증번호 입력 시 상태값을 업데이트하고 에러를 초기화합니다.
   */
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
    if (errors.verificationCode) {
      setErrors((prev) => ({ ...prev, verificationCode: '' }));
    }
  };

  /**
   * @function handleSendCodeClick
   * @description 인증번호 발송 버튼 클릭 시 유효성 검사를 수행합니다.
   */
  const handleSendCodeClick = () => {
    let newErrors = { userId: '', email: '', verificationCode: '' };
    let hasError = false;

    if (!formData.userId.trim()) {
      newErrors.userId = '아이디를 입력해주세요.';
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
      hasError = true;
    }

    if (hasError) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setIsVerifying(true);
  };

  /**
   * @function handleVerifyConfirm
   * @description 인증번호 확인 버튼 클릭 시 검증을 수행합니다.
   */
  const handleVerifyConfirm = () => {
    if (!verificationCode.trim()) {
      setErrors((prev) => ({ ...prev, verificationCode: '인증번호를 입력해주세요.' }));
      return;
    }

    // 임시 인증번호 '123456' 체크
    if (verificationCode === '123456') {
      setIsResetStep(true);
      setIsVerifying(false);
    } else {
      setErrors((prev) => ({ ...prev, verificationCode: '인증번호가 일치하지 않습니다.' }));
    }
  };

  /**
   * @function handleResetPasswordSubmit
   * @description 새 비밀번호 저장 버튼 클릭 시 유효성 검사를 수행합니다.
   */
  const handleResetPasswordSubmit = () => {
    let newErrors = { newPassword: '', confirmPassword: '' };
    let hasError = false;

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
      hasError = true;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
      hasError = true;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
      hasError = true;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      hasError = true;
    }

    if (hasError) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    // 실제로는 여기서 비밀번호 변경 API 호출
    alert('비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.');
    return true; // 성공 시 true 반환하여 페이지에서 이동 처리 유도
  };

  return {
    formData,
    errors,
    isVerifying,
    verificationCode,
    isResetStep,
    handleInputChange,
    handleVerificationCodeChange,
    handleSendCodeClick,
    handleVerifyConfirm,
    handleResetPasswordSubmit,
  };
};
