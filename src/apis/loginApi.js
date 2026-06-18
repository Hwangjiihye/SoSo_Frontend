// import axiosInstance from './axiosConfig.js';

// /**
//  * 로그인 요청 API
//  * @param {Object} loginData 로그인 요청 데이터
//  * @param {string} loginData.id 사용자 아이디
//  * @param {string} loginData.pw 사용자 비밀번호
//  * @param {string} loginData.user_type 사용자 유형
//  */
// export const loginApi = (loginData) => {
//   return axiosInstance.post('/auth/login', loginData);
// };

// /**
//  * 아이디 찾기 - 인증번호 전송 요청 API
//  * @param {Object} findIdData 아이디 찾기 요청 데이터
//  * @param {string} findIdData.name 사용자 이름
//  * @param {string} findIdData.email 사용자 이메일
//  */
// export const findIdApi = (findIdData) => {
//   return axiosInstance.post('/find/findId', findIdData);
// };

// /**
//  * 아이디 찾기 - 인증번호 확인 API
//  * @param {Object} checkCodeData 인증번호 확인 데이터
//  * @param {string} checkCodeData.email 사용자 이메일
//  * @param {string} checkCodeData.code 사용자가 입력한 인증번호
//  */
// export const checkCodeApi = (checkCodeData) => {
//   return axiosInstance.post('/find/check-code', checkCodeData);
// };

// // 비밀번호 찾기 - 인증번호 발송
// export const findPasswordSendCodeApi = async (data) => {
//   const response = await axiosInstance.post('/auth/find-password/send-code', data);
//   return response.data;
// };

// // 비밀번호 찾기 - 인증번호 확인
// export const checkPasswordCodeApi = async (data) => {
//   const response = await axiosInstance.post('/auth/find-password/check-code', data);
//   return response.data;
// };

// // 비밀번호 재설정
// export const resetPasswordApi = async (data) => {
//   const response = await axiosInstance.post('/auth/find-password/reset', data);
//   return response.data;
// };


import axiosInstance from './axiosConfig.js';

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

/**
 * 비밀번호 찾기 - 인증번호 전송 요청 API
 * @param {Object} findPasswordData 비밀번호 찾기 요청 데이터
 * @param {string} findPasswordData.id 사용자 아이디
 * @param {string} findPasswordData.email 사용자 이메일
 */
export const findPasswordSendCodeApi = (findPasswordData) => {
  return axiosInstance.post('/find/findPw', findPasswordData);
};

/**
 * 비밀번호 찾기 - 인증번호 확인 API
 * @param {Object} checkCodeData 인증번호 확인 데이터
 * @param {string} checkCodeData.email 사용자 이메일
 * @param {string} checkCodeData.code 사용자가 입력한 인증번호
 */
export const checkPasswordCodeApi = (checkCodeData) => {
  return axiosInstance.post('/find/password/check-code', checkCodeData);
};

/**
 * 비밀번호 재설정 API
 * @param {Object} resetPasswordData 비밀번호 재설정 데이터
 * @param {string} resetPasswordData.id 사용자 아이디
 * @param {string} resetPasswordData.email 사용자 이메일
 * @param {string} resetPasswordData.newPassword 새 비밀번호
 */
export const resetPasswordApi = (resetPasswordData) => {
  return axiosInstance.put('/find/password/reset', resetPasswordData);
};