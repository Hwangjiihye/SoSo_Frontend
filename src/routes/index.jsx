import { createBrowserRouter } from 'react-router-dom';
import mainRoutes from './mainRoutes';
import memberRoutes from './memberRoutes';

/**
 * @file index.jsx (Router)
 * @description 도메인별로 분리된 라우트들을 하나로 통합하여 
 * react-router-dom의 브라우저 라우터 객체를 생성합니다.
 */
const router = createBrowserRouter([
  ...mainRoutes,   // 메인 관련 주소 합치기
  ...memberRoutes, // 회원 관련 주소 합치기
]);

export default router;
