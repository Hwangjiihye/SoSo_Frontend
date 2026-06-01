import { useState, useEffect } from 'react';
import { getPartnerProfileApi } from '../../../apis/memberApi';

/**
 * @file usePartnerInfo.js
 * @description 업체 정보 조회 및 가공 로직 (아키텍처 규칙 3번: 로직 100% 격리)
 */
export const usePartnerInfo = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        setIsLoading(true);
        
        // [참고] 백엔드 인터셉터가 세션 유저 식별자를 검증하므로 파라미터 없이 호출
        // 현재는 UI 확인을 위해 Mock 데이터를 사용하며, 백엔드 준비 시 아래 주석을 해제합니다.
        /*
        const result = await getPartnerProfileApi();
        setData(result);
        */

        const mockData = {
          user: {
            user_id: 'partner_01',
            nickname: '싱싱파트너',
            name: '김철수',
            phone: '010-9876-5432',
            email: 'chulsoo@soso.com',
            created_at: '2026-05-15T09:00:00Z',
          },
          store: {
            company_name: '(주)소소식자재유통',
            biz_number: '220-81-12345',
            address1: '서울특별시 송파구 가락동 123-4',
            address2: '농수산물도매시장 A동 201호',
            exterior_img: null // 예: 'store_exterior.jpg'
          }
        };

        // 개발 중 UI 확인을 위한 딜레이
        setTimeout(() => {
          setData(mockData);
          setIsLoading(false);
        }, 300);

      } catch (err) {
        console.error('업체 정보 조회 실패:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchPartnerInfo();
  }, []);

  // 가입 일자 포맷팅
  const formattedDate = data?.user?.created_at 
    ? new Date(data.user.created_at).toLocaleDateString('ko-KR') 
    : '-';

  // 한 줄 주소 가공
  const fullAddress = data?.store 
    ? `${data.store.address1 || ''} ${data.store.address2 || ''}`.trim()
    : '-';

  return {
    profile: data,
    isLoading,
    error,
    formattedDate,
    fullAddress,
  };
};
