import { useState, useEffect } from 'react';
import { getBusinessProfileApi } from '../../../apis/memberApi';

/**
 * @file useBusinessInfo.js
 * @description 사업자 정보 조회 및 가공 로직 (PartnerInfo 방식과 동일하게 구현)
 */
export const useBusinessInfo = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        setIsLoading(true);
        const result = await getBusinessProfileApi();
        console.log(result);
        setData(result);
        setIsLoading(false);
      } catch (err) {
        console.error('사업자 정보 조회 실패:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchBusinessInfo();
  }, []);

  // 가입 일자 포맷팅
  const formattedDate = data?.createdAt 
    ? new Date(data.createdAt).toLocaleDateString('ko-KR').replace(/\. /g, '/').replace('.', '')
    : '정보 없음';

  // 개업 일자 포맷팅
  const formattedOpeningDate = data?.openingDate
    ? new Date(data.openingDate).toLocaleDateString('ko-KR').replace(/\. /g, '/').replace('.', '')
    : '정보 없음';

  // 한 줄 주소 가공
  const fullAddress = data 
    ? `${data.address1 || ''} ${data.address2 || ''}`.trim()
    : '정보 없음';

    const sysNamesArray = data?.profileImageUrl ? data.profileImageUrl.split(',') : [];

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
