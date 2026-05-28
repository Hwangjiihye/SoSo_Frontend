/**
 * @file AppRoutes.jsx
 * @description 애플리케이션의 모든 라우팅(주소 이동) 설정을 담당하는 컴포넌트입니다.
 * react-router-dom의 createBrowserRouter를 사용하여 클라이언트 사이드 라우팅을 구성합니다.
 */
import { RouterProvider } from 'react-router-dom';
import router from './index';

// 앱 최상단에 주입될 라우터 프로바이더 컴포넌트
function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
