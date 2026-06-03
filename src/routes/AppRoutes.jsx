
/**
 * @file AppRoutes.jsx
 * @description 애플리케이션의 최상위 라우팅 프로바이더 설정입니다.
 * src/routes/index.jsx에서 정의된 라우터 객체를 앱 전체에 주입합니다.
 */
import { RouterProvider } from 'react-router-dom';
import router from './index';

/**
 * @file AppRoutes.jsx
 * @description 애플리케이션의 최상위 라우팅 프로바이더 설정입니다.
 * src/routes/index.jsx에서 정의된 라우터 객체를 앱 전체에 주입합니다.
 */
function AppRoutes() {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
