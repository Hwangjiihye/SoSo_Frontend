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