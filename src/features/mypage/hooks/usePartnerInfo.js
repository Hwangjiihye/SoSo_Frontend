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
  const formattedDate = data?.createdAt 
    ? new Date(data.createdAt).toLocaleDateString('ko-KR') 
    : '-';

  // 개업 일자 포맷팅 (DTO의 openingDate는 Date 객체 또는 ISO String으로 올 수 있음)
  const formattedOpeningDate = data?.openingDate
    ? new Date(data.openingDate).toLocaleDateString('ko-KR')
    : '-';

  // 한 줄 주소 가공
  const fullAddress = data 
    ? `(${data.zonecode || ''}) ${data.address1 || ''} ${data.address2 || ''}`.trim()
    : '-';
    
  const sysNamesArray = data?.storeSysNames ? data.storeSysNames.split(',') : [];

  // ⭕ 1번 사진 주소 조립 (없으면 디폴트)
  const storeImg1 = sysNamesArray[0]
    ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[0]}`
    : '/images/default-store.png';

  // ⭕ 2번 사진 주소 조립 (없으면 디폴트)
  const storeImg2 = sysNamesArray[1]
    ? `https://storage.googleapis.com/study_jcr/${sysNamesArray[1]}`
    : '/images/default-store.png';

  return {
    profile: data,
    isLoading,
    error,
    formattedDate,
    formattedOpeningDate,
    fullAddress,
    storeImg1, 
    storeImg2,
  };
};
