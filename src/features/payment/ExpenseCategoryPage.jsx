import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import MainFooter from '../../components/layout/MainFooter';
import { useExpenseCategory } from './hooks/useExpenseCategory';
import { insertExpense, getExpenseTotal, categoryCost, ExpenseDetails,getMyPartners, getGeneralOrdersForExpense, updateExpenseMemo, deleteExpense } from "../../apis/account";

// Chart.js 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

/**
 * @file ExpenseCategoryPage.jsx
 * @description 비용 카테고리 관리 페이지 (payment 도메인)
 * '카테고리1.jpg' 디자인 참고 반영 및 지출 분포 차트 추가
 */
const ExpenseCategoryPage = () => {
  const { categories, isLoading, formatCurrency } = useExpenseCategory();

  const [localCategories, setLocalCategories] = useState([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false); // 비용 등록 모달 상태
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // 지출 상세 모달 상태 추가
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태 추가
  const [ingredientOrderType, setIngredientOrderType] = useState('general');
  const [totalAmount, setTotalAmount] = useState(0);
  const [expenseCategoryTotals, setExpenseCategoryTotals] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [editingExpenseSeq, setEditingExpenseSeq] = useState(null); // 지출 내역 메모 수정
  const [editingMemo, setEditingMemo] = useState(""); // 지출 내역 삭제 


  // 지출 내역 예시 데이터 상태
  const [expenses, setExpenses] = useState([]);

  const ingredientTransactionDetails = {
    1: {
      orderType: 'general',
      supplier: '신선 청과물 시장',
      items: [
        { name: '양파', quantity: '20kg', amount: 45000 },
        { name: '대파', quantity: '10단', amount: 30000 },
        { name: '감자', quantity: '15kg', amount: 45000 },
      ],
    },
    2: {
      orderType: 'group',
      supplier: '동원 유통 정육',
      items: [
        { name: '냉동 삼겹살', quantity: '50kg', amount: 1750000 },
        { name: '돼지 목살', quantity: '20kg', amount: 650000 },
        { name: '소고기 우둔살', quantity: '10kg', amount: 800000 },
      ],
    },
    3: {
      orderType: 'personal',
      supplier: '하나 식자재 마트',
      items: [
        { name: '간장', quantity: '12개', amount: 180000 },
        { name: '고추장', quantity: '8개', amount: 240000 },
        { name: '식용유', quantity: '10개', amount: 360000 },
        { name: '기본 조미료 세트', quantity: '10세트', amount: 400000 },
      ],
    },
  };
  
  // 비용 등록 폼 상태
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    categorySeq: '',
    amount: '',
    title: '',
    memo: ''
  });

  // 월 별 지출 확인
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().substring(0, 7)
  );


  // 엑셀 내보내기
  const formatMonthLabel = (month) => {
  if (!month) return "";

  const [year, monthNumber] = month.split("-");
  return `${year}년 ${Number(monthNumber)}월`;
};

const exportFileName = `${selectedMonth.replace("-", "년_")}월_비용카테고리_지출내역.csv`;

// CSV 값 안전 처리
const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '""';

  let text = String(value)
    .replaceAll('"', '""')
    .replace(/\r?\n|\r/g, " ");

  // CSV Injection 방어
  // 엑셀이 =, +, -, @ 로 시작하는 값을 수식으로 인식하는 것을 막음
  const trimmed = text.trimStart();

  if (/^[=+\-@]/.test(trimmed)) {
    text = `'${text}`;
  }

  return `"${text}"`;
};

const handleExportCsv = async () => {
  const storeSeq = Number(localStorage.getItem("storeSeq"));

  if (!storeSeq) {
    alert("선택된 매장 정보가 없습니다.");
    return;
  }

  try {
    setIsExporting(true);

    const detailResults = await Promise.all(
      localCategories.map(async (cat) => {
        const categorySeq = cat.categorySeq ?? cat.id;
        const categoryName = cat.categoryName ?? cat.name;

        const details = await ExpenseDetails(
          storeSeq,
          selectedMonth,
          categorySeq
        );

        const safeDetails = Array.isArray(details) ? details : [];

        return safeDetails.map((item) => ({
          categoryName,
          ...item,
        }));
      })
    );

    const allExpenses = detailResults.flat();

    if (allExpenses.length === 0) {
      alert("내보낼 지출 내역이 없습니다.");
      return;
    }

    const headers = [
      "카테고리명",
      "지출명",
      "거래일",
      "거래처명",
      "거래품목",
      "구매수량",
      "결제수단",
      "공급가액",
      "부가세",
      "합계금액",
      "메모",
      "참조유형",
      "참조번호",
    ];

    const rows = allExpenses.map((item) => {
      const totalAmount = Number(item.amount || 0);

      // 합계금액이 부가세 포함 금액이라고 보고 계산
      const supplyAmount = Math.round(totalAmount / 1.1);
      const vatAmount = totalAmount - supplyAmount;

      const paymentMethod =
        item.paymentMethod === "card"
          ? "카드"
          : item.paymentMethod === "cash"
            ? "현금"
            : item.paymentMethod === "transfer"
              ? "계좌이체"
              : item.paymentMethod || "-";

      return [
        item.categoryName || "-",
        item.title || "-",
        item.expenseDate || "-",
        item.supplierName || "-",

        // 나중에 백엔드에서 itemSummary가 오면 그걸 쓰고,
        // 지금은 없으니까 지출명으로 대체
        item.itemSummary || item.item_summary || item.title || "-",

        // 나중에 백엔드에서 quantitySummary가 오면 그걸 쓰고,
        // 지금은 수량 데이터가 없으니까 "-" 처리
        item.quantitySummary || item.quantity_summary || "-",

        paymentMethod,
        supplyAmount,
        vatAmount,
        totalAmount,
        item.memo || "-",
        item.refType || "-",
        item.refSeq || "-",
      ];
    });

    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    // 한글 깨짐 방지
    const bom = "\uFEFF";

    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = exportFileName;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    setIsExportModalOpen(false);
  } catch (error) {
    console.error("CSV 내보내기 실패:", error);
    alert("파일을 생성하는 중 오류가 발생했습니다.");
  } finally {
    setIsExporting(false);
  }
};

  const fetchExpenseTotal = async () => {
  const storeSeq = Number(localStorage.getItem("storeSeq"));

  if (!storeSeq) {
    console.log("선택된 매장 없음");
    return;
  }

  try {
    // 전체 월 지출
    const monthlyTotal = await getExpenseTotal(storeSeq, selectedMonth);
    console.log("전체 월 지출 응답:", monthlyTotal);

    setTotalAmount(
      typeof monthlyTotal === "object"
        ? Number(monthlyTotal.totalAmount || monthlyTotal.TOTALAMOUNT || 0)
        : Number(monthlyTotal || 0)
    );

    // 카테고리별 월 지출
    const categoryResult = await categoryCost(storeSeq, selectedMonth);
    console.log("카테고리별 지출 응답:", categoryResult);

    const safeCategoryResult = Array.isArray(categoryResult)
      ? categoryResult
      : [];

    const mergedCategories = categories.map((cat) => {
      const categorySeq = cat.categorySeq ?? cat.id;
      const categoryName = cat.categoryName ?? cat.name;

      const matched = safeCategoryResult.find((item) => {
        const itemCategorySeq =
          item.categorySeq ??
          item.category_seq ??
          item.CATEGORYSEQ ??
          item.CATEGORY_SEQ;

        return Number(itemCategorySeq) === Number(categorySeq);
      });

      const totalAmount =
        matched?.totalAmount ??
        matched?.total_amount ??
        matched?.TOTALAMOUNT ??
        matched?.TOTAL_AMOUNT ??
        0;

      const count =
        matched?.count ??
        matched?.COUNT ??
        0;

      return {
        ...cat,
        categorySeq,
        categoryName,
        totalAmount: Number(totalAmount || 0),
        count: Number(count || 0),
      };
    });

    console.log("합쳐진 카테고리:", mergedCategories);

    setExpenseCategoryTotals(safeCategoryResult);
    setLocalCategories(mergedCategories);
  } catch (error) {
    console.error(error);

    const fallbackCategories = categories.map((cat) => ({
      ...cat,
      categorySeq: cat.categorySeq ?? cat.id,
      categoryName: cat.categoryName ?? cat.name,
      totalAmount: 0,
      count: 0,
    }));

    setLocalCategories(fallbackCategories);
    setTotalAmount(0);
  }
};

  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState('');
  const [selectedGroupPurchase, setSelectedGroupPurchase] = useState('');
  const [selectedGroupPurchaseOrder, setSelectedGroupPurchaseOrder] = useState('');
  const [directPurchaseRows, setDirectPurchaseRows] = useState([{supplierName: "", amount: ""}]);
  const [ingredientExpenseType, setIngredientExpenseType] = useState('general');
  const [partnerList, setPartnerList] = useState([]);
  const [generalOrderList, setGeneralOrderList] = useState([]);
  const [selectedGeneralOrder, setSelectedGeneralOrder] = useState(null);
  const [isGeneralOrderLoading, setIsGeneralOrderLoading] = useState(false);

  // 직접 구매 입력 목록의 총 금액 계산 함수
  // 줄을 추가/삭제/수정해도 항상 현재 directPurchaseRows 기준으로 다시 계산한다.
  const calculateDirectPurchaseTotal = (rows) => {
    return rows.reduce(
      (total, row) => total + Number(row.amount || 0),
      0
    );
  };


  // 직접 구매 입력 줄 추가
  // + 버튼을 누르면 구매처/금액 입력칸이 한 줄 더 생긴다.
  // 직접 구매 입력 줄 추가
  const handleAddDirectPurchaseRow = () => {
    setDirectPurchaseRows((prevRows) => {
      const updatedRows = [
        ...prevRows,
        {
          supplierName: "",
          amount: "",
        },
      ];

      // 줄 추가 후 현재 총 금액 다시 계산
      const totalAmount = calculateDirectPurchaseTotal(updatedRows);

      setExpenseForm((prevForm) => ({
        ...prevForm,
        amount: String(totalAmount),
      }));

      return updatedRows;
    });
  };


// 직접 구매 입력값 변경
// index: 몇 번째 줄인지
// field: supplierName 또는 amount
// value: 사용자가 입력한 값
// 직접 구매 입력값 변경
const handleChangeDirectPurchaseRow = (index, field, value) => {
  setDirectPurchaseRows((prevRows) => {
    const updatedRows = prevRows.map((row, rowIndex) =>
      rowIndex === index
        ? { ...row, [field]: value }
        : row
    );

    // 입력값 변경 후 현재 총 금액 다시 계산
    const totalAmount = calculateDirectPurchaseTotal(updatedRows);

    setExpenseForm((prevForm) => ({
      ...prevForm,
      amount: String(totalAmount),
    }));

    return updatedRows;
  });
};


// 직접 구매 입력 줄 삭제
// 최소 1줄은 남겨둔다.
// 직접 구매 입력 줄 삭제
const handleRemoveDirectPurchaseRow = (index) => {
  setDirectPurchaseRows((prevRows) => {
    // 최소 1줄은 남김
    if (prevRows.length === 1) {
      return prevRows;
    }

    const updatedRows = prevRows.filter(
      (_, rowIndex) => rowIndex !== index
    );

    // 삭제 후 현재 총 금액 다시 계산
    const totalAmount = calculateDirectPurchaseTotal(updatedRows);

    setExpenseForm((prevForm) => ({
      ...prevForm,
      amount: String(totalAmount),
    }));

    return updatedRows;
  });
}


  // 카테고리 판단용
  const selectedExpenseCategory = localCategories.find(
    (cat) => Number(cat.categorySeq ?? cat.id) === Number(expenseForm.categorySeq)
  );

  const isIngredientCategory =
    selectedExpenseCategory?.categoryName === "식자재비" || selectedExpenseCategory?.name === "식자재비";

  // 초기 데이터 연동
  useEffect(() => {
    if (categories && categories.length > 0) {
      const baseCategories = categories.map((cat) => ({
        ...cat,
        categorySeq: cat.categorySeq ?? cat.id,
        categoryName: cat.categoryName ?? cat.name,
        totalAmount: 0,
        count: 0,
      }));

      setLocalCategories(baseCategories);
      fetchExpenseTotal();
    }
  }, [categories, selectedMonth]);


  useEffect(() => {
  const fetchPartners = async () => {
    if (!isExpenseModalOpen) return;
    if (!isIngredientCategory) return;
    if (ingredientExpenseType !== "general") return;

    const storeSeq = Number(localStorage.getItem("storeSeq"));

    if (!storeSeq) {
      console.log("선택된 매장 없음");
      return;
    }

    try {
      const result = await getMyPartners(storeSeq);

      const safeResult = Array.isArray(result)
        ? result
        : result.partners || result.data || [];

      setPartnerList(safeResult);
    } catch (error) {
      console.error("거래처 목록 조회 실패:", error);
      setPartnerList([]);
    }
  };

  fetchPartners();
}, [isExpenseModalOpen, isIngredientCategory, ingredientExpenseType]);


useEffect(() => {
  const fetchGeneralOrders = async () => {
    if (!selectedSupplier) {
      setGeneralOrderList([]);
      setSelectedGeneralOrder(null);
      return;
    }

    if (ingredientExpenseType !== "general") return;

    const storeSeq = Number(localStorage.getItem("storeSeq"));

    if (!storeSeq) {
      console.log("선택된 매장 없음");
      return;
    }

    try {
      setIsGeneralOrderLoading(true);

      const result = await getGeneralOrdersForExpense(
        storeSeq,
        selectedSupplier
      );

      const safeResult = Array.isArray(result)
        ? result
        : result.orders || result.data || [];

      setGeneralOrderList(safeResult);
    } catch (error) {
      console.error("일반 발주 목록 조회 실패:", error);
      setGeneralOrderList([]);
    } finally {
      setIsGeneralOrderLoading(false);
    }
  };

  fetchGeneralOrders();
}, [selectedSupplier, ingredientExpenseType]);

  const getColorClass = (color) => {
    const classes = {
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      pink: 'bg-pink-50 text-pink-600 border-pink-100',
      gray: 'bg-gray-50 text-gray-600 border-gray-100',
    };
    return classes[color] || classes.gray;
  };

  const getChartColors = (color) => {
    const colors = {
      emerald: 'rgba(16, 185, 129, 0.8)',
      blue: 'rgba(59, 130, 246, 0.8)',
      orange: 'rgba(245, 158, 11, 0.8)',
      purple: 'rgba(139, 92, 246, 0.8)',
      pink: 'rgba(236, 72, 153, 0.8)',
      gray: 'rgba(107, 114, 128, 0.8)',
    };
    return colors[color] || colors.gray;
  };

  // 비용 등록 핸들러 (지출 비용 입력 폼 저장 로직)
  // 비용 등록 핸들러
// 일반 발주, 공동 발주, 직접 구매를 구분해서 expenses 테이블에 저장한다.
const handleAddExpense = async (e) => {
  e.preventDefault();

  // 카테고리 선택 여부 확인
  if (!expenseForm.categorySeq) {
    alert("지출 카테고리를 선택해 주세요.");
    return;
  }

  // 지출 내역 입력 여부 확인
  // 직접 구매도 공통으로 지출 내역은 필요하다.
  if (!expenseForm.title.trim()) {
    alert("지출 내역을 입력해 주세요.");
    return;
  }

  try {
    const storeSeq = Number(localStorage.getItem("storeSeq"));

    if (!storeSeq) {
      alert("선택된 매장 정보가 없습니다. 상단에서 매장을 선택해 주세요.");
      return;
    }

    // ================================
    // 직접 구매 등록 처리
    // ================================
    // 직접 구매는 한 번에 여러 줄을 입력할 수 있으므로
    // 입력 줄마다 expenses에 각각 1건씩 저장한다.
    // ================================
    if (isIngredientCategory && ingredientExpenseType === "direct") {
      // 구매처와 금액이 정상 입력된 줄만 사용
      const validRows = directPurchaseRows
        .map((row) => ({
          supplierName: row.supplierName.trim(),
          amount: Number(row.amount || 0),
        }))
        .filter((row) => row.supplierName && row.amount > 0);

      if (validRows.length === 0) {
        alert("직접 구매 내역을 1건 이상 입력해 주세요.");
        return;
      }

      // 직접 구매 최종 총액
      // 등록 직전에 다시 계산해서 금액 꼬임 방지
      const finalDirectPurchaseTotal = calculateDirectPurchaseTotal(validRows);

      if (finalDirectPurchaseTotal <= 0) {
        alert("올바른 지출 금액을 입력해 주세요.");
        return;
      }

      await Promise.all(
        validRows.map((row) =>
          insertExpense(storeSeq, {
            categorySeq: Number(expenseForm.categorySeq),
            expenseDate: expenseForm.date,
            title: expenseForm.title,
            amount: row.amount,
            memo: expenseForm.memo || "",
            paymentMethod: "card",
            supplierName: row.supplierName,
            refType: "DIRECT",
            refSeq: null,
          })
        )
      );

      alert("직접 구매 지출이 등록되었습니다.");

      await fetchExpenseTotal();

      setIsExpenseModalOpen(false);

      setExpenseForm({
        date: new Date().toISOString().substring(0, 10),
        categorySeq: "",
        amount: "",
        title: "",
        memo: "",
      });

      setDirectPurchaseRows([
        {
          supplierName: "",
          amount: "",
        },
      ]);

      setIngredientExpenseType("general");

      return;
    }

    // ================================
    // 공동 발주 직접 등록 처리
    // ================================
    // 공동 발주는 실제 공동구매 테이블과 연결하지 않고,
    // 사용자가 입력한 구매처/금액/지출내역/메모를 expenses에 직접 저장한다.
    if (isIngredientCategory && ingredientExpenseType === "group") {
      // 공동 발주명 또는 구매처 입력 확인
      if (!selectedSupplier.trim()) {
        alert("공동 발주명 또는 구매처를 입력해 주세요.");
        return;
      }

      // 지출 금액 확인
      if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
        alert("올바른 지출 금액을 입력해 주세요.");
        return;
      }

      // 공동 발주 지출 등록 데이터
      const requestData = {
        categorySeq: Number(expenseForm.categorySeq),
        expenseDate: expenseForm.date,

        // 사용자가 입력한 지출 내역
        title: expenseForm.title,

        // 사용자가 입력한 공동 발주 금액
        amount: Number(expenseForm.amount),

        // 사용자가 입력한 메모
        memo: expenseForm.memo || "",

        // 일단 카드로 저장
        paymentMethod: "card",

        // 공동 발주명 또는 구매처
        supplierName: selectedSupplier.trim(),

        // 이 값이 핵심
        // GROUP_ORDER로 저장되어야 상세 모달의 공동 발주 카드에 집계된다.
        refType: "GROUP_ORDER",

        // 아직 실제 공동구매 테이블과 연결하지 않으므로 null
        refSeq: null,
      };

      const result = await insertExpense(storeSeq, requestData);

      if (result.success) {
        alert("공동 발주 지출이 등록되었습니다.");

        // 상단 카테고리 금액/건수 새로고침
        await fetchExpenseTotal();

        // 모달 닫기
        setIsExpenseModalOpen(false);

        // 입력 폼 초기화
        setExpenseForm({
          date: new Date().toISOString().substring(0, 10),
          categorySeq: "",
          amount: "",
          title: "",
          memo: "",
        });

        // 선택값 초기화
        setSelectedSupplier("");
        setSelectedPurchaseOrder("");
        setSelectedGroupPurchase("");
        setSelectedGroupPurchaseOrder("");
        setSelectedGeneralOrder(null);
        setGeneralOrderList([]);

        setDirectPurchaseRows([
          {
            supplierName: "",
            amount: "",
          },
        ]);

        setIngredientExpenseType("general");

        return;
      }

      alert(result.message || "등록 실패");
      return;
    }

    // ================================
    // 일반 발주 등록 검증
    // ================================
    if (isIngredientCategory && ingredientExpenseType === "general") {
      if (!selectedSupplier) {
        alert("거래처를 선택해 주세요.");
        return;
      }

      if (!selectedGeneralOrder) {
        alert("연결할 일반 발주서를 선택해 주세요.");
        return;
      }
    }

    // ================================
    // 일반/기타 지출 금액 검증
    // ================================
    // 직접 구매는 위에서 따로 처리하고 return 했으므로
    // 여기서는 일반 발주나 일반 카테고리만 검사한다.
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) {
      alert("올바른 지출 금액을 입력해 주세요.");
      return;
    }

    // 선택한 거래처 정보 찾기
    const selectedPartner = partnerList.find((partner) => {
      const partnerStoreSeq =
        partner.partnerStoreSeq ??
        partner.storeSeq ??
        partner.partner_store_seq;

      return Number(partnerStoreSeq) === Number(selectedSupplier);
    });

    const selectedPartnerName =
      selectedPartner?.partnerName ??
      selectedPartner?.companyName ??
      selectedPartner?.company_name ??
      "";

    // 일반 발주 또는 일반 지출 등록 데이터
    const requestData = {
      categorySeq: Number(expenseForm.categorySeq),
      expenseDate: expenseForm.date,
      title: expenseForm.title,
      amount: Number(expenseForm.amount),
      memo: expenseForm.memo || "",
      paymentMethod: "card",

      // 일반 발주면 거래처명, 아니면 직접 입력된 supplier 사용
      supplierName:
        isIngredientCategory && ingredientExpenseType === "general"
          ? selectedPartnerName
          : selectedSupplier || "",

      // 일반 발주는 ORDER로 저장
      // 그 외에는 일단 null
      refType:
        isIngredientCategory && ingredientExpenseType === "general"
          ? "ORDER"
          : null,

      // 일반 발주는 연결된 orderSeq 저장
      refSeq:
        isIngredientCategory && ingredientExpenseType === "general"
          ? Number(
              selectedGeneralOrder.orderSeq ??
              selectedGeneralOrder.order_seq ??
              selectedGeneralOrder.id
            )
          : null,
    };

    const result = await insertExpense(storeSeq, requestData);

    if (result.success) {
      alert(result.message);

      // 등록 후 상단 금액/건수 새로고침
      await fetchExpenseTotal();

      // 모달 닫기
      setIsExpenseModalOpen(false);

      // 폼 초기화
      setExpenseForm({
        date: new Date().toISOString().substring(0, 10),
        categorySeq: "",
        amount: "",
        title: "",
        memo: "",
      });

      // 선택값 초기화
      setSelectedSupplier("");
      setSelectedPurchaseOrder("");
      setSelectedGroupPurchase("");
      setSelectedGroupPurchaseOrder("");
      setSelectedGeneralOrder(null);
      setGeneralOrderList([]);

      setDirectPurchaseRows([
        {
          supplierName: "",
          amount: "",
        },
      ]);

      setIngredientExpenseType("general");
    } else {
      alert(result.message || "등록 실패");
    }
  } catch (error) {
    console.error(error);
    alert("지출 비용 등록 중 오류가 발생했습니다.");
  }
};

  // 지출 내역 상세보기 출력
  const handleOpenDetails = async (cat) => {
  const storeSeq = Number(localStorage.getItem("storeSeq"));

  if (!storeSeq) {
    alert("선택된 매장 정보가 없습니다.");
    return;
  }

  try {
    setSelectedCategory(cat);
    setIngredientOrderType("general");

    const result = await ExpenseDetails(
      storeSeq,
      selectedMonth,
      cat.categorySeq
    );

    setExpenses(result);
    setIsDetailsModalOpen(true);
  } catch (error) {
    console.error(error);
    alert("지출 상세 내역을 불러오는 중 오류가 발생했습니다.");
  }
};

// 상세목록 새로고침
const refreshExpenseDetails = async () => {
  const storeSeq = Number(localStorage.getItem("storeSeq"));

  if (!storeSeq || !selectedCategory) return;

  const categorySeq = selectedCategory.categorySeq ?? selectedCategory.id;

  const result = await ExpenseDetails(
    storeSeq,
    selectedMonth,
    categorySeq
  );

  setExpenses(Array.isArray(result) ? result : []);
  await fetchExpenseTotal();
};


// 수정, 저장, 삭제
const getExpenseSeq = (item) => {
  return item.expenseSeq ?? item.expense_seq ?? item.EXPENSE_SEQ ?? item.id;
};

const handleStartEditMemo = (item) => {
  const expenseSeq = getExpenseSeq(item);

  setEditingExpenseSeq(expenseSeq);
  setEditingMemo(item.memo && item.memo !== "-" ? item.memo : "");
};

const handleCancelEditMemo = () => {
  setEditingExpenseSeq(null);
  setEditingMemo("");
};

const handleSaveMemo = async (item) => {
  const storeSeq = Number(localStorage.getItem("storeSeq"));
  const expenseSeq = getExpenseSeq(item);

  if (!storeSeq) {
    alert("선택된 매장 정보가 없습니다.");
    return;
  }

  if (!expenseSeq) {
    alert("지출 번호가 없습니다.");
    return;
  }

  try {
    const result = await updateExpenseMemo(storeSeq, expenseSeq, editingMemo);

    alert(result.message || "메모가 수정되었습니다.");

    setEditingExpenseSeq(null);
    setEditingMemo("");

    await refreshExpenseDetails();
  } catch (error) {
    console.error("메모 수정 실패:", error);
    alert(error.response?.data?.message || "메모 수정 중 오류가 발생했습니다.");
  }
};


const handleDeleteExpense = async (item) => {
  const storeSeq = Number(localStorage.getItem("storeSeq"));
  const expenseSeq = getExpenseSeq(item);

  if (!storeSeq) {
    alert("선택된 매장 정보가 없습니다.");
    return;
  }

  if (!expenseSeq) {
    alert("지출 번호가 없습니다.");
    return;
  }

  const ok = window.confirm("이 지출 내역을 삭제하시겠습니까?");

  if (!ok) return;

  try {
    const result = await deleteExpense(storeSeq, expenseSeq);

    alert(result.message || "지출 내역이 삭제되었습니다.");

    await refreshExpenseDetails();
  } catch (error) {
    console.error("지출 삭제 실패:", error);
    alert(error.response?.data?.message || "지출 삭제 중 오류가 발생했습니다.");
  }
};

  const chartData = {
    labels: localCategories.map(c => c.categoryName),
    datasets: [
      {
        data: localCategories.map(c => Number(c.totalAmount || 0)),
        backgroundColor: localCategories.map(c => getChartColors(c.color)),
        borderWidth: 0,
        hoverOffset: 0
      }
    ]
  };

  const chartOptions = {
    cutout: '70%',
    layout: {
      padding: 8,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return ` ${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };


  const totalExpense = localCategories.reduce(
  (acc, cat) => acc + Number(cat.totalAmount || 0),
  0
);


const getExpenseType = (expense) => {
  const refType =
    expense.refType ??
    expense.ref_type ??
    expense.REF_TYPE ??
    expense.REFTYPE ??
    "";

  if (refType === "ORDER") return "general";
  if (refType === "GROUP_ORDER") return "group";
  if (refType === "DIRECT") return "direct";

  // 식자재비인데 refType이 비어 있는 기존 데이터는 직접 구매로 본다.
  return "direct";
};

const getExpenseAmount = (expense) => {
  return Number(
    expense.amount ??
    expense.totalAmount ??
    expense.total_amount ??
    0
  );
};

const selectedCategorySeq =
  selectedCategory?.categorySeq ??
  selectedCategory?.id;

const detailExpenses = expenses.filter((expense) => {
  const expenseCategorySeq =
    expense.categorySeq ??
    expense.category_seq ??
    expense.CATEGORY_SEQ;

  if (!expenseCategorySeq || !selectedCategorySeq) {
    return true;
  }

  return Number(expenseCategorySeq) === Number(selectedCategorySeq);
});

const isSelectedDetailIngredientCategory =
  selectedCategory?.categoryName === "식자재비" ||
  selectedCategory?.name === "식자재비";

const visibleExpenses =
  isSelectedDetailIngredientCategory
    ? detailExpenses.filter(
        (expense) => getExpenseType(expense) === ingredientOrderType
      )
    : detailExpenses;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">비용 카테고리 관리</h2>
            <p className="text-sm text-gray-500">매장의 지출 항목을 체계적으로 분류하고 관리하세요.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 text-sm font-black text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              엑셀로 내보내기
            </button>
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              className="h-12 rounded-2xl bg-emerald-600 px-6 text-sm font-black text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700"
            >
              + 지출 비용 등록
            </button>
          </div>
        </div>

        {/* 지출 분포 요약 차트 섹션 추가 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="relative flex h-64 w-64 shrink-0 items-center justify-center p-3">
            <div className="relative h-full w-full">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">총 지출액</span>
              <span className="mt-1 text-2xl font-black text-gray-900">{formatCurrency(totalExpense)}</span>
            </div>
          </div>
          
          <div className="grid w-full flex-grow grid-cols-2 gap-8 sm:grid-cols-3">
            {localCategories.map((cat) => (
              <div key={cat.categorySeq} className="flex items-center gap-4">
                <div
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: getChartColors(cat.color) }}
                ></div>
                <div>
                  <div className="text-sm font-bold text-gray-700">
                    {cat.categoryName}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-gray-400">
                    {totalExpense > 0
                      ? ((Number(cat.totalAmount || 0) / totalExpense) * 100).toFixed(1)
                      : '0.0'}
                    %
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold"/>
        {/* 카테고리 그리드 (디자인 참고) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localCategories.map((cat) => (
            <div key={cat.categorySeq} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getColorClass(cat.color)}`}>
                  {cat.categoryName}
                </div>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{Number(cat.totalAmount || 0).toLocaleString()}원</div>
                <div className="text-xs font-bold text-gray-400 mt-1">이번 달 누적 지출 · {cat.count || 0}건</div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                <button 
                  onClick={() => handleOpenDetails(cat)}
                  className="text-xs font-black text-emerald-600 group-hover:underline flex items-center gap-1"
                >
                  상세보기
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}


        </div>

      </main>
      {/* 지출 비용 등록 모달 (카테고리입력.jpg 디자인 참고) */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsExpenseModalOpen(false)}></div>
          <div className={`relative w-full overflow-hidden rounded-3xl bg-white px-8 py-5 shadow-2xl animate-fade-in-up ${
            localCategories.find(cat => cat.id === Number(expenseForm.categorySeq
            ))?.name === '식자재비'
              ? 'max-w-3xl'
              : 'max-w-lg'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">지출 비용 등록</h3>
                <p className="text-xs text-gray-400 mt-1">매장에서 발생한 비용 명세를 정확히 입력해 주세요.</p>
              </div>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            
            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">지출 일자</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">지출 카테고리</label>
                <select 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={expenseForm.categorySeq}
                  onChange={(e) => {
                    setExpenseForm({...expenseForm, categorySeq: e.target.value});
                    setSelectedSupplier('');
                    setSelectedPurchaseOrder('');
                    setSelectedGroupPurchase('');
                    setSelectedGroupPurchaseOrder('');
                    // 직접 구매 입력 목록 초기화
                    setDirectPurchaseRows([{supplierName: "", amount: ""}]);
                    setSelectedGeneralOrder(null);
                    setGeneralOrderList([]);
                    setIngredientExpenseType('general');
                  }}
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  {localCategories.map(cat => (
                    <option
                      key={cat.categorySeq ?? cat.id}
                      value={cat.categorySeq ?? cat.id}
                    >
                      {cat.categoryName ?? cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {isIngredientCategory && (
                <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-black text-gray-900">식자재 구매 유형</h4>
                      <p className="mt-1 text-xs font-medium text-gray-500">
                        비용을 등록할 식자재 구매 유형을 선택하세요.
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-emerald-600 ring-1 ring-emerald-100">
                      식자재비 전용
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-emerald-100/60 p-1.5">
                    {[
                      { value: 'general', label: '일반 발주', description: '거래처 발주서' },
                      { value: 'group', label: '공동 발주', description: '공동구매 내역' },
                      { value: 'direct', label: '직접 구매', description: '현장 직접 구매' },
                    ].map((type) => {
                      const isSelected = ingredientExpenseType === type.value;

                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setIngredientExpenseType(type.value);
                            setSelectedSupplier('');
                            setSelectedPurchaseOrder('');
                            setSelectedGroupPurchase('');
                            setSelectedGroupPurchaseOrder('');
                            // 구매 유형을 바꿀 때 직접 구매 입력 목록 초기화
                            setDirectPurchaseRows([{supplierName: "", amount: ""}]);
                            // 구매 유형이 바뀌면 기존 금액도 초기화
                            setExpenseForm((prev) => ({...prev, amount: ""}));
                          }}
                          className={`rounded-lg px-2 py-3 text-center transition-all ${
                            isSelected
                              ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100'
                              : 'text-emerald-700/50 hover:bg-white/50 hover:text-emerald-700'
                          }`}
                        >
                          <span className="block text-xs font-black sm:text-sm">{type.label}</span>
                          <span className={`mt-1 hidden text-[9px] font-bold sm:block ${
                            isSelected ? 'text-gray-400' : 'text-emerald-700/40'
                          }`}>
                            {type.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {ingredientExpenseType === 'general' ? (
                    <div className="h-[300px] space-y-3 overflow-hidden rounded-xl border border-emerald-100 bg-white/60 p-4">
                      <div>
                        <h5 className="text-xs font-black text-gray-800">일반 발주 내역 연결</h5>
                        <p className="mt-1 text-[11px] font-medium text-gray-400">
                          거래처를 선택한 뒤 비용과 연결할 발주서를 확인하세요.
                        </p>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          거래처명
                        </label>
                        <div className="relative">
                          <select
                            value={selectedSupplier}
                            onChange={(e) => {
                              setSelectedSupplier(e.target.value);
                              setSelectedPurchaseOrder('');
                              setSelectedGeneralOrder(null);
                            }}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm font-bold text-gray-700 outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10"
                          >
                            <option value="">거래처를 선택하세요</option>
                              {partnerList.map((partner) => {
                                const partnerStoreSeq =
                                  partner.partnerStoreSeq ??
                                  partner.storeSeq ??
                                  partner.partner_store_seq;

                                const partnerName =
                                  partner.partnerName ??
                                  partner.companyName ??
                                  partner.company_name;

                                return (
                                  <option key={partnerStoreSeq} value={partnerStoreSeq}>
                                    {partnerName}
                                  </option>
                                );
                              })}
                          </select>
                          <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {selectedSupplier ? (
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              발주서 목록
                            </label>
                            <span className="text-[10px] font-bold text-gray-400">최근 발주 3건</span>
                          </div>

                          <div className="max-h-28 space-y-2 overflow-y-auto">
                            {isGeneralOrderLoading ? (
  <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-white/60 px-4 text-center">
    <p className="text-xs font-bold text-gray-400">
      발주서 목록을 불러오는 중입니다.
    </p>
  </div>
) : generalOrderList.length > 0 ? (
  <div className="max-h-28 space-y-2 overflow-y-auto">
    {generalOrderList.map((order) => {
      const orderSeq = order.orderSeq ?? order.order_seq ?? order.id;
      const orderCode = order.orderCode ?? order.order_code ?? `PO-${orderSeq}`;
      const orderDate = order.orderDate ?? order.order_date ?? order.createdAt ?? "";
      const itemSummary =
        order.itemSummary ??
        order.item_summary ??
        order.title ??
        "발주 품목";

      const amount = Number(
        order.totalAmount ??
        order.total_amount ??
        order.amount ??
        0
      );

      const status =
        order.status ??
        order.orderStatus ??
        order.order_status ??
        "발주 완료";

      const isSelected = String(selectedPurchaseOrder) === String(orderSeq);

      return (
        <button
          key={orderSeq}
          type="button"
          onClick={() => {
            setSelectedPurchaseOrder(orderSeq);
            setSelectedGeneralOrder(order);

            setExpenseForm((prev) => ({
              ...prev,
              amount: String(amount),
              title: itemSummary,
            }));
          }}
          className={`w-full rounded-xl border p-4 text-left transition-all ${
            isSelected
              ? "border-emerald-400 bg-white ring-2 ring-emerald-500/10"
              : "border-gray-100 bg-white/80 hover:border-emerald-200 hover:bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                isSelected
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-gray-300 bg-white"
              }`}
            >
              {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-800">
                      {itemSummary}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-500">
                      {status}
                    </span>
                  </div>

                  <strong className="text-sm font-black text-emerald-600">
                    {formatCurrency(amount)}
                  </strong>
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span>
                    {String(orderDate).substring(0, 10).replaceAll("-", ".")}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="truncate">{orderCode}</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  ) : (
    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-white/60 px-4 text-center">
      <p className="text-xs font-bold text-gray-400">
        선택한 거래처의 일반 발주 내역이 없습니다.
      </p>
    </div>
  )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-white/60 px-4 text-center">
                          <p className="text-xs font-bold text-gray-400">
                            거래처를 선택하면 발주서 목록이 표시됩니다.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : ingredientExpenseType === 'group' ? (
                    <div className="space-y-4 rounded-xl border border-emerald-100 bg-white/60 p-4">
                      <div>
                        <h5 className="text-xs font-black text-gray-800">공동 발주 직접 등록</h5>
                        <p className="mt-1 text-[11px] font-medium text-gray-400">
                          공동 발주 비용 정보를 직접 입력해 주세요.
                        </p>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-[11px] font-bold text-amber-700">
                          공동 발주는 현장 거래이므로 직접 등록해야 합니다.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            공동 발주명 또는 구매처
                        </label>
                          <input
                            type="text"
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            placeholder="예: 중앙시장 채소 공동 발주"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            지출 금액 (원)
                          </label>
                          <input
                            type="number"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                            placeholder="금액 입력"
                            min="0"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-700 outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 rounded-xl border border-emerald-100 bg-white/60 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h5 className="text-xs font-black text-gray-800">직접 구매</h5>
                          <p className="mt-1 text-[11px] font-medium text-gray-400">
                            직접 구매한 비용 정보를 입력해 주세요.
                          </p>
                        </div>

                        {/* 직접 구매 입력 줄 추가 버튼 */}
                        <button
                          type="button"
                          onClick={handleAddDirectPurchaseRow}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-lg font-black text-white transition-colors hover:bg-emerald-700"
                          aria-label="직접 구매 입력 추가"
                        >
                          +
                        </button>
                      </div>

                      <div className="max-h-44 space-y-3 overflow-y-auto pr-1">
                        {directPurchaseRows.map((row, index) => (
                          <div
                            key={index}
                            className="grid gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
                          >
                            {/* 구매처 입력 */}
                            <div>
                              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                구매처 {index + 1}
                              </label>

                              <input
                                type="text"
                                value={row.supplierName}
                                onChange={(e) =>
                                  handleChangeDirectPurchaseRow(
                                    index,
                                    "supplierName",
                                    e.target.value
                                  )
                                }
                                placeholder="예: 하나 식자재 마트"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10"
                                required
                              />
                            </div>

                            {/* 지출 금액 입력 */}
                            <div>
                              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                지출 금액 (원)
                              </label>

                              <input
                                type="number"
                                value={row.amount}
                                onChange={(e) =>
                                  handleChangeDirectPurchaseRow(
                                    index,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                placeholder="금액 입력"
                                min="0"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-700 outline-none transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10"
                                required
                              />
                            </div>

                            {/* 입력 줄 삭제 버튼 */}
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveDirectPurchaseRow(index)}
                                disabled={directPurchaseRows.length === 1}
                                className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-xs font-black text-gray-400 hover:text-red-500 disabled:opacity-30"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {localCategories.find(cat => cat.id === Number(expenseForm.categorySeq))?.name !== '식자재비' && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">지출 금액 (원)</label>
                  <input 
                    type="number" 
                    placeholder="금액 입력"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    min="0"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">지출 내역</label>
                <input 
                  type="text" 
                  placeholder="예: 양파 구매, 5월 임대료 납부"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({...expenseForm, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-widest">메모 (선택, 최대 150자)</label>
                <textarea 
                  placeholder="추가 세부 사항 입력 (최대 150자)"
                  className="h-14 w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={expenseForm.memo}
                  onChange={(e) => setExpenseForm({...expenseForm, memo: e.target.value})}
                  maxLength={150}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button 
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="flex-grow py-3 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 지출 상세 내역 풀 스크린 오버레이 UI (텍스트 잘림 방지 최적화) */}
      {isDetailsModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="상세 내역 닫기"
            onClick={() => setIsDetailsModalOpen(false)}
            className="absolute inset-0 bg-gray-950/45 backdrop-blur-sm"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-detail-title"
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl animate-fade-in-up"
          >
            <header className="border-b border-gray-100 px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-black tracking-wider ${getColorClass(selectedCategory.color)}`}>
                    {selectedCategory.categoryName}
                  </div>
                  <h3 id="expense-detail-title" className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                    지출 상세 내역
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    카테고리에 등록된 지출 내역을 확인할 수 있습니다.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="닫기"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
                  <span className="block text-[11px] font-bold text-gray-400">총 지출 건수</span>
                  <strong className="mt-1 block text-xl font-black text-gray-900">
                    {selectedCategory.count || 0}건
                  </strong>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
                  <span className="block text-[11px] font-bold text-emerald-600/70">누적 지출 금액</span>
                  <strong className="mt-1 block truncate text-xl font-black text-emerald-700">
                    {formatCurrency(selectedCategory.totalAmount || 0)}
                  </strong>
                </div>
              </div>

              {selectedCategory.categoryName === '식자재비' && (
                <div className="mt-4 grid grid-cols-3 rounded-2xl bg-gray-100 p-1.5">
                  {[
                    { value: "general", label: "일반 발주" },
                    { value: "group", label: "공동 발주" },
                    { value: "direct", label: "직접 구매" },
                  ].map((orderType) => {
                    const matchingExpenses = detailExpenses.filter(
                      (expense) => getExpenseType(expense) === orderType.value
                    );

                    const matchingAmount = matchingExpenses.reduce(
                      (total, expense) => total + getExpenseAmount(expense),
                      0
                    );

                    const isActive = ingredientOrderType === orderType.value;

                    return (
                      <button
                        key={orderType.value}
                        type="button"
                        onClick={() => setIngredientOrderType(orderType.value)}
                        className={`rounded-xl px-3 py-3 text-left transition-all ${
                          isActive
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-black">{orderType.label}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                              isActive
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-200/70 text-gray-500"
                            }`}
                          >
                            {matchingExpenses.length}건
                          </span>
                        </div>

                        <span
                          className={`mt-1 block text-xs font-bold ${
                            isActive ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          {formatCurrency(matchingAmount)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </header>

            <div className="flex-1 overflow-y-auto bg-gray-50/70 px-4 py-4 sm:px-8 sm:py-6">
              {visibleExpenses.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                  {visibleExpenses.map((item, index, filteredItems) => (
                      <article
                        key={getExpenseSeq(item)}
                        className={`p-5 transition-colors hover:bg-gray-50/70 sm:p-6 ${
                          index < filteredItems.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 gap-4">
                            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-900 text-white">
                              <span className="text-[9px] font-bold leading-none text-gray-300">
                                {item.expenseDate.split('-')[1]}월
                              </span>
                              <span className="mt-1 text-lg font-black leading-none">
                                {item.expenseDate.split('-')[2]}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h4 className="break-words text-base font-black leading-snug text-gray-900 sm:text-lg">
                                {item.title}
                              </h4>
                              <p className="mt-1 text-xs font-semibold text-gray-400">
                                {item.expenseDate.replaceAll('-', '.')}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                            <div className="flex items-center rounded-xl border border-gray-100 bg-gray-50 p-1">
                              <button
                                type="button"
                                onClick={() => handleStartEditMemo(item)}
                                title="지출 내역 수정"
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-black text-gray-500 transition-all hover:bg-white hover:text-emerald-600 hover:shadow-sm"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.5-10.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                수정
                              </button>
                              <span className="h-4 w-px bg-gray-200" />
                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(item)}
                                title="지출 내역 삭제"
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-black text-gray-400 transition-all hover:bg-white hover:text-red-500 hover:shadow-sm"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8" />
                                </svg>
                                삭제
                              </button>
                            </div>
                            <strong className="text-lg font-black text-emerald-600 sm:text-xl">
                              {formatCurrency(item.amount)}
                            </strong>
                          </div>
                        </div>

                        {selectedCategory.categoryName === '식자재비' && ingredientTransactionDetails[item.id] && (
                          <div className="mt-4 grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:grid-cols-[180px_1fr]">
                            <div>
                              <span className="block text-[10px] font-bold text-emerald-600/70">거래처명</span>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h6" />
                                  </svg>
                                </span>
                                <strong className="text-sm font-black text-gray-800">
                                  {ingredientTransactionDetails[item.id].supplier}
                                </strong>
                              </div>
                            </div>

                            <div className="border-t border-emerald-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                              <div className="grid grid-cols-[1fr_72px_96px] gap-2 border-b border-emerald-100 pb-2 text-[10px] font-bold text-emerald-600/70">
                                <span>거래 품목</span>
                                <span className="text-center">구매 수량</span>
                                <span className="text-right">금액</span>
                              </div>
                              <div className="max-h-40 divide-y divide-gray-100 overflow-y-auto pr-1">
                                {ingredientTransactionDetails[item.id].items.map((transactionItem) => (
                                  <div
                                    key={transactionItem.name}
                                    className="grid grid-cols-[1fr_72px_96px] items-center gap-2 py-2.5 text-xs"
                                  >
                                    <span className="min-w-0 truncate font-bold text-gray-700">
                                      {transactionItem.name}
                                    </span>
                                    <span className="rounded-md bg-white px-2 py-1 text-center font-bold text-gray-500 ring-1 ring-gray-100">
                                      {transactionItem.quantity}
                                    </span>
                                    <strong className="text-right font-black text-gray-800">
                                      {formatCurrency(transactionItem.amount)}
                                    </strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
                          <span className="mb-1 block text-[10px] font-bold text-gray-400">메모</span>

                          {editingExpenseSeq === getExpenseSeq(item) ? (
                            <div className="space-y-3">
                              <textarea
                                value={editingMemo}
                                onChange={(e) => setEditingMemo(e.target.value)}
                                maxLength={150}
                                className="min-h-[90px] w-full resize-none rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-medium text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
                                placeholder="메모를 입력하세요."
                              />

                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={handleCancelEditMemo}
                                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-500 hover:bg-gray-50"
                                >
                                  취소
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSaveMemo(item)}
                                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700"
                                >
                                  저장
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="break-words text-sm font-medium leading-relaxed text-gray-600">
                              {item.memo && item.memo !== "-" ? item.memo : "등록된 메모가 없습니다."}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6M9 8h2m-5 13h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h5 className="mt-4 text-lg font-black text-gray-900">등록된 지출 내역이 없습니다</h5>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    이 카테고리에 지출을 등록하면 상세 내역이 표시됩니다.
                  </p>
                </div>
              )}
            </div>

            <footer className="border-t border-gray-100 bg-white px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-black text-white transition-colors hover:bg-gray-800"
              >
                닫기
              </button>
            </footer>
          </section>
        </div>
      )}

      {false && isDetailsModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[150] bg-gray-50 flex flex-col animate-fade-in-up overflow-hidden">
          {/* 상단 내비게이션 바 */}
          <header className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="group flex items-center gap-2 text-gray-400 hover:text-emerald-600 transition-all"
              >
                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="font-bold text-sm">목록으로 돌아가기</span>
              </button>
              <div className="h-8 w-[1px] bg-gray-100"></div>
              <div>
                <div className={`w-fit px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border mb-1 ${getColorClass(selectedCategory.color)}`}>
                  {selectedCategory.categoryName}
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">상세 지출 내역 리포트</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-8 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">총 지출 건수</span>
                <span className="text-xl font-black text-gray-800">{selectedCategory.count}건</span>
              </div>
              <div className="w-[1px] h-6 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">누적 합계 금액</span>
                <span className="text-2xl font-black text-emerald-600">{formatCurrency(selectedCategory.totalAmount)}</span>
              </div>
            </div>
          </header>

          {/* 메인 컨텐츠 영역 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50">
            <div className="max-w-6xl mx-auto px-8 py-12">
              <div className="grid grid-cols-1 gap-8">
                {expenses.filter(exp => exp.categorySeq === selectedCategory.id).length > 0 ? (
                  expenses
                    .filter(exp => exp.categorySeq === selectedCategory.id)
                    .map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-emerald-100 transition-all group"
                      >
                        <div className="p-8 md:p-10">
                          {/* 상단 정보: 날짜 및 금액 */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-50 pb-8">
                            <div className="flex items-center gap-5">
                              <div className="bg-emerald-600 text-white rounded-2xl px-6 py-3 text-center shadow-lg shadow-emerald-100">
                                <div className="text-xs font-bold opacity-80 uppercase tracking-tighter mb-0.5">
                                  {item.expenseDate.split('-')[0]}년 {item.expenseDate.split('-')[1]}월
                                </div>
                                <div className="text-3xl font-black leading-none">
                                  {item.expenseDate.split('-')[2]}일
                                </div>
                              </div>
                              <div>
                                <h4 className="text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
                                  {item.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                  <span className="text-sm font-bold text-gray-400">지출 정산 승인 완료</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-8 py-4 rounded-3xl border border-gray-100 text-right self-start md:self-center">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">지출 금액</span>
                              <div className="text-3xl font-black text-emerald-600">
                                {formatCurrency(item.amount)}
                              </div>
                            </div>
                          </div>

                          {/* 메모 영역 (공간을 최대한 활용) */}
                          <div className="relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-50 rounded-full"></div>
                            <div className="pl-8">
                              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                                <span className="text-lg">📋</span> 비고 및 상세 메모
                              </span>
                              <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-50 text-lg font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {editingExpenseSeq === getExpenseSeq(item) ? (
                                    <div className="space-y-3">
                                      <textarea
                                        value={editingMemo}
                                        onChange={(e) => setEditingMemo(e.target.value)}
                                        maxLength={150}
                                        className="min-h-[90px] w-full resize-none rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-medium text-gray-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
                                        placeholder="메모를 입력하세요."
                                      />

                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={handleCancelEditMemo}
                                          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-500"
                                        >
                                          취소
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleSaveMemo(item)}
                                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700"
                                        >
                                          저장
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    item.memo && item.memo !== "-"
                                      ? item.memo
                                      : "등록된 추가 메모 사항이 없습니다."
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-white rounded-[40px] border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                      <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h5 className="text-2xl font-black text-gray-900 mb-2">지출 내역이 비어있습니다</h5>
                    <p className="text-gray-400 font-bold text-lg">해당 카테고리에 등록된 상세 지출 데이터가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 하단 푸터 (플로팅 버튼 느낌) */}
          <footer className="p-8 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center sticky bottom-0">
            <button 
              onClick={() => setIsDetailsModalOpen(false)}
              className="w-full max-w-md py-5 bg-gray-900 text-white hover:bg-black rounded-[24px] font-black text-lg shadow-2xl shadow-gray-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              확인 완료 및 닫기
            </button>
          </footer>
        </div>
      )}

      {isExportModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="엑셀 내보내기 모달 닫기"
            onClick={() => setIsExportModalOpen(false)}
            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-export-modal-title"
            className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-7 py-6">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
                    <path d="M14 3v5h5M9 12l6 6M15 12l-6 6" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <h3 id="expense-export-modal-title" className="text-xl font-black text-gray-900">
                    비용 카테고리 엑셀 내보내기
                  </h3>
                  <p className="mt-2 text-xs font-medium leading-5 text-gray-500">
                    선택한 기간의 카테고리별 지출 내역을 엑셀 파일로 생성합니다.
                    <br />
                    카테고리별 지출 금액과 상세 지출 내역을 함께 확인할 수 있습니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setIsExportModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto px-7 py-6">
              <div>
                <p className="mb-2 text-xs font-black text-gray-500">대상 기간</p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-black text-gray-800">
                  {formatMonthLabel(selectedMonth)}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-black text-gray-500">내보낼 카테고리</p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-black text-gray-800">
                  전체 카테고리
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-black text-gray-500">포함 항목</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    '카테고리명',
                    '지출명',
                    '거래일',
                    '거래처명',
                    '거래 품목',
                    '구매 수량',
                    '결제수단',
                    '공급가액',
                    '부가세',
                    '합계금액',
                    '메모',
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-black text-gray-500">파일 정보</p>
                <div className="space-y-2 rounded-xl border border-gray-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-bold text-gray-400">파일명</span>
                    <span className="font-black text-gray-800">{exportFileName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-bold text-gray-400">형식</span>
                    <span className="font-black text-emerald-600">.csv</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 px-7 py-5">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="h-12 flex-1 rounded-xl border border-gray-200 text-sm font-black text-gray-500 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={isExporting}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-black text-white transition-colors ${
                  isExporting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isExporting ? "생성 중..." : "엑셀 다운로드"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpenseCategoryPage;
