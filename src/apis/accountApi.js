import axiosInstance from './axiosConfig';

/**
 * @file accountApi.js
 * @description 거래처 관련 API 호출 함수 모음입니다.
 */

/**
 * 거래처(파트너사) 검색 API 호출
 * @param {string} searchTerm 업체명 또는 사업자 번호
 * @returns {Promise} 검색 결과 리스트 및 카운트
 */
export const searchAccounts = async (searchTerm) => {
  try {
    const response = await axiosInstance.get('/api/account/search', {
      params: { searchTerm },
    });
    return response.data; // { results: [...], count: X }
  } catch (error) {
    console.error('거래처 검색 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 모든 거래처(파트너사) 목록 조회 API 호출
 * @param {Object} params 필터 파라미터 { searchTerm, city, district }
 * @returns {Promise} 파트너사 전체 리스트 및 카운트
 */
export const getAllPartners = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/api/account/all-partners', { params });
    return response.data;
  } catch (error) {
    console.error('전체 거래처 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 거래처 관계 등록 API 호출
 * @param {Object} relationData { businessSeq, partnerSeq, memo }
 * @returns {Promise} 등록 결과
 */
export const registerPartnerAccount = async (relationData) => {
  try {
    const response = await axiosInstance.post('/api/account/register', relationData);
    return response.data;
  } catch (error) {
    console.error('거래처 등록 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 등록된 거래처 목록 조회 API 호출
 * @param {number} businessSeq 사업장 또는 유저 시퀀스
 * @param {Object} params 필터 파라미터 { searchTerm, city, district }
 * @returns {Promise} 등록된 거래처 리스트
 */
export const getRegisteredAccounts = async (businessSeq, params = {}) => {
  try {
    const response = await axiosInstance.get('/api/account/list', {
      params: { businessSeq, ...params },
    });
    return response.data;
  } catch (error) {
    console.error('거래처 목록 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 특정 거래처의 품목 목록 조회 API 호출
 * @param {number} partnerSeq 거래처(매장) 시퀀스
 * @returns {Promise} 품목 리스트
 */
export const getPartnerItems = async (partnerSeq) => {
  try {
    const response = await axiosInstance.get('/api/account/items', {
      params: { partnerSeq },
    });
    return response.data;
  } catch (error) {
    console.error('거래처 품목 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 특정 거래처의 상세 정보 조회 API 호출
 * @param {number} partnerSeq 거래처(매장) 시퀀스
 * @returns {Promise} 거래처 상세 정보 객체
 */
export const getPartnerDetail = async (partnerSeq) => {
  try {
    const response = await axiosInstance.get(`/api/account/partner/${partnerSeq}`);
    return response.data;
  } catch (error) {
    console.error('거래처 상세 정보 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 거래처 관계 삭제 API 호출
 * @param {number} relationSeq 관계 고유 번호
 * @returns {Promise} 삭제 결과
 */
export const deletePartnerAccount = async (relationSeq) => {
  try {
    const response = await axiosInstance.delete(`/api/account/${relationSeq}`);
    return response.data;
  } catch (error) {
    console.error('거래처 삭제 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 특정 유저의 첫 번째 매장 시퀀스 조회 API 호출
 * @param {number} userSeq 유저 고유 번호
 * @returns {Promise} 첫 번째 매장 시퀀스
 */
export const getFirstStoreSeq = async (userSeq) => {
  try {
    const response = await axiosInstance.get(`/api/account/first-store/${userSeq}`);
    return response.data; // { storeSeq: X }
  } catch (error) {
    console.error('첫 번째 매장 시퀀스 조회 중 오류 발생:', error);
    throw error;
  }
};
