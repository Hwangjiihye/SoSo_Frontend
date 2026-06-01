import { useState } from 'react';
import { findIdApi, checkCodeApi } from '../../../apis/loginApi';

/**
 * @hook useFindId
 * @description 아이디 찾기 페이지의 비즈니스 로직을 관리하는 커스텀 훅입니다.
 */
export const useFindId = () => {
  // 입력 필드 데이터 상태
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // 에러 메시지 상태
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    verificationCode: '', // 인증번호 에러 추가
  });

  // 인증 및 결과 상태
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isFound, setIsFound] = useState(false);
  const [foundId, setFoundId] = useState('');

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
   * @function handleFindIdClick
   * @description 아이디 찾기(인증번호 발송) 버튼 클릭 시 유효성 검사를 수행합니다.
   */
  const handleFindIdClick = async ()  => {
    let newErrors = { name: '', email: '', verificationCode: '' };
    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
      hasError = true;
    }

    if (hasError) {
  setErrors(newErrors);
  return;
}

  // 유효성 검사 통과 시 인증 단계로 진입
  try {
    const resp = await findIdApi({
      name: formData.name,
      email: formData.email
  });

  alert(resp.data);

  setIsVerifying(true);

} catch (error) {
    if (error.response) {
      alert(error.response.data);
    } else {
      alert('서버 연결에 실패했습니다.');
    }
  }
  };

  /**
   * @function handleVerifyConfirm
   * @description 인증번호 확인 버튼 클릭 시 검증을 수행합니다.
   */
  const handleVerifyConfirm = async () => {

      console.log('handleVerifyConfirm 실행됨');
      console.log('현재 이메일:', formData.email);
      console.log('현재 인증번호:', verificationCode);

  // 1. 빈값 체크
  if (!verificationCode.trim()) {
    setErrors((prev) => ({
      ...prev,
      verificationCode: '인증번호를 입력해주세요.',
    }));
    return;
  }

  try {
    console.log('인증하기 버튼 눌림');
    console.log('email:', formData.email);
    console.log('code:', verificationCode);

    const resp = await checkCodeApi({
      email: formData.email,
      code: verificationCode,
    });

    console.log('인증번호 확인 응답:', resp.data);

    if (resp.data) {
      alert('인증되었습니다.');
      setFoundId(resp.data);
      setIsFound(true);
      setIsVerifying(false);
    } else {
      setErrors((prev) => ({
        ...prev,
        verificationCode: '인증번호가 일치하지 않습니다.',
      }));
    }
  } catch (error) {
    console.error('인증번호 확인 오류:', error);

    if (error.response) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: error.response.data,
      }));
    } else {
      alert('인증번호 확인 중 오류가 발생했습니다.');
    }
  }
  };

  return {
    formData,
    errors,
    isVerifying,
    verificationCode,
    isFound,
    foundId,
    handleInputChange,
    handleVerificationCodeChange,
    handleFindIdClick,
    handleVerifyConfirm,
  };
};
