import maxios from './axiosConfig';

// 발주 신청시, 내 재고 품목과 거래처 품목 대조
export const check = async (itemName) => {
    const resp = await maxios.get('/order/check', {
        params: {itemName}});
    return resp.data;
}