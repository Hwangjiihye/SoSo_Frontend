/**
 * @file App.jsx
 * @description 리액트 애플리케이션의 최상위 컴포넌트입니다.
 * 전역적인 설정(라우터, 전역 상태 Provider, 공통 레이아웃 등)을 이곳에서 묶어줍니다.
 */
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useNotificationSocket from './hooks/useNotificationSocket';

function App() {
  // 전역 실시간 알림 웹소켓 모니터링 활성화
  useNotificationSocket();

  // 생성해둔 AppRoutes를 반환하여 애플리케이션 전체에 라우팅 규칙을 적용합니다.
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  )
}

export default App
