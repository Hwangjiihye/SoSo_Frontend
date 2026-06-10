# SoSo-FrontEnd 개발 가이드라인

## 기술 스택
- **Build Tool:** Vite
- **Framework:** React (JavaScript)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Linting:** ESLint + Prettier

## 아키텍처 규칙
1. **라우팅 (Routing):**
   - `<BrowserRouter>` 방식 금지.
   - `react-router-dom`의 `createBrowserRouter` 및 `RouterProvider` (객체 배열 방식) 사용.
   - `src/routes/` 폴더 내 도메인별 라우트 분리 후 `AppRoutes.jsx`에서 조립.
2. **로직 격리 (Separation of Concerns):**
   - UI 컴포넌트와 비즈니스 로직(Axios/Hooks) 엄격 분리.
   - 모든 비즈니스 로직은 `src/features/[domain]/hooks/` 내 `use[Feature].js` 커스텀 훅으로 구현.

## 디렉토리 구조
- `src/apis/`: 백엔드 연동 Axios 함수
- `src/components/`: 전역 공통 UI
- `src/features/`: 도메인별 영역 (components, hooks, Page.jsx)
- `src/routes/`: 라우터 설정 및 도메인별 라우트
- `src/store/`: Zustand 스토어
- `src/styles/`: Tailwind 및 전역 스타일
- `src/App.jsx`: Provider 및 라우터 연결 최상위 컴포넌트

## 개발 제약 조건
- 패키지 설치 전 승인 필수.
- Tailwind CSS 유틸리티 클래스 일관성 유지.
- `.env`, `vite.config.ts`, `tsconfig.json` 임의 수정 금지.
- 작업 완료 후 `npm run build`를 통한 검증 필수.
