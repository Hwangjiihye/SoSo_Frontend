import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/soso로고.png';
import authStore from '../../store/authStore';
import { useStores } from '../../hooks/useStores';
import { useTransfer } from './hooks/useTransfer';
import { insertAccount, accountList, accountDel, getPaymentCards, registerPaymentCard, deletePaymentCard, payOrdersByCard, getRecentPayments } from '../../apis/account';
import { suppliers as getSupplierList, unpaidOrders as getUnpaidOrders } from '../../apis/orderApi';
import * as PortOne from "@portone/browser-sdk/v2";

/**
 * @file TransferManagementPage.jsx
 * @description 이체 관리 페이지 (payment 도메인)
 * '이체 관리.jpg' 디자인 참고 반영
 */
const TransferManagementPage = () => {
  const navigate = useNavigate();
  const { logout, user_nickname, bizname, selectedStoreSeq, setSelectedStore, userSeq } = authStore();
  const { stores, isLoading: isStoresLoading } = useStores();
  // useTransfer에서는 로딩 상태와 금액 포맷 함수만 가져온다.
  // 최근 결제 내역 검색은 이 페이지 안에서 직접 처리한다.
  const { isLoading, formatCurrency } = useTransfer();

  const [accounts, setAccounts] = useState([]);
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettlementMenuOpen, setIsSettlementMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAutoTransferModalOpen, setIsAutoTransferModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAccount, setTransferAccount] = useState(null);
  const [isAutoTransferEnabled, setIsAutoTransferEnabled] = useState(false);
  const [transferSearchType, setTransferSearchType] = useState('week');
  // 최근 결제 내역 검색어 상태
  const [paymentKeyword, setPaymentKeyword] = useState('');

  // 최근 결제 내역 시작일 상태
  const [paymentStartDate, setPaymentStartDate] = useState('');

  // 최근 결제 내역 종료일 상태
const [paymentEndDate, setPaymentEndDate] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태 추가
  const [editingAccount, setEditingAccount] = useState(null); // 수정 중인 계좌 상태 추가
  const [newAccount, setNewAccount] = useState({ // 계좌 추가
    bankName: '', 
    accountNumber: '', 
    accountName: ''
  });
  const [isCardRegisterModalOpen, setIsCardRegisterModalOpen] = useState(false);
  const [isOrderPaymentModalOpen, setIsOrderPaymentModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [orderPaymentPartners, setOrderPaymentPartners] = useState([]);
  const [payableOrders, setPayableOrders] = useState([]);


  // 결제 요청 진행 여부
  // true면 결제 버튼을 비활성화해서 중복 결제를 막음
  const [isPaying, setIsPaying] = useState(false);

  const [newCard, setNewCard] = useState({
    cardCompany: "",
    cardLast4: "",
    cardName: "",
  });

  // 계좌번호 정규식
  const bankRegexMap = {
    "신한은행": /^\d{11,12}$/,
    "국민은행": /^\d{12,14}$/,
    "우리은행": /^\d{13}$/,
    "하나은행": /^\d{14}$/,
    "SC제일은행": /^\d{11,14}$/,
    "한국씨티은행": /^\d{12}$/,
    "iM뱅크은행": /^\d{12,14}$/,
    "농협은행": /^\d{11,14}$/
  };

  // 계좌번호 화면에 하이픈 추가하여 출력
  const formatAccountNumber = (bankName, accountNumber) => {
    const num = String(accountNumber ?? "").replace(/\D/g, "");

    if (!num) return "";

    if (bankName === "신한은행" || bankName === "신한") {
      if (num.length === 11) return num.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3");
      if (num.length === 12) return num.replace(/(\d{3})(\d{3})(\d{6})/, "$1-$2-$3");
    }

    if (bankName === "국민은행" || bankName === "국민") {
      if (num.length === 12) return num.replace(/(\d{3})(\d{2})(\d{4})(\d{3})/, "$1-$2-$3-$4");
      if (num.length === 14) return num.replace(/(\d{6})(\d{2})(\d{6})/, "$1-$2-$3");
    }

    if (bankName === "우리은행" || bankName === "우리") {
      if (num.length === 13) return num.replace(/(\d{4})(\d{3})(\d{6})/, "$1-$2-$3");
    }

    if (bankName === "하나은행" || bankName === "하나") {
      if (num.length === 14) return num.replace(/(\d{3})(\d{6})(\d{5})/, "$1-$2-$3");
    }

    if (bankName === "SC제일은행") {
      if (num.length === 11) return num.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3");
      if (num.length === 12) return num.replace(/(\d{3})(\d{3})(\d{6})/, "$1-$2-$3");
      if (num.length === 14) return num.replace(/(\d{3})(\d{3})(\d{8})/, "$1-$2-$3");
    }

    if (bankName === "한국씨티은행" || bankName === "씨티은행") {
      if (num.length === 12) return num.replace(/(\d{3})(\d{6})(\d{3})/, "$1-$2-$3");
    }

    if (bankName === "iM뱅크은행" || bankName === "iM뱅크" || bankName === "대구은행") {
      if (num.length === 12) return num.replace(/(\d{3})(\d{2})(\d{7})/, "$1-$2-$3");
      if (num.length === 13) return num.replace(/(\d{3})(\d{3})(\d{7})/, "$1-$2-$3");
      if (num.length === 14) return num.replace(/(\d{3})(\d{3})(\d{8})/, "$1-$2-$3");
    }

    if (bankName === "농협은행" || bankName === "농협") {
      if (num.length === 11) return num.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3");
      if (num.length === 12) return num.replace(/(\d{3})(\d{3})(\d{6})/, "$1-$2-$3");
      if (num.length === 13) return num.replace(/(\d{3})(\d{4})(\d{6})/, "$1-$2-$3");
      if (num.length === 14) return num.replace(/(\d{6})(\d{2})(\d{6})/, "$1-$2-$3");
    }

    return num;
  };

  // 예금주명 정규식
  const accountNameRegex = /^[가-힣a-zA-Z0-9\s]{2,30}$/;

  const selectedPartner = orderPaymentPartners.find(
    (partner) => String(partner.storeSeq ?? partner.partnerSeq) === String(selectedPartnerId)
  );

  const selectedPartnerOrders = payableOrders;

  const selectedOrders = payableOrders.filter((order) =>
    selectedOrderIds.includes(Number(order.orderSeq))
  );

  const selectedOrderTotal = selectedOrders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  // const handlePartnerChange = (partnerId) => {
  //   setSelectedPartnerId(partnerId);
  //   setSelectedOrderIds([]);
  // };
  const handlePartnerChange = async (partnerSeq) => {
    setSelectedPartnerId(partnerSeq);
    setSelectedOrderIds([]);
    setPayableOrders([]);

    if (!partnerSeq) return;

    const currentStoreSeq = selectedStoreSeq ?? stores?.[0]?.storeSeq;

    if (!currentStoreSeq) {
      alert("사업장 정보가 없습니다.");
      return;
    }

    try {
      const orders = await getUnpaidOrders(
        Number(currentStoreSeq),
        Number(partnerSeq)
      );

      console.log("미결제 발주 목록:", orders);

      setPayableOrders(orders ?? []);
    } catch (error) {
      console.error("미결제 발주 목록 조회 실패:", error);
      alert("미결제 발주 목록을 불러오지 못했습니다.");
    }
  };

  const handleOrderPaymentToggle = (orderSeq) => {
    const targetOrderSeq = Number(orderSeq);

    setSelectedOrderIds((prev) =>
      prev.includes(targetOrderSeq)
        ? prev.filter((id) => id !== targetOrderSeq)
        : [...prev, targetOrderSeq]
    );
  };

  // 선택한 미결제 발주들을 등록된 카드로 결제하는 함수
  const handlePayOrders = async () => {
    // 현재 선택된 매장 번호
    const currentStoreSeq = selectedStoreSeq ?? stores?.[0]?.storeSeq;

    // 현재 화면에서 선택된 카드
    const selectedCard = cards[activeCardIndex];

    // 매장 정보가 없으면 결제 불가
    if (!currentStoreSeq) {
      alert("사업장 정보가 없습니다.");
      return;
    }

    // 등록된 카드가 없거나 선택된 카드가 없으면 결제 불가
    if (!selectedCard) {
      alert("결제할 카드가 없습니다.");
      return;
    }

    // 거래처를 선택하지 않았으면 결제 불가
    if (!selectedPartnerId) {
      alert("거래처를 선택해 주세요.");
      return;
    }

    // 결제할 발주를 선택하지 않았으면 결제 불가
    if (selectedOrderIds.length === 0) {
      alert("결제할 발주를 선택해 주세요.");
      return;
    }

    // 사용자에게 최종 결제 확인
    const ok = confirm(`${selectedOrderTotal.toLocaleString()}원을 결제하시겠습니까?`);

    if (!ok) {
      return;
    }

    try {
      // 결제 중 상태로 변경해서 버튼 중복 클릭 방지
      setIsPaying(true);

      // 백엔드로 결제 요청
      const result = await payOrdersByCard({
        storeSeq: Number(currentStoreSeq),       // 돈을 내는 사업자 매장 번호
        partnerSeq: Number(selectedPartnerId),   // 돈을 받는 거래처 매장 번호
        cardSeq: Number(selectedCard.cardSeq),   // 결제에 사용할 카드 번호
        orderSeqList: selectedOrderIds,          // 결제할 발주 번호 목록
      });

      console.log("결제 결과:", result);

      // 백엔드에서 success true를 내려주면 결제 성공 처리
      if (result.success) {
        alert("결제가 완료되었습니다.");

        // 선택한 발주 초기화
        setSelectedOrderIds([]);

        // 결제한 발주는 미결제 목록에서 빠져야 하므로 다시 조회
        const orders = await getUnpaidOrders(
          Number(currentStoreSeq),
          Number(selectedPartnerId)
        );

        setPayableOrders(orders ?? []);

        // 방금 결제한 내역이 아래 최근 결제 내역에 바로 뜨도록 다시 조회
        await fetchRecentPayments(Number(currentStoreSeq));
      } else {
        alert(result.message || "결제에 실패했습니다.");
      }
    } catch (error) {
      console.error("발주 결제 실패:", error);

      // 백엔드에서 내려준 에러 메시지가 있으면 그걸 보여주고,
      // 없으면 기본 메시지를 보여줌
      alert(error.response?.data?.message || "결제 중 오류가 발생했습니다.");
    } finally {
      // 성공/실패와 관계없이 결제 중 상태 해제
      setIsPaying(false);
    }
  };


  // 등록된 카드 + 최근 결제 내역 조회
  useEffect(() => {
    const currentStoreSeq = selectedStoreSeq ?? stores?.[0]?.storeSeq;

    if (currentStoreSeq) {
      // 등록된 카드 목록 조회
      fetchCards(currentStoreSeq);

      // 최근 카드 결제 내역 조회
      fetchRecentPayments(currentStoreSeq);
    }
  }, [selectedStoreSeq, stores]);





  // 등록된 계좌 출력
  // useEffect(() => {
  //   fetchAccountList();
  // }, [selectedStoreSeq, stores]);

  // 등록된 계좌 조회
  const fetchAccountList = async () => {
  const currentStoreSeq = selectedStoreSeq ?? stores?.[0]?.storeSeq;

  if (!currentStoreSeq) {
    console.log("사업장 번호 없음");
    return;
  }

  try {
    const data = await accountList(Number(currentStoreSeq));
    console.log("계좌 목록 조회 결과:", data);
    setAccounts(data);
  } catch (error) {
    console.error("계좌 목록 조회 실패:", error);
  }
};


const [cards, setCards] = useState([]);
const [activeCardIndex, setActiveCardIndex] = useState(0);
// 이체관리 화면 아래에 보여줄 최근 카드 결제 내역
const [recentPayments, setRecentPayments] = useState([]);
const [recentPaymentsPage, setRecentPaymentsPage] = useState(1);

const fetchCards = async (storeSeq) => {
  try {
    const cardList = await getPaymentCards(storeSeq);
    setCards(cardList ?? []);
    setActiveCardIndex(0);
  } catch (error) {
    console.error("카드 목록 조회 실패:", error);
  }
};

const handleDeleteCard = async () => {
  const selectedCard = cards[activeCardIndex];

  if (!selectedCard || !window.confirm("등록된 카드를 삭제하시겠습니까?")) {
    return;
  }

  try {
    await deletePaymentCard(selectedCard.cardSeq);
    setCards((prevCards) => prevCards.filter((card) => card.cardSeq !== selectedCard.cardSeq));
    setActiveCardIndex(0);
  } catch (error) {
    console.error("카드 삭제 실패:", error);
    alert("카드를 삭제하지 못했습니다.");
  }
};


// 최근 카드 결제 내역 조회
// payments.store_seq = 현재 매장 번호 기준으로 조회한다.
// 검색 조건: 기간, 날짜, 검색어
const fetchRecentPayments = async (storeSeqParam) => {
  // 함수 호출 시 storeSeq를 넘기면 그 값을 쓰고,
  // 없으면 현재 선택된 매장 번호를 사용한다.
  const currentStoreSeq =
    storeSeqParam ?? selectedStoreSeq ?? stores?.[0]?.storeSeq;

  // 매장 번호가 없으면 조회하지 않는다.
  if (!currentStoreSeq) {
    console.log("사업장 번호 없음");
    return;
  }

  try {
    // 백엔드 /account/recent-payments 호출
    // 검색 조건을 함께 전달한다.
    const data = await getRecentPayments({
      storeSeq: Number(currentStoreSeq),
      period: transferSearchType,
      startDate: paymentStartDate,
      endDate: paymentEndDate,
      keyword: paymentKeyword,
    });

    console.log("최근 결제 내역 조회 결과:", data);

    // 조회 결과를 화면 state에 저장한다.
    setRecentPayments(data ?? []);
    setRecentPaymentsPage(1);
  } catch (error) {
    console.error("최근 결제 내역 조회 실패:", error);

    // 실패해도 화면이 터지지 않도록 빈 배열 처리한다.
    setRecentPayments([]);
    setRecentPaymentsPage(1);
  }
};


const handleOpenOrderPaymentModal = async () => {
  const currentStoreSeq = selectedStoreSeq ?? stores?.[0]?.storeSeq;

  if (!currentStoreSeq) {
    alert("사업장 정보가 없습니다.");
    return;
  }

  if (cards.length === 0) {
    alert("등록된 카드가 없습니다. 먼저 카드를 등록해 주세요.");
    return;
  }

  try {
    const partners = await getSupplierList(Number(currentStoreSeq));

    console.log("발주 결제 거래처 목록:", partners);

    setOrderPaymentPartners(partners ?? []);
    setSelectedPartnerId("");
    setSelectedOrderIds([]);
    setIsOrderPaymentModalOpen(true);
  } catch (error) {
    console.error("거래처 목록 조회 실패:", error);
    alert("거래처 목록을 불러오지 못했습니다.");
  }
};



// 포트원 : 카드 등록/빌링키 발급 코드
const STORE_ID = "store-d07c8343-3eda-4b37-b1b1-d59c24f3d02d";
const CHANNEL_KEY = "channel-key-3ac881ab-bc4c-4016-b0d0-3c6eb420b83c";

const handleRegisterCard = async () => {
  try {
    const currentStoreSeq = selectedStoreSeq ?? stores?.[0]?.storeSeq;

    console.log("selectedStoreSeq:", selectedStoreSeq);
    console.log("stores:", stores);
    console.log("currentStoreSeq:", currentStoreSeq);
    console.log("userSeq:", userSeq);

    if (!currentStoreSeq) {
      alert("사업장 정보가 없습니다.");
      return;
    }

    if (!newCard.cardCompany) {
      alert("카드사를 선택해 주세요.");
      return;
    }

    if (!newCard.cardName.trim()) {
      alert("카드 별칭을 입력해 주세요.");
      return;
    }

    if (!/^\d{4}$/.test(newCard.cardLast4)) {
      alert("카드 끝 4자리는 숫자 4자리로 입력해 주세요.");
      return;
    }

    const now = Date.now();
    const billingKeyRequestId = `billing-${currentStoreSeq}-${now}`;
    const customerId = `customer-${currentStoreSeq}-${now}`;

    const response = await PortOne.requestIssueBillingKey({
      storeId: STORE_ID,
      channelKey: CHANNEL_KEY,
      billingKeyMethod: "CARD",
      billingKeyRequestId,
      issueId: billingKeyRequestId,
      issueName: "SOSO카드 등록",
      customer: {
        id: customerId,
        fullName: user_nickname || "테스트사업자",
        email: "jihye10226@naver.com",
        phoneNumber: "01073711745"
      },
      
    });

    console.log("포트원 응답:", response);

    if (!response) {
      alert("카드 등록이 취소되었습니다.");
      return;
    }

    if (response.code) {
      console.error("포트원 빌링키 발급 실패:", response);
      alert(`카드 등록 실패: ${response.message}`);
      return;
    }

    console.log("빌링키 발급 성공:", response);

    await registerPaymentCard({
      userSeq: Number(userSeq),
      storeSeq: Number(currentStoreSeq),
      billingKey: response.billingKey,
      cardCompany: newCard.cardCompany,
      cardNumberMasked: `**** **** **** ${newCard.cardLast4}`,
      cardType: "CARD",
      cardName: newCard.cardName.trim(),
    });

    alert("카드 등록 성공");

    setIsCardRegisterModalOpen(false);

    setNewCard({
      cardCompany: "",
      cardLast4: "",
      cardName: "",
    });

    await fetchCards(currentStoreSeq);

  } catch (error) {
    console.error("카드 등록 오류:", error);
    alert(error.message || "카드 등록 중 오류가 발생했습니다.");
  }
};













// 신규 계좌 등록할때 검증/저장
  const handleAddAccount = async () => {

    if (accounts.length >= 4) {
      alert("계좌는 최대 4개까지 등록할 수 있습니다.");
      setIsRegisterModalOpen(false);
      return;
    }
    if (!newAccount.bankName) {
      alert("은행을 선택해 주세요.");
      return;
    }
    if (!newAccount.accountNumber) {
      alert("계좌번호를 입력해 주세요.");
      return;
    }

    const regex = bankRegexMap[newAccount.bankName];
    const cleanAccountNumber = newAccount.accountNumber.replace(/-/g, "");

    if (!regex.test(cleanAccountNumber)) {
      alert(`${newAccount.bankName} 계좌번호 형식이 올바르지 않습니다.`);
      return;
    }
  
    if (!newAccount.accountName) {
      alert("예금주를 입력해 주세요.");
      return;
    }

    if (!accountNameRegex.test(newAccount.accountName.trim())) {
      alert("예금주명은 한글, 영문, 숫자, 공백만 입력할 수 있으며 2~30자여야 합니다.");
      return;
    }

    const currentStoreSeq = selectedStoreSeq ?? stores?.[0]?.storeSeq;

    if (currentStoreSeq === null || currentStoreSeq === undefined || currentStoreSeq === '') {
      alert("사업장 정보가 없습니다.");
      return;
    }

    // 계좌 등록 데이터
    const accountData = {
      storeSeq: Number(currentStoreSeq),
      bankName: newAccount.bankName,
      accountNumber: cleanAccountNumber,
      accountName: newAccount.accountName
    };

    console.log("계좌 정보 : " , accountData);

    await insertAccount(accountData);

    setIsRegisterModalOpen(false);

    await fetchAccountList();

    setIsRegisterModalOpen(false);
    
    // 모달 필드 초기화
    setNewAccount({
      bankName: '', 
      accountNumber: '', 
      accountName: ''
    });
    alert("새 계좌 등록이 완료되었습니다.");
    // 새로 등록한 계좌로 포커스 이동
    setActiveAccountIndex(updatedAccounts.length - 1);
  };

  const handleOpenEditModal = (acc, e) => {
    e.stopPropagation();
    setEditingAccount({ ...acc });
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = () => {
    if (!editingAccount.bankName) {
      alert("은행을 선택해 주세요.");
      return;
    }
    if (!editingAccount.accountNumber) {
      alert("계좌번호를 입력해 주세요.");
      return;
    }
    if (!editingAccount.accountName) {
      alert("예금주명을 입력해 주세요.");
      return;
    }

    setAccounts(accounts.map(a => a.id === editingAccount.id ? editingAccount : a));
    setIsEditModalOpen(false);
    alert("계좌 정보가 수정되었습니다.");
  };

  const handleDeleteAccount = async (acc, e) => {
  e.stopPropagation();

  console.log("삭제할 계좌 acc:", acc);
  console.log("삭제할 accountSeq:", acc.accountSeq);

  const ok = confirm(
    `정말 ${acc.bankName} (${acc.accountNumber}) 계좌를 삭제하시겠습니까?`
  );

  if (!ok) return;

  try {
    await accountDel(acc.accountSeq);

    alert("계좌가 삭제되었습니다.");

    await fetchAccountList();

    setActiveAccountIndex(0);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "계좌 삭제 중 오류가 발생했습니다.";

    alert(message);
  }
};

  const handlePrevAccount = () => {
    setActiveAccountIndex((prev) => (prev === 0 ? accounts.length - 1 : prev - 1));
  };

  const handleNextAccount = () => {
    setActiveAccountIndex((prev) => (prev === accounts.length - 1 ? 0 : prev + 1));
  };

  const handleLogOut = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleStoreSwitch = (storeSeq, companyName) => {
    setSelectedStore(storeSeq, companyName);
    setIsProfileOpen(false);
  };

  const recentPaymentsPerPage = 5;
  const recentPaymentsTotalPages = Math.max(
    1,
    Math.ceil(recentPayments.length / recentPaymentsPerPage)
  );
  const paginatedRecentPayments = recentPayments.slice(
    (recentPaymentsPage - 1) * recentPaymentsPerPage,
    recentPaymentsPage * recentPaymentsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">카드 관리</h2>
            <p className="text-sm text-gray-500">결제 카드를 등록하고 카드 결제 내역을 한눈에 관리하세요.</p>
          </div>
          <div className="flex gap-3">
            {/*
            <button 
              onClick={() => {
                if (accounts.length >= 4) {
                  alert("계좌는 최대 4개까지 등록할 수 있습니다.");
                  return;
                }
                setIsRegisterModalOpen(true);
              }}
              className={`rounded-2xl px-6 py-3 text-sm font-black transition-all ${
                accounts.length >= 4
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                  : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700'
              }`}
            >
              {accounts.length >= 4 ? '계좌 등록 완료 (4/4)' : `+ 새 계좌 등록 (${accounts.length}/4)`}
            </button>
            <button
              type="button"
              onClick={() => setIsAutoTransferModalOpen(true)}
              className="rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-black text-emerald-600 shadow-sm transition-all hover:bg-emerald-50"
            >
              자동이체 설정
            </button>
            */}
            <button
              type="button"
              onClick={() => setIsCardRegisterModalOpen(true)}
              className="rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-black text-emerald-600 shadow-sm transition-all hover:bg-emerald-50"
            >
              카드 등록
            </button>
            <button
              type="button"
              onClick={handleOpenOrderPaymentModal}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700"
            >
              발주 결제하기
            </button>
          </div>
        </div>

        <div className="space-y-7">
          {cards.length > 0 ? (
            <section className="rounded-[28px] border border-gray-100 bg-white p-8 text-gray-900 shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        
        {/* 카드 정보 */}
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-black text-emerald-700">
            {cards[activeCardIndex]?.cardCompany?.substring(0, 2) || "카드"}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black">
                {cards[activeCardIndex]?.cardCompany || "등록 카드"}
              </h3>

              {cards[activeCardIndex]?.isDefault === "Y" && (
                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  대표
                </span>
              )}
            </div>

            <p className="mt-2 text-base font-semibold text-gray-400">
              {cards[activeCardIndex]?.cardNumberMasked || "**** **** **** ****"}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-400">
              {cards[activeCardIndex]?.cardName || "자동결제 카드"}
            </p>
          </div>
        </div>

        {/* 카드 상태 */}
        <div className="text-left lg:text-right">
          <span className="text-sm font-bold text-gray-400">결제수단 상태</span>

          <div className="mt-2 flex flex-col items-start gap-2 lg:items-end">
            <span className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              사용 가능
            </span>

            <span className="text-sm font-bold text-gray-400">
              {cards[activeCardIndex]?.cardType || "CARD"}
            </span>

            <button
              type="button"
              onClick={handleDeleteCard}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-black text-red-500 transition-colors hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      {/* 보유 카드 여러개 출력 */}
      {cards.length > 1 && (
      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const isActive = index === activeCardIndex;

          return (
            <button
              key={card.cardSeq}
              type="button"
              onClick={() => setActiveCardIndex(index)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                isActive
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm font-black text-gray-900">
                  {card.cardCompany || "등록 카드"}
                </strong>

                {isActive && (
                  <span className="rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-black text-emerald-700">
                    선택됨
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs font-bold text-gray-400">
                {card.cardNumberMasked || "**** **** **** ****"}
              </p>

              <p className="mt-1 text-xs font-semibold text-gray-400">
                {card.cardName || "자동결제 카드"}
              </p>
            </button>
          );
        })}
      </div>
    )}
    </section>
            // <section className="rounded-[28px] border border-gray-100 bg-white p-8 text-gray-900 shadow-sm">
            //   <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            //     <div className="flex items-center gap-5">
            //       <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-black text-emerald-700">
            //         {accounts[activeAccountIndex]?.bankName.substring(0, 2)}
            //       </div>
            //       <div>
            //         <div className="flex items-center gap-3">
            //           <h3 className="text-2xl font-black">{accounts[activeAccountIndex]?.bankName}</h3>
            //           {accounts[activeAccountIndex]?.isMain && (
            //             <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">대표</span>
            //           )}
            //         </div>
            //         <p className="mt-2 text-base font-semibold text-gray-400">{accounts[activeAccountIndex]?.accountNumber}</p>
            //       </div>
            //     </div>

            //     <div className="text-left lg:text-right">
            //       <span className="text-sm font-bold text-gray-400">현재 잔액</span>
            //       <div className="mt-1 text-4xl font-black tracking-tight">{formatCurrency(accounts[activeAccountIndex]?.testBalance ?? 0)}</div>
            //     </div>
            //   </div>
            // </section>
          ) : (
            <div className="rounded-[28px] border border-dashed border-gray-300 bg-white p-12 text-center font-bold text-gray-400">
              등록된 결제 계좌가 없습니다. 새 계좌를 추가해 주세요.
            </div>
          )}

          {accounts.length > 0 && (
            <section className="rounded-[28px] border border-gray-100 bg-white p-7 text-gray-900 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-black">내 보유 계좌 <span className="font-medium text-gray-400">({accounts.length}개)</span></h3>
                <span className="text-sm font-bold text-gray-400">
                  총 잔액 <strong className="text-gray-900">{formatCurrency(accounts.reduce((sum, account) => sum + account.testBalance, 0))}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {accounts.map((acc, index) => {
                  const isActive = index === activeAccountIndex;
                  let bankColor = 'bg-emerald-50 text-emerald-700';
                  if (acc.bankName.includes('신한')) bankColor = 'bg-blue-50 text-blue-700';
                  else if (acc.bankName.includes('국민')) bankColor = 'bg-amber-50 text-amber-700';
                  else if (acc.bankName.includes('우리')) bankColor = 'bg-indigo-50 text-indigo-700';

                  return (
                    <article
                      key={acc.accountSeq}
                      onClick={() => setActiveAccountIndex(index)}
                      className={`flex min-h-[250px] cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all ${
                        isActive ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-black ${bankColor}`}>
                              {acc.bankName.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="truncate text-base font-black">{acc.bankName}</h4>
                                {acc.isMain && <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-700">대표</span>}
                              </div>
                              <p className="mt-1 text-xs font-semibold text-gray-400">{formatAccountNumber(acc.bankName, acc.accountNumber)}</p>
                            </div>
                          </div>
                          {isActive && <span className="rounded-xl bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-700">선택됨</span>}
                        </div>
                        <div className={`mt-6 text-2xl font-black ${isActive ? 'text-emerald-600' : 'text-gray-900'}`}>{formatCurrency(acc.testBalance ?? 0)}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTransferAccount(acc);
                            setIsTransferModalOpen(true);
                          }}
                          className="rounded-xl border border-gray-200 py-2.5 text-xs font-black text-gray-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          이체
                        </button>
                        <button type="button" onClick={(e) => handleDeleteAccount(acc, e)} className="rounded-xl border border-gray-200 py-2.5 text-xs font-black text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500">삭제</button>
                      </div>
                    </article>
                  );
                })}
                {Array.from({ length: Math.max(0, 4 - accounts.length) }).map((_, index) => (
                  <button
                    key={`empty-account-${index}`}
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-5 text-center transition-all hover:border-emerald-300 hover:bg-emerald-50/40"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-light text-gray-300 shadow-sm ring-1 ring-gray-100">
                      +
                    </span>
                    <strong className="mt-4 text-sm font-black text-gray-500">계좌 추가</strong>
                    <span className="mt-1 text-xs font-medium text-gray-400">
                      등록 가능한 빈 슬롯입니다.
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="overflow-hidden rounded-[28px] border border-gray-100 bg-white text-gray-900 shadow-sm">
            <div className="border-b border-gray-100 px-7 py-6">
              <h3 className="text-lg font-black">최근 결제 내역</h3>
            </div>
            <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/60 px-7 py-4 xl:flex-row xl:items-center">
              <div className="flex shrink-0 items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
                {[
                  { value: 'week', label: '이번 주' },
                  { value: 'month', label: '한 달' },
                  { value: 'custom', label: '날짜 지정' },
                ].map((period) => (
                  <button
                    key={period.value}
                    type="button"
                    onClick={() => {
                      // 선택한 기간 필터를 저장한다.
                      setTransferSearchType(period.value);

                      // 이번 주나 한 달을 선택하면 직접 지정한 날짜는 초기화한다.
                      if (period.value !== 'custom') {
                        setPaymentStartDate('');
                        setPaymentEndDate('');
                      }
                    }}
                    className={`rounded-lg px-4 py-2 text-xs font-black transition-all ${
                      transferSearchType === period.value
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-600'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <input
                  type="date"
                  aria-label="검색 시작일"
                  value={paymentStartDate}
                  onChange={(e) => {
                    // 시작일을 저장한다.
                    setPaymentStartDate(e.target.value);

                    // 날짜를 직접 선택하면 날짜 지정 필터로 변경한다.
                    setTransferSearchType('custom');
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-600 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10"
                />
                <span className="text-xs font-bold text-gray-300">~</span>
                <input
                  type="date"
                  aria-label="검색 종료일"
                  value={paymentEndDate}
                  onChange={(e) => {
                    // 종료일을 저장한다.
                    setPaymentEndDate(e.target.value);

                    // 날짜를 직접 선택하면 날짜 지정 필터로 변경한다.
                    setTransferSearchType('custom');
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-600 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div className="relative min-w-0 flex-1">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={paymentKeyword}
                  onChange={(e) => {
                    // 검색어를 저장한다.
                    setPaymentKeyword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    // Enter 키를 누르면 검색한다.
                    if (e.key === 'Enter') {
                      fetchRecentPayments();
                    }
                  }}
                  placeholder="은행명, 받는 사람을 검색하세요"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-gray-700 outline-none transition-all placeholder:font-medium placeholder:text-gray-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
                <button
                  type="button"
                  onClick={() => {
                    // 현재 검색 조건으로 최근 결제 내역을 다시 조회한다.
                    fetchRecentPayments();
                  }}
                  className="shrink-0 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white transition-colors hover:bg-emerald-700"
                >
                  검색
                </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] table-fixed text-center">
                <colgroup>
                  <col className="w-[15%]" />
                  <col className="w-[11%]" />
                  <col className="w-[17%]" />
                  <col className="w-[13%]" />
                  <col className="w-[17%]" />
                  <col className="w-[15%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-400">
                  <tr>
                    <th className="px-5 py-4">일시</th>
                    <th className="px-5 py-4">카드사</th>
                    <th className="px-5 py-4">카드번호</th>
                    <th className="px-5 py-4">보낸 사람</th>
                    <th className="px-5 py-4">
                      <span className="mx-auto block w-[150px] pl-12 text-left">받는 사람</span>
                    </th>
                    <th className="px-5 py-4">결제 금액</th>
                    <th className="px-5 py-4">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedRecentPayments.length > 0 ? (
                    paginatedRecentPayments.map((item) => {
                      // 받는 사람 이름 첫 글자
                      const partnerInitial = item.partnerName?.substring(0, 1) || "거";

                      return (
                        <tr
                          key={item.paymentSeq}
                          className="transition-colors hover:bg-emerald-50/20"
                        >
                          {/* 결제 일시 */}
                          <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-gray-500">
                            {item.paidAt}
                          </td>

                          {/* 카드사 */}
                          <td className="px-5 py-5 text-sm font-black text-gray-800">
                            {item.cardCompany || "카드"}
                          </td>

                          {/* 카드번호 마스킹 */}
                          <td className="px-5 py-5 text-sm font-bold text-gray-500">
                            {item.cardNumberMasked || "**** **** **** ****"}
                          </td>

                          {/* 보낸 사람: 내 매장 */}
                          <td className="px-5 py-5 text-sm font-bold text-gray-800">
                            {item.payerName}
                          </td>

                          {/* 받는 사람: 거래처 */}
                          <td className="px-5 py-5">
                            <div className="mx-auto flex w-[150px] items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-700">
                                {partnerInitial}
                              </span>

                              <div className="min-w-0 flex-1 text-left">
                                <p className="truncate whitespace-nowrap text-sm font-black text-gray-900">
                                  {item.partnerName}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* 결제 금액 */}
                          <td className="px-5 py-5 text-base font-black text-gray-900">
                            {formatCurrency(item.totalAmount)}
                          </td>

                          {/* 상태 */}
                          <td className="px-5 py-5">
                            <span className="inline-flex whitespace-nowrap rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
                              {item.status === "PAID" ? "결제 완료" : item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-sm font-bold text-gray-400"
                      >
                        최근 결제 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-6 bg-gray-50/50 flex justify-center border-t border-gray-50">
              <div className="flex gap-2">
                {Array.from({ length: recentPaymentsTotalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setRecentPaymentsPage(pageNumber)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      pageNumber === recentPaymentsPage
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {isTransferModalOpen && transferAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="계좌 이체 닫기"
            onClick={() => setIsTransferModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-fade-in-up">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">계좌 이체</h3>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  받는 분의 계좌 정보와 이체 금액을 입력해 주세요.
                </p>
              </div>
              <button
                type="button"
                aria-label="계좌 이체 닫기"
                onClick={() => setIsTransferModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    출금 계좌
                  </span>
                  <strong className="mt-2 block text-sm font-black text-gray-900">
                    {transferAccount.bankName}
                  </strong>
                  <span className="mt-1 block text-xs font-semibold text-gray-500">
                    {transferAccount.accountNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-gray-400">출금 가능 금액</span>
                  <strong className="mt-2 block text-lg font-black text-emerald-700">
                    {formatCurrency(transferAccount.balance)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    받는 은행
                  </label>
                  <select
                    defaultValue=""
                    value={newAccount.bankName}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                    onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}                
                  >
                    <option value="" disabled>은행 선택</option>
                    <option value="국민은행">국민은행</option>
                    <option value="신한은행">신한은행</option>
                    <option value="우리은행">우리은행</option>
                    <option value="하나은행">하나은행</option>
                    <option value="농협은행">농협은행</option>
                    <option value="카카오뱅크">카카오뱅크</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    받는 분
                  </label>
                  <input
                    type="text"
                    value={newAccount.accountName}
                    onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                    placeholder="예금주명 입력"
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all placeholder:font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  받는 계좌번호
                </label>
                <input
                  type="text"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                  inputMode="numeric"
                  placeholder="'-' 없이 계좌번호 입력"
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all placeholder:font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  이체 금액
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-4 pr-10 text-right text-sm font-black text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-gray-500">
                    원
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  이체 메모
                </label>
                <input
                  type="text"
                  placeholder="메모를 입력해 주세요. (선택)"
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all placeholder:font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="flex-1 rounded-2xl bg-gray-100 py-4 text-sm font-black text-gray-600 transition-colors hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
              >
                이체하기
              </button>
            </div>
          </div>
        </div>
      )}
      {isOrderPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="발주 결제 닫기"
            onClick={() => setIsOrderPaymentModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl animate-fade-in-up">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">발주 결제하기</h3>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  거래처를 선택하고 미결제 발주를 확인한 뒤 등록된 카드로 결제하세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOrderPaymentModalOpen(false)}
                className="text-2xl text-gray-400 transition-colors hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  거래처
                </label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => handlePartnerChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">거래처를 선택해 주세요</option>
                  {orderPaymentPartners.map((partner) => (
                    <option key={partner.storeSeq} value={partner.storeSeq}>
                      {partner.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-black text-gray-900">미결제 발주 목록</h4>
                  <span className="text-xs font-bold text-gray-400">
                    {selectedPartner ? `${payableOrders.length}건` : "거래처 선택 필요"}
                  </span>
                </div>

                {selectedPartner ? (
                  <div className="space-y-3">
                    {payableOrders.map((order) => {
                      const isSelected = selectedOrderIds.includes(Number(order.orderSeq));

                      return (
                        <button
                          key={order.orderSeq}
                          type="button"
                          onClick={() => handleOrderPaymentToggle(order.orderSeq)}
                          className={`w-full rounded-2xl border p-5 text-left transition-all ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
                          }`}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-black ${
                                  isSelected
                                    ? "border-emerald-600 bg-emerald-600 text-white"
                                    : "border-gray-200 bg-white text-white"
                                }`}
                              >
                                ✓
                              </span>

                              <div>
                                <strong className="block text-sm font-black text-gray-900">
                                  {order.title}
                                </strong>
                                <span className="mt-1 block text-xs font-bold text-gray-400">
                                  {order.orderNo} · 발주일 {String(order.createdAt ?? "").substring(0, 10)}
                                </span>
                              </div>
                            </div>
                            <strong className="text-base font-black text-gray-900">
                              {formatCurrency(order.totalAmount)}
                            </strong>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center">
                    <p className="text-sm font-bold text-gray-400">
                      거래처를 선택하면 미결제 발주 목록이 표시됩니다.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    등록된 결제 카드
                  </span>
                  <strong className="mt-3 block text-base font-black text-gray-900">
                    {cards[activeCardIndex]?.cardCompany || "등록된 카드 없음"}
                  </strong>
                  <span className="mt-1 block text-sm font-semibold text-gray-400">
                    {cards[activeCardIndex]?.cardNumberMasked || "카드 등록 후 결제할 수 있습니다."}
                  </span>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                        결제 선택
                      </span>
                      <strong className="mt-3 block text-sm font-black text-gray-900">
                        {selectedOrders.length}건 선택
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-bold text-emerald-700">총 결제 금액</span>
                      <strong className="mt-1 block text-2xl font-black text-emerald-700">
                        {formatCurrency(selectedOrderTotal)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setIsOrderPaymentModalOpen(false)}
                className="flex-1 rounded-2xl bg-gray-100 py-4 text-sm font-black text-gray-600 transition-colors hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="button"
                // 버튼 클릭 시 선택한 발주들을 등록된 카드로 결제 요청
                onClick={handlePayOrders}

                // 발주를 선택하지 않았거나, 카드가 없거나, 결제 처리 중이면 버튼 비활성화
                disabled={selectedOrderIds.length === 0 || cards.length === 0 || isPaying}

                className={`flex-1 rounded-2xl py-4 text-sm font-black transition-colors ${
                  selectedOrderIds.length === 0 || cards.length === 0 || isPaying
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
                }`}
              >
                {/* 결제 요청 중이면 문구 변경 */}
                {isPaying ? "결제 처리 중..." : "등록된 카드로 결제"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isCardRegisterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="카드 등록 닫기"
            onClick={() => setIsCardRegisterModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-fade-in-up">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">카드 등록</h3>
                <p className="mt-1 text-xs font-medium text-gray-400">
                  화면에 표시할 카드 정보를 입력한 뒤 포트원 카드 등록을 진행하세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCardRegisterModalOpen(false)}
                className="text-2xl text-gray-400 transition-colors hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  카드사
                </label>
                <select
                  value={newCard.cardCompany}
                  onChange={(e) => setNewCard({ ...newCard, cardCompany: e.target.value })}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">카드사를 선택해 주세요</option>
                  <option value="신한카드">신한카드</option>
                  <option value="삼성카드">삼성카드</option>
                  <option value="현대카드">현대카드</option>
                  <option value="롯데카드">롯데카드</option>
                  <option value="BC카드">BC카드</option>
                  <option value="하나카드">하나카드</option>
                  <option value="우리카드">우리카드</option>
                  <option value="토스카드">토스카드</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  카드 별칭
                </label>
                <input
                  type="text"
                  value={newCard.cardName}
                  onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
                  placeholder="예: 대표 사업자카드, 개인카드"
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all placeholder:font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  카드 끝 4자리
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={newCard.cardLast4}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setNewCard({ ...newCard, cardLast4: value });
                  }}
                  placeholder="예: 1234"
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all placeholder:font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="mt-2 text-xs font-medium text-gray-400">
                  실제 카드번호 전체는 저장하지 않고 화면 표시용 끝 4자리만 저장합니다.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                <p className="text-xs font-bold leading-6 text-emerald-700">
                  실제 자동결제는 포트원에서 발급받은 빌링키로 처리됩니다.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCardRegisterModalOpen(false)}
                className="flex-1 rounded-2xl bg-gray-100 py-4 text-sm font-black text-gray-600 transition-colors hover:bg-gray-200"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleRegisterCard}
                className="flex-1 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
              >
                포트원 카드 등록
              </button>
            </div>
          </div>
        </div>
      )}
      {isAutoTransferModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="자동이체 설정 닫기"
            onClick={() => setIsAutoTransferModalOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-fade-in-up">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">자동이체 설정</h3>
                <p className="mt-1 text-xs font-medium text-gray-400">정기 결제 정보를 등록하고 자동이체를 관리하세요.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAutoTransferModalOpen(false)}
                className="text-2xl text-gray-400 transition-colors hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">거래처</label>
                <select className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20">
                  <option value="">거래처를 선택해 주세요</option>
                  <option value="daebak">(주)대박식자재</option>
                  <option value="daesung">대성농산</option>
                  <option value="woojin">우진주류</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">출금 계좌</label>
                <select className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20">
                  <option value="">출금 계좌를 선택해 주세요</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} {account.accountNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">예금주</label>
                  <input
                    type="text"
                    placeholder="예금주명 입력"
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">결제일</label>
                  <select className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20">
                    <option value="">일자 선택</option>
                    {Array.from({ length: 31 }, (_, index) => index + 1).map((date) => (
                      <option key={date} value={date}>{date}일</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/50 px-5 py-4">
                <div>
                  <strong className="block text-sm font-black text-gray-800">자동이체 활성화</strong>
                  <span className="mt-1 block text-xs font-medium text-gray-400">설정한 결제일에 자동으로 이체합니다.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAutoTransferEnabled}
                  onClick={() => setIsAutoTransferEnabled(!isAutoTransferEnabled)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    isAutoTransferEnabled ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    isAutoTransferEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAutoTransferModalOpen(false)}
                className="flex-1 rounded-2xl bg-gray-100 py-4 text-sm font-black text-gray-600 transition-colors hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsRegisterModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up my-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900">새 계좌 등록</h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <div className="px-1">
              {/* 계좌 관리 섹션 */}
              <section>
                <h4 className="text-sm font-black text-emerald-600 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                  계좌 관리
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">은행명</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={newAccount.bankName}
                      onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                    >
                      <option value="">은행을 선택해 주세요</option>
                      <option value="신한은행">신한은행</option>
                      <option value="국민은행">국민은행</option>
                      <option value="우리은행">우리은행</option>
                      <option value="하나은행">하나은행</option>
                      <option value="SC제일은행">SC제일은행</option>
                      <option value="한국씨티은행">한국씨티은행</option>
                      <option value="iM뱅크은행">iM뱅크은행</option>
                      <option value="농협은행">농협은행</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">계좌번호</label>
                      <input 
                        type="text" 
                        placeholder="- 없이 입력"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        value={newAccount.accountNumber}
                        onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">예금주</label>
                      <input 
                        type="text" 
                        placeholder="실명 또는 사업자명 입력"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        value={newAccount.accountName}
                        onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </section>

            </div>

            <button 
              onClick={handleAddAccount}
              className="w-full mt-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
            >
              등록 완료
            </button>
          </div>
        </div>
      )}

      {/* 계좌 수정 모달 */}
      {isEditModalOpen && editingAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up my-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900">계좌 정보 수정</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">은행명</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={editingAccount.bankName}
                  onChange={(e) => setEditingAccount({...editingAccount, bankName: e.target.value})}
                >
                  <option value="신한은행">신한은행</option>
                  <option value="국민은행">국민은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">계좌번호</label>
                <input 
                  type="text" 
                  placeholder="- 없이 입력"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={editingAccount.accountNumber}
                  onChange={(e) => setEditingAccount({...editingAccount, accountNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">예금주명</label>
                <input 
                  type="text"
                  placeholder="예금주명 입력"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={editingAccount.accountHolder || ''}
                  onChange={(e) => setEditingAccount({...editingAccount, accountHolder: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-grow py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
              >
                취소
              </button>
              <button 
                onClick={handleUpdateAccount}
                className="flex-grow py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TransferManagementPage;
