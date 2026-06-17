import axiosInstance from './axiosConfig.js';

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
 * 사업자 실명 인증 (국세청 API 연동)
 * @param {string} bNo - 사업자 번호
 * @param {string} startDt - 개업 일자 (YYYYMMDD)
 * @param {string} pNm - 대표자 성명
 * @param {string} bNm - 상호명
 * @param {boolean} isMultiProfile - 멀티프로필/정보수정 여부 (true일 경우 중복체크 생략)
 */
export const checkBusinessApi = async (bNo, startDt, pNm, bNm, isMultiProfile = false) => {
  // 백엔드 컨트롤러가 @RequestParam으로 받으므로 params 객체로 전달
  const response = await axiosInstance.get('/api/biz/check', {
    params: {
      bNo,
      startDt,
      pNm,
      bNm,
      isMultiProfile // 🏪 true일 경우 백엔드에서 DB 중복 체크를 건너뜁니다.
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
 * @param {number|null} storeSeq - 특정 매장의 정보를 가져오고 싶을 때 전달
 * @returns {Promise<Object>} 회원 및 매장 정보
 */
export const getBusinessProfileApi = async (storeSeq = null) => {
  const response = await axiosInstance.get('/api/member/business/profile', {
    params: { storeSeq }
  });
  return response.data;
};

/**
 * 🏪 사장님이 소유한 모든 매장 목록 조회
 * @returns {Promise<Array>} 매장 정보 리스트
 */
export const getAllStoresApi = async () => {
  const response = await axiosInstance.get('/api/member/business/stores');
  return response.data;
};

/**
 * 사업자 정보 수정 (Multipart/form-data)
 * @param {Object} updateData - 수정할 회원 정보 DTO
 * @param {File|null} exteriorImg - 가게 외부 사진
 * @param {File|null} interiorImg - 가게 내부 사진
 * @returns {Promise<{status: string, message: string}>}
 */
export const updateBusinessProfileApi = async (updateData, exteriorImg, interiorImg) => {
  const formData = new FormData();
  
  // 1. ⚠️ 중요: JSON.stringify를 하지 않고, 객체의 각 필드를 낱개로 풀어 append 합니다.
  // 이래야 백엔드의 @ModelAttribute가 DTO 필드명과 매칭을 시켜줄 수 있어!
  Object.keys(updateData).forEach((key) => {
    // 값이 null이거나 undefined가 아닐 때만 보냅니다.
    if (updateData[key] !== null && updateData[key] !== undefined) {
      formData.append(key, updateData[key]);
    }
  });
  
  // 2. 파일 추가 (기존 코드 유지)
  if (exteriorImg instanceof File) {
    formData.append('exteriorImg', exteriorImg);
  }
  
  if (interiorImg instanceof File) {
    formData.append('interiorImg', interiorImg);
  }

  console.log("멤버API 요청 전송 시작", formData);

  const response = await axiosInstance.put('/api/member/business/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 다중 매장 등록 (Multipart/form-data)
 * @param {Object} registerData - 신규 매장 정보 DTO
 * @param {File|null} exteriorImg - 가게 외부 사진
 * @param {File|null} interiorImg - 가게 내부 사진
 * @returns {Promise<{status: string, message: string}>}
 */
export const registerMultiProfileApi = async (registerData, exteriorImg, interiorImg) => {
  const formData = new FormData();
  
  // 백엔드 요구사항에 맞춰 JSON 데이터를 'registerData' 파트로 추가 (사용자 요청 방식 적용)
  formData.append('registerData', JSON.stringify(registerData));
  
  if (exteriorImg instanceof File) {
    formData.append('exteriorImg', exteriorImg);
  }
  
  if (interiorImg instanceof File) {
    formData.append('interiorImg', interiorImg);
  }

  const response = await axiosInstance.post('/api/member/business/multiprofile/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
 * 회원 탈퇴 (RESTful PATCH - Soft Delete 방식)
 * @param {Object} withdrawalData - { withdrawReason }
 * @returns {Promise<{status: string, message: string}>}
 */
export const withdrawMemberApi = async (withdrawalData) => {
  const response = await axiosInstance.patch('/api/member/partner/withdraw', withdrawalData);
  return response.data;
};