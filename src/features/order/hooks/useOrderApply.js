import { useState, useCallback } from 'react';

/**
 * @file useOrderApply.js
 * @description 발주 신청 페이지의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 */
export const useOrderApply = () => {
  // 기본 정보 상태
  const [orderInfo, setOrderInfo] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    supplier: '',
    manager: '김민준', // 기본값
    deliveryDate: '',
    paymentMethod: '카드결제',
    deliveryNotes: '',
    deliveryAddress: '서울시 강남구 테헤란로 123 (Soso 식당)',
  });

  // 발주 품목 목록 상태
  const [items, setItems] = useState([
    { id: 1, name: '', category: '', unit: '', quantity: 0, price: 0, supplyValue: 0, tax: 0, total: 0 }
  ]);

  // 공급업체별 등록 물품 데이터 (Mock)
  const supplierItems = {
    '한우 농장': [
      { code: 'MEAT-001', name: '한우 등심', group: '육류', spec: '1kg / 냉장', unit: 'kg', price: 45000, type: '일반', image: 'https://placehold.co/56x56?text=Beef' },
      { code: 'MEAT-002', name: '한우 안심', group: '육류', spec: '1kg / 냉장', unit: 'kg', price: 52000, type: '일반', image: 'https://placehold.co/56x56?text=Fillet' },
      { code: 'MEAT-003', name: '냉동 삼겹살', group: '육류', spec: '500g * 10팩', unit: '박스', price: 85000, type: '묶음', image: 'https://placehold.co/56x56?text=Pork' },
    ],
    '청과 도매': [
      { code: 'FRUIT-001', name: '세척 당근', group: '채소류', spec: '1kg * 10봉', unit: '박스', price: 22000, type: '묶음', image: 'https://placehold.co/56x56?text=Carrot' },
      { code: 'FRUIT-002', name: '양파(대)', group: '채소류', spec: '15kg / 망', unit: '개', price: 18000, type: '일반', image: 'https://placehold.co/56x56?text=Onion' },
    ],
    '식자재 마트': [
      { code: 'OIL-001', name: '해표 식용유', group: '오일류', spec: '1.8L * 6병', unit: '박스', price: 42000, type: '묶음', image: 'https://placehold.co/56x56?text=Oil' },
      { code: 'OIL-002', name: '카놀라유', group: '오일류', spec: '500ml / 병', unit: '개', price: 4500, type: '일반', image: 'https://placehold.co/56x56?text=Oil' },
      { code: 'GROC-001', name: '참치캔', group: '가공식품', spec: '150g * 48캔', unit: '박스', price: 98000, type: '묶음', image: 'https://placehold.co/56x56?text=Tuna' },
    ],
    '대성 유통': [
      { code: 'ETC-001', name: '냅킨 1000매', group: '소모품', spec: '1000매 * 10팩', unit: '박스', price: 15000, type: '묶음', image: 'https://placehold.co/56x56?text=Napkin' },
      { code: 'ETC-002', name: '종이컵', group: '소모품', spec: '6.5oz / 1000개', unit: '박스', price: 25000, type: '일반', image: 'https://placehold.co/56x56?text=Cup' },
    ],
  };

  // 물품 선택 시 발주 목록에 추가
  const addSelectedItem = (selectedItem) => {
    // 이미 목록에 있는 품목인지 확인
    const exists = items.find(item => item.name === selectedItem.name);
    if (exists) {
      handleItemChange(exists.id, 'quantity', exists.quantity + 1);
      return;
    }

    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      name: selectedItem.name,
      category: selectedItem.group, // 품목그룹을 카테고리에 매핑
      unit: selectedItem.unit,
      quantity: 1,
      price: selectedItem.price,
      supplyValue: selectedItem.price,
      tax: Math.floor(selectedItem.price * 0.1),
      total: Math.floor(selectedItem.price * 1.1)
    };
    
    // 만약 첫 번째 행이 비어있다면 해당 행을 교체, 아니면 추가
    if (items.length === 1 && !items[0].name) {
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
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
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
  const handleSubmit = () => {
    if (!orderInfo.supplier) {
      alert('공급업체를 선택해주세요.');
      return;
    }
    if (items.some(item => !item.name || item.quantity <= 0)) {
      alert('품목명과 수량을 정확히 입력해주세요.');
      return;
    }
    
    console.log('발주 신청 데이터:', { orderInfo, items, totalSummary });
    alert('발주 신청이 완료되었습니다.');
  };

  return {
    orderInfo,
    items,
    totalSummary,
    supplierItems: supplierItems[orderInfo.supplier] || [],
    handleInfoChange,
    handleItemChange,
    addItem,
    addSelectedItem,
    removeItem,
    handleSubmit,
  };
};
