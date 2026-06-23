import axios from 'axios';
import authStore from '../store/authStore';

/**
 * @file axiosConfig.js
 * @description 전역 Axios 인스턴스 설정 및 인터셉터 정의
 */

const axiosInstance = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:80',
  timeout: 10000,
  withCredentials: true, // 🚨 [필수 추가] 백엔드와 세션 쿠키(JSESSIONID)를 공유하기 위해 반드시 켜야 함!
});

// 요청 인터셉터: 토큰 및 storeSeq 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. 기존 JWT 토큰 헤더 주입 로직
    const token = authStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. 🏪 [새로 추가] Zustand에서 현재 선택된 매장 번호 가져오기
    const storeSeq = authStore.getState().selectedStoreSeq;

    if (storeSeq) {
      // [GET / @RequestParam 대응] 모든 요청의 URL 파라미터에 ?storeSeq=번호 자동 합성
      config.params = {
        ...config.params,
        storeSeq: storeSeq,
      };

      // [POST / @RequestBody 대응] 전송하는 데이터(JSON Body) 내부에도 storeSeq가 없다면 자동으로 쏙 주입
      if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
        config.data = {
          storeSeq: storeSeq, // DTO 내부의 storeSeq에 바인딩됨
          ...config.data,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 핸들링 및 데이터 포맷팅
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // 🚨 [추가] 세션이 만료되거나 토큰이 유효하지 않으면 로그인 페이지로 튕기기 전 전역 상태 초기화
      alert("로그인 세션이 만료되었거나 정보가 올바르지 않습니다. 다시 로그인해주세요.");
      authStore.getState().logout();
      window.location.href = '/login'; // 자네 프로젝트의 로그인 페이지 경로로 수정하세
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;