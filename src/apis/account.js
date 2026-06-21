import axiosInstance from './axiosConfig';

// 계좌 등록
export const insertAccount = async (accountData) => {
    const resp = await axiosInstance.post('/account/accountSystem', accountData)
    return resp.data;
};

// 계좌 출력
export const accountList = async (storeSeq) => {
    const resp = await axiosInstance.get('/account/accountList', {
        params : {storeSeq}
    })
    return resp.data;
};

// 계좌 삭제
export const accountDel = async (accountSeq) => {
    const resp = await axiosInstance.delete(`/account/accountDel/${accountSeq}`)
    return resp.data;
};

// 자동이체 설정 목록 조회
export const autoSchedule = async (storeSeq) => {
    const resp = await axiosInstance.get("/account/autoPaymentSchedule", {
        params : {storeSeq}
    });
    return resp.data;
};


// 카드 저장
// 포트원에서 발급받은 billingKey를 우리 DB에 저장
export const registerPaymentCard = async (cardData) => {
  const response = await axiosInstance.post("/account/cards", cardData);
  return response.data;
};

// 카드 목록 조회
// 선택된 사업장(storeSeq)에 등록된 카드 목록 조회
export const getPaymentCards = async (storeSeq) => {
  const response = await axiosInstance.get("/account/cards", {
    params: { storeSeq },
  });
  return response.data;
};

// 카드 삭제
// 백엔드에서는 실제 삭제보다 is_active = 'N' 처리 추천
export const deletePaymentCard = async (cardSeq) => {
  const response = await axiosInstance.delete(`/account/cards/${cardSeq}`);
  return response.data;
};

// 대표 카드 설정
// 같은 사업장의 기존 대표카드는 해제하고 선택 카드만 대표로 설정
export const setDefaultPaymentCard = async (storeSeq, cardSeq) => {
  const response = await axiosInstance.patch(
    `/account/cards/${cardSeq}/default`,
    null,
    {
      params: { storeSeq },
    }
  );
  return response.data;
};

// 지출 비용 등록
export const insertExpense = async (storeSeq, data) => {
  const response = await axiosInstance.post(`/expense/${storeSeq}`, data)
  return response.data;
}

// 월별 지출 출력
export const getExpenseTotal = async (storeSeq, month) => {
  const response = await axiosInstance.get(`/expense/${storeSeq}/total`, {
    params: { month },
  });

  return response.data;
};

// 월별 카테고리별 지출 출력
export const categoryCost = async (storeSeq, month) => {
  const response = await axiosInstance.get(`/expense/${storeSeq}/categoryCost`, {
    params: { month },
  });

  return response.data;
}

// 카테고리별 상세 내역 출력
export const ExpenseDetails = async (storeSeq, month, categorySeq) => {
  const response = await axiosInstance.get(`/expense/${storeSeq}/details`, {
    params: {
      month,
      categorySeq,
    },
  });

  return response.data;
};

// 내가 등록한 거래처 목록 조회
export const getMyPartners = async (storeSeq) => {
  const response = await axios.get(`/api/account/my-partners/${storeSeq}`);
  return response.data;
};

// 발주 결제 요청
// PaymentController의 @RequestMapping("/account") 기준으로
// /account/order/pay API에 결제 요청 데이터를 보냄
export const payOrdersByCard = async (data) => {
  const response = await axiosInstance.post("/account/order/pay", data);

  // 백엔드에서 받은 결제 결과 반환
  return response.data;
};

// 이체관리 최근 결제 내역 조회
// 현재 매장에서 카드로 결제한 내역을 가져온다.
export const getRecentPayments = async (storeSeq) => {
  const response = await axiosInstance.get("/account/recent-payments", {
    params: { storeSeq },
  });

  return response.data;
};


// 거래처 로그인 기준 수금관리 대시보드 조회 API
// 백엔드 요청 주소: GET /account/collection?storeSeq=매장번호
// storeSeq: 현재 로그인한 거래처의 매장 번호
export const getCollectionDashboard = async (storeSeq) => {
  // 백엔드 PaymentController의 @RequestMapping("/account") + @GetMapping("/collection") 호출
  const response = await axiosInstance.get('/account/collection', {
    params: {
      storeSeq: storeSeq,
    },
  });

  // 백엔드에서 내려준 수금관리 데이터 반환
  return response.data;
};