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


export const checkBusinessApi = async (bNo, startDt, pNm, bNm) => {
  // 백엔드 컨트롤러가 @RequestParam으로 받으므로 params 객체로 전달
  const response = await axiosInstance.get('/api/biz/check', {
    params: {
      bNo,
      startDt,
      pNm,
      bNm,
    },
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

/**
 * 사업자 마이페이지(정보) 조회
 * @returns {Promise<Object>} 회원 및 매장 정보
 */
export const getBusinessProfileApi = async () => {
  const response = await axiosInstance.get('/api/member/business/profile');
  return response.data;
};

/**
 * 거래처 마이페이지(업체 정보) 조회
 * @returns {Promise<Object>} 회원 및 매장 정보
 */
export const getPartnerProfileApi = async () => {
  const response = await axiosInstance.get('/api/member/partner/profile');
  return response.data;
};

/**
 * 거래처 업체 정보 수정 (Multipart/form-data)
 * @param {Object} updateData - 수정할 회원 정보 DTO
 * @param {File|null} exteriorImg - 가게 외부 사진
 * @param {File|null} interiorImg - 가게 내부 사진
 * @returns {Promise<{status: string, message: string}>}
 */
export const updatePartnerProfileApi = async (updateData, exteriorImg, interiorImg) => {
  const formData = new FormData();
  
  // 백엔드 요구사항에 맞춰 JSON 데이터를 'updateData' 파트로 추가
  formData.append('updateData', JSON.stringify(updateData));
  
  if (exteriorImg instanceof File) {
    formData.append('exteriorImg', exteriorImg);
  }
  
  if (interiorImg instanceof File) {
    formData.append('interiorImg', interiorImg);
  }

  const response = await axiosInstance.put('/api/member/partner/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 비밀번호 변경
 * @param {Object} passwordData - { currentPassword, newPassword }
 * @returns {Promise<{status: string, message: string}>}
 */
export const changePasswordApi = async (passwordData) => {
  const response = await axiosInstance.post('/api/member/change-password', passwordData);
  return response.data;
};

/**
 * 회원 탈퇴 (RESTful DELETE - Soft Delete 방식)
 * @param {Object} withdrawalData - { withdrawReason }
 * @returns {Promise<{status: string, message: string}>}
 */
export const withdrawMemberApi = async (withdrawalData) => {
  // ⭕ '수정'의 의미를 살려 PATCH를 사용하고, 바디 데이터를 안전하게 전송하세!
  const response = await axiosInstance.patch('/api/member/partner/withdraw', withdrawalData);
  return response.data;
};