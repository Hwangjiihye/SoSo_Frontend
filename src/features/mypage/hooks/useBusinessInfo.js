import { useState, useEffect } from 'react';
import { getBusinessProfileApi } from '../../../apis/memberApi';
import authStore from '../../../store/authStore';

/**
 * @file useBusinessInfo.js
 * @description 사업자 정보 조회 및 가공 로직
 * 현재 선택된 매장 번호(selectedStoreSeq)에 따라 데이터를 가져옵니다.
 */
export const useBusinessInfo = () => {
  // 🏪 [멀티 프로필] 현재 선택된 매장 번호를 전역 상태에서 가져옵니다.
  const { selectedStoreSeq } = authStore();
  
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        setIsLoading(true);
        // [수정] selectedStoreSeq를 파라미터로 넘겨 해당 매장 정보를 요청합니다.
        const result = await getBusinessProfileApi(selectedStoreSeq);
        console.log("사업자 프로필 데이터:", result);
        setData(result);
        setIsLoading(false);
      } catch (err) {
        console.error('사업자 정보 조회 실패:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchBusinessInfo();
  }, [selectedStoreSeq]); // 💡 선택된 매장이 바뀌면 데이터를 다시 불러옵니다.

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
