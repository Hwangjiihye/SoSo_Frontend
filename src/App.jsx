/**
 * @file App.jsx
 * @description 리액트 애플리케이션의 최상위 컴포넌트입니다.
 */
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useNotificationSocket from './hooks/useNotificationSocket';
import useAuthStore from './store/authStore';

// 토큰이 있을 때만 알림 소켓을 실행하기 위한 컴포넌트
function NotificationSocketGate() {
  useNotificationSocket();
  return null;
}

function App() {
  const silentRefresh = useAuthStore((state) => state.silentRefresh);
  const isAuthLoaded = useAuthStore((state) => state.isAuthLoaded);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // 앱 시작 시 refreshToken 쿠키로 accessToken 재발급 시도
    silentRefresh();
  }, [silentRefresh]);

  // 재발급이 끝나기 전에는 화면/API 실행을 막음
  if (!isAuthLoaded) {
    return null;
  }

  return (
    <>
      {/* token이 복구된 뒤에만 알림 소켓 실행 */}
      {token && <NotificationSocketGate />}

      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;