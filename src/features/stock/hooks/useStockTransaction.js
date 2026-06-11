import { useState, useEffect } from 'react';
import { 
  createIncomingStock, 
  createOutboundStock, 
  createAdjustStock 
} from '../../../apis/stockApi';

/**
 * @file useStockTransaction.js
 * @description 재고 거래(입고/출고/조정) 비즈니스 로직 처리 커스텀 훅
 */
export const useStockTransaction = (selectedStock, onClose, onSuccess) => {
  const [activeTab, setActiveTab] = useState('INBOUND'); // INBOUND, OUTBOUND, ADJUST
  const [isLoading, setIsLoading] = useState(false);

  // 1. 입고 폼 상태
  const [inboundForm, setInboundForm] = useState({
    detailProductName: '',
    quantity: '',
    incomingPrice: '',
    expirationDate: '',
    manager: '',
    memo: '',
  });

  // 2. 출고 폼 상태
  const [outboundForm, setOutboundForm] = useState({
    quantity: '',
    reason: '주방 소진',
    manager: '',
    memo: '',
  });

  // 3. 조정 폼 상태
  const [adjustmentForm, setAdjustmentForm] = useState({
    batchSeq: '', // 선택 사항
    quantity: '',
    reason: '파손/분실',
    manager: '',
    memo: '',
  });

  // 초기 데이터 설정
  useEffect(() => {
    if (selectedStock) {
      setInboundForm(prev => ({
        ...prev,
        detailProductName: selectedStock.productName || ''
      }));
    }
  }, [selectedStock]);

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleInboundChange = (e) => {
    const { name, value } = e.target;
    setInboundForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOutboundChange = (e) => {
    const { name, value } = e.target;
    setOutboundForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStock) return;

    setIsLoading(true);
    try {
      const stockSeq = selectedStock.productCode;

      if (activeTab === 'INBOUND') {
        if (!inboundForm.quantity || !inboundForm.incomingPrice || !inboundForm.expirationDate) {
          throw new Error('필수 입력 항목을 확인해주세요.');
        }
        await createIncomingStock({ stockSeq, ...inboundForm });
      } else if (activeTab === 'OUTBOUND') {
        if (!outboundForm.quantity || !outboundForm.reason) {
          throw new Error('필수 입력 항목을 확인해주세요.');
        }
        await createOutboundStock({ stockSeq, ...outboundForm });
      } else if (activeTab === 'ADJUST') {
        if (!adjustmentForm.quantity || !adjustmentForm.reason) {
          throw new Error('필수 입력 항목을 확인해주세요.');
        }
        await createAdjustStock({ stockSeq, ...adjustmentForm });
      }

      alert('거래가 정상적으로 등록되었습니다.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Transaction Error:', error);
      alert(error.message || '거래 등록 중 오류가 발생했습니다.');
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
