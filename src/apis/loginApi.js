import axiosInstance from './axiosConfig';

/**
 * 로그인 요청 API
 * @param {Object} loginData 로그인 요청 데이터
 * @param {string} loginData.id 사용자 아이디
 * @param {string} loginData.pw 사용자 비밀번호
 * @param {string} loginData.user_type 사용자 유형
 */
export const loginApi = (loginData) => {
  return axiosInstance.post('/auth/login', loginData);
};

/**
 * 아이디 찾기 - 인증번호 전송 요청 API
 * @param {Object} findIdData 아이디 찾기 요청 데이터
 * @param {string} findIdData.name 사용자 이름
 * @param {string} findIdData.email 사용자 이메일
 */
export const findIdApi = (findIdData) => {
  return axiosInstance.post('/find/findId', findIdData);
};

/**
 * 아이디 찾기 - 인증번호 확인 API
 * @param {Object} checkCodeData 인증번호 확인 데이터
 * @param {string} checkCodeData.email 사용자 이메일
 * @param {string} checkCodeData.code 사용자가 입력한 인증번호
 */
export const checkCodeApi = (checkCodeData) => {
  return axiosInstance.post('/find/check-code', checkCodeData);
};

// 비밀번호 재설정
export const resetPasswordApi = async (data) => {
  const response = await axiosInstance.put('/find/password/reset', data);
  return response.data;
};

// 비밀번호 찾기 - 아이디 + 이메일 확인 후 인증번호 발송
export const findPasswordSendCodeApi = async (data) => {
  const response = await axiosInstance.post('/find/findPw', data);
  return response.data;
};

// 비밀번호 찾기 - 인증번호 확인
export const checkPasswordCodeApi = async (data) => {
  const response = await axiosInstance.post('/find/password/check-code', data);
  return response.data;
};