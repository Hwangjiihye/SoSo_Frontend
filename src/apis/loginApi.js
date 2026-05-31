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