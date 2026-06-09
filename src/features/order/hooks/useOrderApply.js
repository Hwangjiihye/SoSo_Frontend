import { useState, useCallback, useEffect } from 'react';
import { check, items as getSupplierItems, identityCheck, orderForm   } from '../../../apis/orderApi';

/**
 * @file useOrderApply.js
 * @description 발주 신청 페이지의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useOrderApply = () => {
  useEffect(() => {
    supplierItemsCheck();
  }, []);

  // 기본 정보 상태
  const [orderInfo, setOrderInfo] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    supplier: '',
    manager: '', 
    deliveryDate: '',
    paymentMethod: '',
    zonecode: '',
    address1: '',
    address2: '',
    totalAmount: '',
    orderMemo: '',
    deliveryAddress: ''
  });

  

  // 페이지 렌더링 시작할 때, 사업자 정보 불러오기
  useEffect(() => {
    const fetchIdentity = async () => {
    try {
      const data = await identityCheck();

      const fullAddress = `(${data.zoneCode}) ${data.address1} ${data.address2 || ''}`;

      setOrderInfo(prev => ({
        ...prev,
        manager: data.companyName,
        zonecode: data.zoneCode,
        address1: data.address1,
        address2: data.address2,
        deliveryAddress: fullAddress,
      }));
    } catch (error) {
      console.error('사업자명/주소 조회 실패:', error);
    }
  };

  fetchIdentity();
  }, [])

  // 발주 품목 목록 상태
  const [items, setItems] = useState([
    { id: 1, itemSeq: '', itemName: '', categoryName: '', unitPrice: '', quantity: 0, totalPrice: 0, supplyValue: 0, tax: 0, spec: '', totalSummary: 0}
  ]);

  // 공급업체별 물품 목록
  const [supplierItems, setSupplierItems] = useState([]);

  const supplierItemsCheck = async () => {
    try {
      const data = await getSupplierItems();

       console.log('거래처 품목 목록:', data);
       console.log('배열이야?', Array.isArray(data));
       console.log('첫 번째 데이터:', data[0]);

      setSupplierItems(data);
    } catch (error) {
      console.error('거래처 품목 목록 조회 실패:', error);
      alert('거래처 품목 목록 조회에 실패했습니다.');
      setSupplierItems([]);
  }
};

  // 중복제거 : 품목이 5개여도 공급업체가 같으면 option하나만 나오게함
  const suppliers = supplierItems.filter(
    (item, index, self) =>
      index === self.findIndex((s) => s.userSeq === item.userSeq)
  );
  // const supplierNames = [...new Set(supplierItems.map((item) => item.partnerName))];

  // 공급업체 선택값 기준으로 필터링
  const filteredSupplierItems = orderInfo.supplier
    ? supplierItems.filter((item) => String(item.userSeq) === String(orderInfo.supplier))
    : supplierItems;

  // 물품 선택 시 발주 목록에 추가
  const addSelectedItem = (selectedItem) => {
    // 이미 목록에 있는 품목인지 확인
    const exists = items.find(item => item.itemSeq === selectedItem.itemSeq);
    if (exists) {
      handleItemChange(exists.id, 'quantity', exists.quantity + 1);
      return;
    }

    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      itemSeq: selectedItem.itemSeq,
      itemName: selectedItem.itemName,
      categorySeq: selectedItem.categorySeq, 
      categoryName: selectedItem.categoryName,
      spec: selectedItem.spec,
      quantity: 1,
      unitPrice: selectedItem.unitPrice,
      supplyValue: selectedItem.unitPrice,
      tax: Math.floor(selectedItem.unitPrice * 0.1),
      total: Math.floor(selectedItem.unitPrice * 1.1)
    };
    
    // 만약 첫 번째 행이 비어있다면 해당 행을 교체, 아니면 추가
    if (items.length === 1 && !items[0].itemName) {
      setItems([newItem]);
    } else {
      setItems([...items, newItem]);
    }
  };

  // 품목 정보 변경 핸들러
  const handleItemChange = (id, field, value) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // 수량이나 단가가 변경될 경우 자동 계산 (음수 방지)
        if (field === 'quantity' || field === 'price') {
          const rawValue = Number(value);
          const validatedValue = Math.max(0, rawValue); // 음수 방지
          updatedItem[field] = validatedValue;
          
          const qty = field === 'quantity' ? validatedValue : item.quantity;
          const prc = field === 'price' ? validatedValue : item.price;
          updatedItem.supplyValue = qty * prc;
          updatedItem.tax = Math.floor(updatedItem.supplyValue * 0.1);
          updatedItem.total = updatedItem.supplyValue + updatedItem.tax;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  // 품목 추가
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, name: '', category: '', unit: '', quantity: 0, price: 0, supplyValue: 0, tax: 0, total: 0 }]);
  };

  // 품목 삭제
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // 기본 정보 변경 핸들러
  const handleInfoChange = (field, value) => {
    setOrderInfo(prev => ({ ...prev, [field]: value }));
  };

  // 총 합계 계산
  const totalSummary = items.reduce((acc, item) => ({
    supplyValue: acc.supplyValue + item.supplyValue,
    tax: acc.tax + item.tax,
    total: acc.total + item.total,
  }), { supplyValue: 0, tax: 0, total: 0 });

  // 발주 신청 제출
  const handleSubmit = async () => {

    try{
      if (!orderInfo.supplier) {
      alert('공급업체를 선택해주세요.');
      return;
    }
    if (items.length === 0 || items.some(item => !item.itemName || item.quantity <= 0)) {
      alert('발주할 품목을 선택하고 수량을 정확히 입력해주세요.');
      return;
    }


    console.log("orderInfo:", orderInfo);
console.log("zonecode:", orderInfo.zonecode);

      const orderData = {
        sellerSeq : Number(orderInfo.supplier),
        totalAmount : totalSummary.total,
        orderMemo: orderInfo.deliveryNotes,
        zonecode : orderInfo.zonecode,
        address1 : orderInfo.address1,
        address2 : orderInfo.address2,
      

      items: items.map((item) => ({
        itemSeq : item.itemSeq,
        itemName : item.itemName,
        categoryName : item.categoryName,
        quantity: item.quantity,
        spec : item.spec,
        unitPrice: item.unitPrice,
        totalPrice: Number(item.unitPrice || 0) * Number(item.quantity || 0)
      })),
    };

    console.log('최종 발주 데이터:', JSON.stringify(orderData, null, 2));

    // API 호출
    const result = await orderForm(orderData);

    if (orderInfo.paymentMethod !== '계좌이체') {
      alert('결제 방식을 선택해주세요.');
      return;
    }
  
    console.log('발주 신청 결과:', result);
    console.log('발주 신청 데이터:', orderData);

    alert('발주 신청이 완료되었습니다.');

  } catch (error) {
    console.error('발주 신청 실패:', error);
    alert('발주 신청 중 오류가 발생했습니다.');
  };
}
  

  return {
    orderInfo,
    items,
    totalSummary,
    supplierItems,
    suppliers,
    filteredSupplierItems,
    handleInfoChange,
    handleItemChange,
    addItem,
    addSelectedItem,
    removeItem,
    handleSubmit
  };
};
