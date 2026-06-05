import { useState } from 'react';
import { loginApi } from '../../../apis/loginApi';
import { useNavigate } from 'react-router-dom';
import authStore from "../../../store/authStore";

/**
 * @hook useLogin
 * @description 로그인 페이지의 비즈니스 로직을 관리하는 커스텀 훅입니다.
 */

export const useLogin = () => {

  const navigate = useNavigate();

  // 로그인 대상 선택 상태
  const [loginType, setLoginType] = useState('business');

  // 로그인 성공 시 토큰과 사용자 정보를 전역 상태에 저장하기 위한 함수
  const login = authStore((state) => state.login);

  // 입력 필드 데이터 상태
  const [formData, setFormData] = useState({
    user_id: '',
    password: ''
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

    // 🚀 1. 백엔드로 진짜 로그인 데이터를 보냅니다 (POST 방식)
    const requestUserType = loginType === 'business' ? 'BUSINESS' : 'PARTNER';

    loginApi({
      id: formData.user_id,
      pw: formData.password,
      user_type: requestUserType,
    })
      .then(resp => {
        // 🚀 [추가] 탈퇴 회원 응답 처리
        // 백엔드 컨트롤러가 status가 'isWithDraw'인 경우 그대로 member 객체를 반환함
        if (resp.data.status === 'isWithDraw') {
          alert("탈퇴한 회원입니다. 고객센터에 문의해주세요.");
          setFormData({
            user_id: '',
            password: ''
          })
          return;
        }

        const token = resp.data.token;
        const user_type = resp.data.user_type;
        const user_seq = resp.data.user_seq;

        console.log("token:", token);
        console.log("user_type:", user_type);
        console.log("user_seq:", user_seq);

        if (!token) {
          alert("로그인 정보가 올바르지 않거나 권한이 없습니다.");
          return;
        }

        console.log("zustand 저장 전 백엔드 응답:", resp.data);
        // 로그인 성공 시 받은 토큰과 사용자 정보를 전역 상태에 저장
        login({
          token: token,
          user_seq: user_seq,
          user_type: user_type,
        });

        // 3. 성공했으니 메인 화면으로 이동
        alert("로그인에 성공했습니다!");
        navigate("/");
      })
      .catch(error => {
        console.error("로그인 실패:", error);

        if (error.response && error.response.status === 401) {
          alert("회원 유형과 계정 정보가 일치하지 않습니다.");
        } else {
          alert("로그인 중 오류가 발생했습니다.");
        }
      })
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
