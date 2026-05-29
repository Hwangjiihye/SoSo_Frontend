import axiosInstance from './axiosConfig';

/**
 * @file memberApi.js
 * @description 회원 도메인 관련 백엔드 통신 함수 정의
 */

/**
 * 아이디 중복 체크
 * @param {string} userId
 * @returns {Promise<{isDuplicated: boolean, message: string}>}
 */
export const checkIdApi = async (userId) => {
  const response = await axiosInstance.get('/api/member/check-id', {
    params: { userId },
  });
  return response.data;
};

/**
 * 닉네임 중복 체크
 * @param {string} nickname
 * @returns {Promise<{isDuplicated: boolean, message: string}>}
 */
export const checkNicknameApi = async (nickname) => {
  const response = await axiosInstance.get('/api/member/check-nickname', {
    params: { nickname },
  });
  return response.data;
};

/**
 * 이메일 중복 체크
 * @param {string} email
 * @returns {Promise<{isDuplicated: boolean, message: string}>}
 */
export const checkEmailApi = async (email) => {
  const response = await axiosInstance.get('/api/member/check-email', {
    params: { email },
  });
  return response.data;
};

/**
 * 회원가입 (Multipart/form-data)
 * @param {Object} signUpData - 회원 정보 DTO
 * @param {File|null} exteriorImg - 가게 외부 사진
 * @param {File|null} interiorImg - 가게 내부 사진
 * @returns {Promise<{status: string, message: string}>}
 */
export const signUpApi = async (signUpData, exteriorImg, interiorImg) => {
  const formData = new FormData();
  
  // 백엔드 @RequestPart("joinData") String joinData 요구사항에 맞춤
  formData.append('joinData', JSON.stringify(signUpData));
  
  if (exteriorImg) {
    formData.append('exteriorImg', exteriorImg);
  }
  
  if (interiorImg) {
    formData.append('interiorImg', interiorImg);
  }

  const response = await axiosInstance.post('/api/member/signup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
