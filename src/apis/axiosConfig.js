import axios from 'axios';
import authStore from '../store/authStore';

/**
 * @file axiosConfig.js
 * @description 전역 Axios 인스턴스 설정 및 인터셉터 정의
 */

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:80',
  timeout: 10000,
  
});

// 요청 인터셉터: 토큰 주입 등 전처리 수행
axiosInstance.interceptors.request.use(
  (config) => {
    // 예: const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

  const token = authStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
      // Unauthorized 처리 (로그아웃 등)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
