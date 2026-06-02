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
        const result = await getPartnerProfileApi();
        setData(result);
        setIsLoading(false);
      } catch (err) {
        console.error('업체 정보 조회 실패:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchPartnerInfo();
  }, []);

  // 가입 일자 포맷팅 (DTO의 created_at은 String)
  const formattedDate = data?.created_at 
    ? new Date(data.created_at).toLocaleDateString('ko-KR') 
    : '-';

  // 개업 일자 포맷팅 (DTO의 openingDate는 Date 객체 또는 ISO String으로 올 수 있음)
  const formattedOpeningDate = data?.openingDate
    ? new Date(data.openingDate).toLocaleDateString('ko-KR')
    : '-';

  // 한 줄 주소 가공
  const fullAddress = data 
    ? `(${data.zonecode || ''}) ${data.address1 || ''} ${data.address2 || ''}`.trim()
    : '-';

  return {
    profile: data,
    isLoading,
    error,
    formattedDate,
    formattedOpeningDate,
    fullAddress,
  };
};
