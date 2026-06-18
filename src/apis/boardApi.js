import axiosInstance from './axiosConfig.js';

/**
 * @file boardApi.js
 * @description 게시판 관련 API 호출 함수 모음입니다.
 */

/**
 * 특정 타입의 게시글 목록 조회 API 호출
 * @param {string} type 게시판 타입 (예: NOTICE, TIP)
 * @returns {Promise} 게시글 리스트 및 카운트
 */
export const getBoardsByType = async (type) => {
  try {
    const response = await axiosInstance.get('/api/boards', {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error(`게시글 목록(${type}) 조회 중 오류 발생:`, error);
    throw error;
  }
};

/**
 * 특정 유저의 1:1 문의 내역 조회 API 호출
 * @param {number} userSeq 유저 고유 번호
 * @returns {Promise} 문의 내역 리스트 및 카운트
 */
export const getMyInquiries = async (userSeq) => {
  try {
    const response = await axiosInstance.get('/api/boards/my-inquiries', {
      params: { userSeq },
    });
    return response.data;
  } catch (error) {
    console.error('내 문의 내역 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 1:1 문의 등록 API 호출
 * @param {Object} inquiryData { userSeq, csType, title, content }
 * @returns {Promise} 등록 결과
 */
export const submitInquiry = async (inquiryData) => {
  try {
    const response = await axiosInstance.post('/api/boards/inquiry', inquiryData);
    return response.data;
  } catch (error) {
    console.error('문의 등록 중 오류 발생:', error);
    throw error;
  }
};
