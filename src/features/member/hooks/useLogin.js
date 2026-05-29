import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * @hook useLogin
 * @description 로그인 페이지의 비즈니스 로직을 관리하는 커스텀 훅입니다.
 */

export const useLogin = () => {

  const navigate = useNavigate();

  // 로그인 대상 선택 상태
  const [loginType, setLoginType] = useState('business'); 

  // 입력 필드 데이터 상태
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
  });

  // 에러 메시지 상태
  const [errors, setErrors] = useState({
    id: '',
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

    let newErrors = { id: '', password: '' };
    let hasError = false;

    // 유효성 검사: 아이디 미입력 시
    if (!formData.user_id.trim()) {
      newErrors.user_id = '아이디를 입력해주세요.';
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
    // 🚀 1. 백엔드로 진짜 로그인 데이터를 보냅니다 (POST 방식)
    axios.post("http://localhost:80/auth/login", {
      id: formData.user_id, // 백엔드 DTO에 맞춘 key
      pw: formData.password // 백엔드 DTO에 맞춘 key
    })
    .then(resp => {
      // 백엔드 AuthController가 result.put("token", token)으로 준 데이터를 확인
      console.log("서버가 돌려준 응답 데이터:", resp.data);
      
    const token = resp.data.token;
    
    if (token) {
      // 2. 백엔드가 준 진짜 토큰을 세션에 저장합니다.
      sessionStorage.setItem("token", token);
      console.log("토큰 저장 완료!");

      // 3. [핵심] 성공했으니 '이 시점'에서 메인 화면으로 이동시킵니다!
      alert("로그인에 성공했습니다!");

      sessionStorage.setItem("user_type", user_type);
      
    } if(user_type === business) {
      navigate("/BusinessMain")
    } 
    else if(user_type === parther) {
      navigate("/PartnerMain")
    } 
    else if(user_type === admin) {
      navigate("/AdminMain")
    }
    else {
      alert("로그인은 성공했으나 토큰이 넘어오지 않았습니다.");
    }
  })
  .catch(err => {
    console.error("로그인 실패 에러 상세:", err.response?.data || err.message);
    alert("아이디 또는 비밀번호가 일치하지 않습니다.");
  });
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
