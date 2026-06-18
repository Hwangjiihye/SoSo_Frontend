import NoticePage from '../features/supportpage/NoticePage';
import FAQPage from '../features/supportpage/FAQPage';
import InquiryPage from '../features/supportpage/InquiryPage';

/**
 * @file supportRoutes.jsx
 * @description 고객지원 도메인의 라우트 설정 파일입니다.
 */
const supportRoutes = [
  {
    path: '/support/notice', // 공지사항
    element: <NoticePage />,
  },
  {
    path: '/support/faq', // 자주 묻는 질문
    element: <FAQPage />,
  },
  {
    path: '/support/inquiry', // 문의하기
    element: <InquiryPage />,
  },
];

export default supportRoutes;