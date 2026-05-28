/**
 * @file MainPage.jsx
 * @description 애플리케이션의 메인 껍데기(컨테이너) 역할을 하는 컴포넌트입니다.
 * 현재는 백엔드 로그인 연동 전이므로, 화면 테스트를 위해 자체적으로 role(권한) 상태를 관리하며 
 * 권한에 맞는 하위 메인 페이지(비회원, 사업자, 거래처)를 렌더링합니다.
 */
import { useState } from 'react';
import GuestMain from './GuestMain';
import BusinessMain from './BusinessMain';
import PartnerMain from './PartnerMain';

function MainPage() {
  // 임시 권한 상태 관리 state
  // 초기값: 'guest' (비회원 랜딩 페이지 노출)
  // 변경 가능한 값: 'guest', 'business', 'partner'
  const [role, setRole] = useState('guest');

  // role 상태가 'business'일 경우 사업자 대시보드 컴포넌트를 렌더링
  // 하위 컴포넌트에서 권한을 다시 변경할 수 있도록 setRole 함수를 props로 전달
  if (role === 'business') {
    return <BusinessMain setRole={setRole} />;
  }

  // role 상태가 'partner'일 경우 거래처 대시보드 컴포넌트를 렌더링
  if (role === 'partner') {
    return <PartnerMain setRole={setRole} />;
  }

  // 그 외의 경우(기본값 포함) 비회원 서비스 소개 페이지를 렌더링
  return <GuestMain setRole={setRole} />;
}

export default MainPage;
