import { useState, useEffect } from 'react';
import authStore from '../../../store/authStore';
import { 
  createIncomingStock, 
  createOutboundStock, 
  createAdjustStock,
  getStockBatches
} from '../../../apis/stockApi';

/**
 * @file useStockTransaction.js
 * @description 재고 거래(입고/출고/조정) 비즈니스 로직 처리 커스텀 훅
 */
export const useStockTransaction = (selectedStock, onClose, onSuccess) => {
  const selectedStoreSeq = authStore(state => state.selectedStoreSeq);
  const [activeTab, setActiveTab] = useState('INBOUND'); // INBOUND, OUTBOUND, ADJUST
  const [isLoading, setIsLoading] = useState(false);
  const [batches, setBatches] = useState([]); // 조정 시 선택할 배치 목록

  // ... (폼 상태 정의 생략되지 않음)
  // 1. 입고 폼 상태
  const [inboundForm, setInboundForm] = useState({
    detailStockName: '',
    quantity: '',
    incomingPrice: '',
    memo: '',
  });

  // 2. 출고 폼 상태
  const [outboundForm, setOutboundForm] = useState({
    quantity: '',
    reason: '주방 소진',
    memo: '',
  });

  // 3. 조정 폼 상태
  const [adjustmentForm, setAdjustmentForm] = useState({
    batchSeq: '', // 선택 사항 (0 또는 빈값은 마스터만 조정)
    quantity: '',
    reason: '파손/분실',
    memo: '',
  });

  // 초기 데이터 설정 및 배치 목록 로드
  useEffect(() => {
    if (selectedStock && selectedStoreSeq) {
      setInboundForm(prev => ({
        ...prev,
        detailStockName: selectedStock.stockName || ''
      }));

      // 조정 탭이거나 선택된 스톡이 바뀔 때 배치 정보 가져오기
      const fetchBatches = async () => {
        try {
          const data = await getStockBatches(selectedStock.stockSeq);
          setBatches(data || []);
        } catch (err) {
          console.error('Fetch Batches Error:', err);
        }
      };
      fetchBatches();
    }
  }, [selectedStock, selectedStoreSeq]);

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleInboundChange = (e) => {
    const { name, value } = e.target;
    // 음수 부호(-) 입력 방지
    if ((name === 'quantity' || name === 'incomingPrice') && Number(value) < 0) return;
    setInboundForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOutboundChange = (e) => {
    const { name, value } = e.target;
    // 음수 부호(-) 입력 방지
    if (name === 'quantity' && Number(value) < 0) return;
    setOutboundForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStock || !selectedStoreSeq) {
      alert("매장 및 품목 정보가 유효하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const stockSeq = selectedStock.stockSeq;

      if (activeTab === 'INBOUND') {
        if (!inboundForm.quantity || !inboundForm.incomingPrice) {
          throw new Error('필수 입력 항목을 확인해주세요.');
        }
        if (Number(inboundForm.quantity) <= 0) {
          throw new Error('입고 수량은 1개 이상이어야 합니다.');
        }
        if (Number(inboundForm.incomingPrice) < 0) {
          throw new Error('입고 단가는 0원 이상이어야 합니다.');
        }
        const requestData = {
          stockSeq: stockSeq,
          detailStockName: inboundForm.detailStockName,
          quantity: Number(inboundForm.quantity),
          incomingPrice: Number(inboundForm.incomingPrice),
          memo: inboundForm.memo
        };

        await createIncomingStock(Number(selectedStoreSeq), requestData);
        
      } else if (activeTab === 'OUTBOUND') {
        if (!outboundForm.quantity || !outboundForm.reason) {
          throw new Error('필수 입력 항목을 확인해주세요.');
        }
        if (Number(outboundForm.quantity) <= 0) {
          throw new Error('출고 수량은 1개 이상이어야 합니다.');
        }
        // 출고 시 재고 부족 체크
        if (Number(outboundForm.quantity) > selectedStock.currentStock) {
          throw new Error('출고 수량이 현재 재고보다 많을 수 없습니다.');
        }
        await createOutboundStock({ 
          stockSeq: stockSeq, 
          storeSeq: selectedStoreSeq, // 명시적 추가
          ...outboundForm 
        });
      } else if (activeTab === 'ADJUST') {
        if (!adjustmentForm.quantity || !adjustmentForm.reason) {
          throw new Error('필수 입력 항목을 확인해주세요.');
        }

        const changeQty = Number(adjustmentForm.quantity);
        
        // 백엔드 로직 검증: 조정 후 재고가 0보다 작아지는지 체크
        if (adjustmentForm.batchSeq) {
          const targetBatch = batches.find(b => b.batchSeq === Number(adjustmentForm.batchSeq));
          if (targetBatch && (targetBatch.currentQuantity + changeQty) < 0) {
            throw new Error(`조정 후 배치 재고(${targetBatch.currentQuantity + changeQty})가 0보다 작을 수 없습니다.`);
          }
        } else if ((selectedStock.currentStock + changeQty) < 0) {
          throw new Error(`조정 후 총 재고(${selectedStock.currentStock + changeQty})가 0보다 작을 수 없습니다.`);
        }

        // 백엔드 StockAdjustRequest 사양에 맞춰 changeQuantity로 전달
        await createAdjustStock({ 
          stockSeq: stockSeq, 
          storeSeq: selectedStoreSeq, // 명시적 추가
          batchSeq: adjustmentForm.batchSeq ? Number(adjustmentForm.batchSeq) : null,
          changeQuantity: changeQty,
          reason: adjustmentForm.reason,
          memo: adjustmentForm.memo
        });
      }

      alert('거래가 정상적으로 등록되었습니다.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Transaction Error:', error);

      console.error("status:", error.response?.status);
      console.error("response data:", error.response?.data);
      console.error("request url:", error.config?.url);
      console.error("request data:", error.config?.data);
      alert(error.response?.data || error.message || '거래 등록 중 오류가 발생했습니다.');

    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setInboundForm({
      detailStockName: selectedStock?.stockName || '',
      quantity: '',
      incomingPrice: '',
      memo: '',
    });
    setOutboundForm({
      quantity: '',
      reason: '주방 소진',
      memo: '',
    });
    setAdjustmentForm({
      batchSeq: '',
      quantity: '',
      reason: '파손/분실',
      memo: '',
    });
    setActiveTab('INBOUND');
  };

  return {
    activeTab,
    handleTabChange,
    inboundForm,
    outboundForm,
    adjustmentForm,
    batches,
    handleInboundChange,
    handleOutboundChange,
    handleAdjustmentChange,
    handleSubmit,
    isLoading,
    resetForms,
  };
};
