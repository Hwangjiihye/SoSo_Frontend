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
};