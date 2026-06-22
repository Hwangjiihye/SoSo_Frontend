import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPartnerItems, getPartnerDetail } from '../../../apis/accountApi';

/**
 * @file useAccountManagement.js
 * @description 품목 관리 페이지의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useAccountManagement = () => {
  const [searchParams] = useSearchParams();
  const partnerSeq = searchParams.get('partnerSeq');
  
  const [items, setItems] = useState([]);
  const [partnerDetail, setPartnerDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const parsedSeq = parseInt(partnerSeq);
      
      // 유효한 숫자가 아니면 요청하지 않음
      if (!partnerSeq || isNaN(parsedSeq)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // 병렬로 품목 리스트와 상세 정보 가져오기
        const [itemsData, detailData] = await Promise.all([
          getPartnerItems(parsedSeq),
          getPartnerDetail(parsedSeq)
        ]);
        
        // 상세 정보 세팅
        if (detailData) {
          setPartnerDetail({
            name: detailData.companyName,
            ceo: detailData.ceoName,
            bizNum: detailData.bizNumber ? detailData.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : '',
            address: `${detailData.address1} ${detailData.address2 || ''}`.trim(),
            phone: detailData.phone || '등록된 번호 없음',
            email: detailData.email || '등록된 이메일 없음'
          });
        }

        // 품목 정보 세팅
        const formattedItems = itemsData.results.map(item => ({
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
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [partnerSeq]);

  return { items, partnerDetail, isLoading };
};
