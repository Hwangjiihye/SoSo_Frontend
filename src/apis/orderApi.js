import maxios from './axiosConfig';

// 발주 신청시, 내 재고 품목과 거래처 품목 대조
export const check = async (itemName) => {
    const resp = await maxios.get('/order/check', {
        params: {itemName}});
    return resp.data;
}

// 발주 신청시, 거래처 품목 리스트 확인
export const items = async (itemName) => {
    const resp = await maxios.get('/order/items', {
        params: {itemName}});
    return resp.data;
}

// 발주 신청 폼에 사업자 정보 불러오기
export const identityCheck = async () => {
    const resp = await maxios.get('/order/identity');
    return resp.data;
}

// 발주서 작성
export const orderForm = async (orderData) => {
    const resp = await maxios.post('/order/form', orderData);
    return resp.data;
}

// 발주서 목록으로 출력
export const orderList = async (keyword = '') => {
    const resp = await maxios.get('/order/list', {
        params : {
            keyword : keyword
        }
    });
    return resp.data;
}