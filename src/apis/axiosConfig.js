import axios from 'axios';
import authStore from '../store/authStore';

/**
 * @file axiosConfig.js
 * @description 전역 Axios 인스턴스 설정 및 인터셉터 정의
 */

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:80',
  timeout: 1000000,
  withCredentials: true, // 🚨 [필수 추가] 백엔드와 세션 쿠키(JSESSIONID, refreshToken)를 공유하기 위해 반드시 켜야 함!
});

// ==============================================================================
// 동시성 제어 큐(Queue) 변수 세팅
// ==============================================================================
let isRefreshing = false; // 현재 토큰 재발급 진행 여부 플래그
let refreshSubscribers = []; // 토큰 재발급을 기다리는 요청들의 대기열(큐)

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// 요청 인터셉터: 토큰 및 storeSeq 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. 기존 JWT 토큰 헤더 주입 로직 (Zustand 메모리 상태에서 가져옴)
    const token = authStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. 🏪 Zustand에서 현재 선택된 매장 번호 가져오기
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
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 401 에러이고 이전에 재시도한 적이 없는 요청일 경우
    if (status === 401 && !originalRequest._retry) {
      // 재발급 경로나 로그인 경로에서 401이 터지면 무한루프 방지
      if (originalRequest.url.includes('/auth/reissue') || originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      // 이미 재발급 중이라면 큐에 담고 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // [Silent Refresh] 백엔드에 새 토큰 요청 (쿠키에 담긴 Refresh Token 자동 전송)
        const response = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/reissue`,
          {},
          { withCredentials: true }
        );

        // Java 컨트롤러 확인 완료: 응답 Body의 키는 "token"임
        const newAccessToken = response.data.token;
        
        // Zustand 스토어의 토큰 교체 (메모리 갱신)
        authStore.getState().setToken(newAccessToken);

        // 큐에 대기 중이던 다른 요청들에게 새 토큰 전달 후 일괄 재시도
        onRefreshed(newAccessToken);

        // 실패했던 본래 요청도 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
        
      } catch (reissueError) {
        // 리프레시 토큰까지 만료된 경우 (진짜 로그아웃 상황)
        alert("로그인 세션이 만료되었거나 정보가 올바르지 않습니다. 다시 로그인해주세요.");
        authStore.getState().logout();
        refreshSubscribers = [];
        window.location.href = '/login'; // 자네 프로젝트의 로그인 페이지 경로로 수정하세
        return Promise.reject(reissueError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;