import { useState, useEffect } from 'react';
import { 
  createInboundTransaction, 
  createOutboundTransaction, 
  createAdjustmentTransaction 
} from '../../../apis/stockApi';

/**
 * @file useStockTransaction.js
 * @description 재고 거래(입고/출고/조정) 비즈니스 로직 처리 커스텀 훅
 */
export const useStockTransaction = (selectedStock, onClose, onSuccess) => {
  const [activeTab, setActiveTab] = useState('INBOUND'); // INBOUND, OUTBOUND, ADJUSTMENT
  const [isLoading, setIsLoading] = useState(false);

  // 입고 폼 상태
  const [inboundForm, setInboundForm] = useState({
    productName: '',
    quantity: '',
    unitPrice: '',
    memo: '',
  });

  // 출고 폼 상태
  const [outboundForm, setOutboundForm] = useState({
    quantity: '',
    memo: '',
  });

  // 조정 폼 상태
  const [adjustmentForm, setAdjustmentForm] = useState({
    quantity: '',
    reason: '파손/분실',
    memo: '',
  });

  // 초기 데이터 설정 및 자동 완성 로직
  useEffect(() => {
    if (selectedStock && activeTab === 'INBOUND') {
      setInboundForm((prev) => ({
        ...prev,
        productName: selectedStock.name || '',
      }));
    }
  }, [selectedStock, activeTab]);

  // 탭 변경 시 폼 초기화
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // 선택된 탭 외의 폼들은 초기화하거나 필요 시 유지 (여기서는 요구사항에 따라 깔끔하게 전환)
  };

  const handleInboundChange = (e) => {
    const { name, value } = e.target;
    setInboundForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOutboundChange = (e) => {
    const { name, value } = e.target;
    setOutboundForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result;
      const commonData = { stockId: selectedStock.id };

      if (activeTab === 'INBOUND') {
        result = await createInboundTransaction({ ...commonData, ...inboundForm });
      } else if (activeTab === 'OUTBOUND') {
        result = await createOutboundTransaction({ ...commonData, ...outboundForm });
      } else if (activeTab === 'ADJUSTMENT') {
        result = await createAdjustmentTransaction({ ...commonData, ...adjustmentForm });
      }

      console.log('Transaction Success:', result);
      alert('거래가 정상적으로 등록되었습니다.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Transaction Failed:', error);
      alert('거래 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeTab,
    handleTabChange,
    inboundForm,
    outboundForm,
    adjustmentForm,
    handleInboundChange,
    handleOutboundChange,
    handleAdjustmentChange,
    handleSubmit,
    isLoading,
  };
};
