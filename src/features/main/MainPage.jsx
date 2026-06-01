/**
 * @file MainPage.jsx
 * @description 애플리케이션의 메인 컨테이너 컴포넌트입니다.
 * authStore의 user_type을 확인하여 권한에 맞는 메인 페이지(Guest, Business, Partner)를 노출합니다.
 */
import { useState, useEffect } from 'react';
import GuestMain from './GuestMain';
import BusinessMain from './BusinessMain';
import PartnerMain from './PartnerMain';
import authStore from '../../store/authStore';

function MainPage() {
  // 스토어에서 유저 타입 가져오기
  const userTypeFromStore = authStore((state) => state.user_type);
  
  // 로컬 role 상태 (체험하기 버튼 등을 위한 임시 상태)
  const [role, setRole] = useState('guest');

  // 스토어의 유저 타입이 변경될 때마다 로컬 role 상태 업데이트
  useEffect(() => {
    if (userTypeFromStore) {
      // 스토어에 타입이 있다면 (로그인 상태) 해당 타입으로 설정
      // 보통 'BUSINESS', 'PARTNER' 등의 대문자로 저장되므로 소문자로 변환하여 매칭
      setRole(userTypeFromStore.toLowerCase());
    } else {
      // 로그인 정보가 없다면 기본값인 'guest'로 설정
      setRole('guest');
    }
  }, [userTypeFromStore]);

  // role 상태에 따른 분기 렌더링
  if (role === 'business') {
    return <BusinessMain setRole={setRole} />;
  }

  if (role === 'partner') {
    return <PartnerMain setRole={setRole} />;
  }

  // 기본값: 비회원 랜딩 페이지
  return <GuestMain setRole={setRole} />;
}

export default MainPage;
