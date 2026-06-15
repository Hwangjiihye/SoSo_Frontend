import { useState, useEffect } from 'react';
import { getRegisteredAccounts, deletePartnerAccount } from '../../../apis/accountApi';
import authStore from '../../../store/authStore';

/**
 * @file useAccountList.js
 * @description 거래처 목록 페이지의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useAccountList = () => {
  const { user_seq, selectedStoreSeq } = authStore();
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      // business_seq 결정 (selectedStoreSeq가 있으면 그것으로, 없으면 user_seq)
      const businessSeq = selectedStoreSeq || user_seq;

      if (!businessSeq) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getRegisteredAccounts(parseInt(businessSeq));
        // 백엔드 데이터 매핑
        const formattedAccounts = data.results.map(item => ({
          id: item.relationSeq,
          partnerSeq: item.partnerSeq, // 누락된 필드 추가
          name: item.companyName,
          ceo: item.ceoName,
          tel: '-', 
          bizNum: item.bizNumber ? item.bizNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : '',
          address: `${item.address1} ${item.address2 || ''}`.trim(),
          status: '거래중', 
          memo: item.memo,
          createdAt: item.createdAt
        }));
        setAccounts(formattedAccounts);
      } catch (error) {
        console.error('거래처 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [user_seq, selectedStoreSeq]);

  const handleDeleteAccount = async (relationSeq, companyName) => {
    const confirmMessage = `[${companyName}] 거래처를 정말 삭제하시겠습니까?\n삭제 후에는 해당 거래처와의 연결이 즉시 해제됩니다.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        const result = await deletePartnerAccount(relationSeq);
        if (result.status === 'success') {
          alert('거래처가 성공적으로 삭제되었습니다.');
          // 목록에서 삭제된 항목 즉시 제거 (재요청 방지)
          setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== relationSeq));
        } else {
          alert(result.message || '삭제에 실패했습니다.');
        }
      } catch (error) {
        alert('거래처 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return { accounts, isLoading, handleDeleteAccount };
};
