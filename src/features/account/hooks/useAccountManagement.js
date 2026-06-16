import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPartnerItems } from '../../../apis/accountApi';

/**
 * @file useAccountManagement.js
 * @description 품목 관리 페이지의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useAccountManagement = () => {
  const [searchParams] = useSearchParams();
  const partnerSeq = searchParams.get('partnerSeq');
  const partnerName = searchParams.get('name');
  
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const parsedSeq = parseInt(partnerSeq);
      
      // 유효한 숫자가 아니면 요청하지 않음
      if (!partnerSeq || isNaN(parsedSeq)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getPartnerItems(parsedSeq);
        // 백엔드 데이터 매핑
        const formattedItems = data.results.map(item => ({
          id: item.itemSeq,
          name: item.itemName,
          unit: item.spec,
          price: `${item.unitPrice.toLocaleString()}원`,
          category: item.categoryName,
          status: '판매중', // 기본 상태
          image: item.itemImage
        }));
        setItems(formattedItems);
      } catch (error) {
        console.error('품목 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [partnerSeq]);

  return { items, isLoading, partnerName };
};
