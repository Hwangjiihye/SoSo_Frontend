/**
 * @file AppRoutes.jsx
 * @description 애플리케이션의 모든 라우팅(주소 이동) 설정을 담당하는 컴포넌트입니다.
 * react-router-dom의 createBrowserRouter를 사용하여 클라이언트 사이드 라우팅을 구성합니다.
 */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from '../features/main/MainPage';

// 라우터 객체 생성
// 배열 안의 각 객체는 특정 URL 경로(path)와 해당 경로에서 보여줄 컴포넌트(element)를 매핑합니다.
const router = createBrowserRouter([
  {
    path: "/", // 기본 도메인 주소 (예: localhost:5173/)
    element: <MainPage />, // 화면에 MainPage 컴포넌트를 렌더링
  },
  // 추후 로그인, 마이페이지 등 새로운 페이지가 생기면 여기에 객체를 추가합니다.
]);

// 앱 최상단에 주입될 라우터 프로바이더 컴포넌트
function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
